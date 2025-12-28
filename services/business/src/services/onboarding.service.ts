import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import fs from 'fs';

const prisma = new PrismaClient();

export interface OnboardingData {
  userId: string;

  // Step 1: Dados do Restaurante
  restaurantName: string;
  address?: string;
  cuisine: string;
  tables?: number;
  openHour?: string;
  closeHour?: string;

  // Step 2: Menu
  menuUploadType: 'excel' | 'manual';
  menuFile?: string; // Path to uploaded file
  menuItems?: Array<{
    name: string;
    category: string;
    price: number;
    cost: number;
    description?: string;
    popularity?: number;
  }>;

  // Step 3: Financeiro
  monthlyCosts?: number;
  staffCount?: number;
  averageTicket?: number;
  suppliers?: string;

  // Step 4: Objetivos
  revenueGoal?: number;
  foodCostTarget?: number;
  tableRotation?: number;
  segment?: string;
}

export class OnboardingService {
  /**
   * Setup inicial do restaurante
   */
  async setupRestaurant(data: OnboardingData) {
    // Check if user already has a restaurant
    const existing = await prisma.restaurant.findUnique({
      where: { userId: data.userId }
    });

    if (existing) {
      throw new Error('User already has a restaurant configured');
    }

    // Create restaurant
    const restaurant = await prisma.restaurant.create({
      data: {
        userId: data.userId,
        name: data.restaurantName,
        address: data.address,
        cuisine: data.cuisine,
        tables: data.tables,
        openHour: data.openHour,
        closeHour: data.closeHour,
        monthlyCosts: data.monthlyCosts,
        staffCount: data.staffCount,
        averageTicket: data.averageTicket,
        suppliers: data.suppliers,
        onboardingCompleted: false
      }
    });

    // Create settings
    const settings = await prisma.restaurantSettings.create({
      data: {
        restaurantId: restaurant.id,
        revenueGoal: data.revenueGoal,
        foodCostTarget: data.foodCostTarget,
        tableRotation: data.tableRotation,
        segment: data.segment
      }
    });

    // Process menu
    let products = [];
    if (data.menuUploadType === 'excel' && data.menuFile) {
      products = await this.processExcelMenu(restaurant.id, data.menuFile);
    } else if (data.menuItems && data.menuItems.length > 0) {
      products = await this.createManualProducts(restaurant.id, data.menuItems);
    }

    // Mark onboarding as completed
    await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { onboardingCompleted: true }
    });

    // Calculate initial insights
    const insights = await this.calculateInsights(restaurant.id, products);

    return {
      restaurant,
      settings,
      products,
      insights
    };
  }

  /**
   * Processar ficheiro Excel com menu
   */
  async processExcelMenu(restaurantId: string, filePath: string) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    const products = [];

    for (const row of rows) {
      // Expected columns: Nome, Categoria, Preço, Custo, Descrição, Popularidade
      const name = row['Nome'] || row['Name'] || row['nome'];
      const category = row['Categoria'] || row['Category'] || row['categoria'];
      const price = parseFloat(row['Preço'] || row['Price'] || row['preco'] || 0);
      const cost = parseFloat(row['Custo'] || row['Cost'] || row['custo'] || 0);
      const description = row['Descrição'] || row['Description'] || row['descricao'] || '';
      const popularity = parseInt(row['Popularidade'] || row['Popularity'] || row['popularidade'] || 3);

      if (!name || !category) continue; // Skip invalid rows

      const product = await prisma.product.create({
        data: {
          restaurantId,
          name,
          category,
          price,
          cost,
          description,
          popularity: Math.min(Math.max(popularity, 0), 10) // 0-10
        }
      });

      products.push(product);
    }

    // Delete uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return products;
  }

  /**
   * Criar produtos manualmente
   */
  async createManualProducts(restaurantId: string, items: OnboardingData['menuItems']) {
    if (!items) return [];

    const products = [];

    for (const item of items) {
      const product = await prisma.product.create({
        data: {
          restaurantId,
          name: item.name,
          category: item.category,
          price: item.price,
          cost: item.cost,
          description: item.description,
          popularity: item.popularity || 3
        }
      });

      products.push(product);
    }

    return products;
  }

  /**
   * Calcular insights iniciais
   */
  async calculateInsights(restaurantId: string, products: any[]) {
    const insights = {
      totalProducts: products.length,
      avgFoodCost: 0,
      avgMargin: 0,
      potentialRevenue: 0,
      criticalAlerts: 0,
      opportunities: 0,
      recommendations: [] as string[]
    };

    if (products.length === 0) {
      return insights;
    }

    // Calculate metrics
    let totalFoodCost = 0;
    let totalMargin = 0;
    let highMarginLowSales = 0;

    for (const product of products) {
      const foodCostPct = (product.cost / product.price) * 100;
      const margin = ((product.price - product.cost) / product.price) * 100;

      totalFoodCost += foodCostPct;
      totalMargin += margin;

      // High margin (>60%) but low popularity (<4)
      if (margin > 60 && product.popularity < 4) {
        highMarginLowSales++;
      }

      // High food cost (>35%)
      if (foodCostPct > 35) {
        insights.criticalAlerts++;
        insights.recommendations.push(
          `"${product.name}" tem food cost de ${foodCostPct.toFixed(1)}% (> 35%). Reveja o fornecedor ou ajuste o preço.`
        );
      }
    }

    insights.avgFoodCost = totalFoodCost / products.length;
    insights.avgMargin = totalMargin / products.length;

    // Opportunities
    if (highMarginLowSales > 0) {
      insights.opportunities = highMarginLowSales;
      insights.recommendations.push(
        `${highMarginLowSales} pratos com alta margem (>60%) mas baixa popularidade. Promova-os para aumentar receita!`
      );
    }

    // Potential revenue (estimate)
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { settings: true }
    });

    if (restaurant?.tables && restaurant?.averageTicket) {
      const tableRotation = restaurant.settings?.tableRotation || 2;
      const dailyPotential = restaurant.tables * tableRotation * restaurant.averageTicket;
      const monthlyPotential = dailyPotential * 30;
      insights.potentialRevenue = monthlyPotential;
    }

    return insights;
  }

  /**
   * Gerar template Excel para download
   */
  async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Menu');

    // Headers
    worksheet.columns = [
      { header: 'Nome', key: 'nome', width: 30 },
      { header: 'Categoria', key: 'categoria', width: 20 },
      { header: 'Preço', key: 'preco', width: 12 },
      { header: 'Custo', key: 'custo', width: 12 },
      { header: 'Descrição', key: 'descricao', width: 40 },
      { header: 'Popularidade', key: 'popularidade', width: 15 }
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Sample data
    const samples = [
      { nome: 'Hambúrguer Gourmet', categoria: 'Main Course', preco: 12.99, custo: 4.50, descricao: 'Hambúrguer artesanal com queijo cheddar', popularidade: 5 },
      { nome: 'Pizza Margherita', categoria: 'Main Course', preco: 14.50, custo: 5.20, descricao: 'Pizza clássica italiana', popularidade: 5 },
      { nome: 'Salada Caesar', categoria: 'Salads', preco: 9.99, custo: 2.80, descricao: 'Salada com alface e croutons', popularidade: 4 }
    ];

    samples.forEach(sample => {
      worksheet.addRow(sample);
    });

    // Add instructions
    worksheet.addRow([]);
    worksheet.addRow(['INSTRUÇÕES:']);
    worksheet.addRow(['1. Preencha cada linha com um prato do seu menu']);
    worksheet.addRow(['2. Popularidade: 1 (baixa) a 10 (alta)']);
    worksheet.addRow(['3. Preço e Custo em euros (ex: 12.50)']);
    worksheet.addRow(['4. Apague as 3 linhas de exemplo antes de fazer upload']);

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}

export const onboardingService = new OnboardingService();
