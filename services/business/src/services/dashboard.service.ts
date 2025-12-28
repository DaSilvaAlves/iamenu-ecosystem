import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DashboardService {
  /**
   * GET /dashboard/stats
   * Estatísticas gerais (receita, clientes, ticket médio, food cost)
   */
  async getStats(userId: string, period: 'hoje' | 'semana' | 'mes' | 'ano' = 'semana') {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
      include: { settings: true }
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'hoje':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'semana':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'mes':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'ano':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Get orders in period
    const orders = await prisma.order.findMany({
      where: {
        restaurantId: restaurant.id,
        orderDate: {
          gte: startDate
        },
        status: 'completed'
      }
    });

    // Calculate metrics
    const totalReceita = orders.reduce((sum, order) => sum + order.total, 0);
    const totalClientes = orders.length; // Each order = 1 customer (simplificado)
    const ticketMedio = totalClientes > 0 ? totalReceita / totalClientes : 0;

    // Calculate food cost
    const products = await prisma.product.findMany({
      where: { restaurantId: restaurant.id }
    });

    let avgFoodCost = 0;
    if (products.length > 0) {
      const totalFoodCost = products.reduce((sum, p) => sum + (p.cost / p.price) * 100, 0);
      avgFoodCost = totalFoodCost / products.length;
    }

    // Calculate trends (comparar com período anterior)
    const previousStart = new Date(startDate);
    const periodDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    previousStart.setDate(previousStart.getDate() - periodDays);

    const previousOrders = await prisma.order.findMany({
      where: {
        restaurantId: restaurant.id,
        orderDate: {
          gte: previousStart,
          lt: startDate
        },
        status: 'completed'
      }
    });

    const previousReceita = previousOrders.reduce((sum, o) => sum + o.total, 0);
    const receitaTrend = previousReceita > 0
      ? ((totalReceita - previousReceita) / previousReceita) * 100
      : 0;

    const previousClientes = previousOrders.length;
    const clientesTrend = previousClientes > 0
      ? ((totalClientes - previousClientes) / previousClientes) * 100
      : 0;

    const previousTicket = previousClientes > 0 ? previousReceita / previousClientes : 0;
    const ticketTrend = previousTicket > 0
      ? ((ticketMedio - previousTicket) / previousTicket) * 100
      : 0;

    // Food cost trend
    const foodCostTarget = restaurant.settings?.foodCostTarget || 30;
    const foodCostStatus = avgFoodCost <= foodCostTarget ? 'Ótimo' : 'Atenção';

    return {
      receita: {
        value: totalReceita,
        formatted: `€${totalReceita.toFixed(2)}`,
        trend: `${receitaTrend > 0 ? '+' : ''}${receitaTrend.toFixed(1)}%`,
        isUp: receitaTrend > 0,
        vs: this.getPeriodLabel(period)
      },
      clientes: {
        value: totalClientes,
        trend: `${clientesTrend > 0 ? '+' : ''}${clientesTrend.toFixed(1)}%`,
        isUp: clientesTrend > 0,
        vs: this.getPeriodLabel(period)
      },
      ticketMedio: {
        value: ticketMedio,
        formatted: `€${ticketMedio.toFixed(2)}`,
        trend: `${ticketTrend > 0 ? '+' : ''}${ticketTrend.toFixed(1)}%`,
        isUp: ticketTrend > 0,
        vs: `Meta: €${restaurant.averageTicket || 25}`
      },
      foodCost: {
        value: avgFoodCost,
        formatted: `${avgFoodCost.toFixed(1)}%`,
        trend: foodCostStatus,
        isUp: avgFoodCost <= foodCostTarget,
        vs: `Meta: ${foodCostTarget}%`
      }
    };
  }

  /**
   * GET /dashboard/top-products
   * Top produtos mais vendidos
   */
  async getTopProducts(userId: string, limit: number = 5) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId }
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    const products = await prisma.product.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { sales: 'desc' },
      take: limit
    });

    return products.map(p => {
      const margin = ((p.price - p.cost) / p.price) * 100;
      let classification = 'standard';

      if (margin > 60 && p.sales > 50) classification = 'star';
      else if (margin > 60 && p.sales <= 50) classification = 'gem';
      else if (margin <= 40 && p.sales > 50) classification = 'popular';
      else if (margin <= 40 && p.sales <= 50) classification = 'dog';

      return {
        id: p.id,
        name: p.name,
        category: p.category,
        sales: p.sales,
        revenue: p.totalRevenue,
        margin: `${margin.toFixed(1)}%`,
        classification,
        trend: p.sales > 30 ? 'up' : 'down'
      };
    });
  }

  /**
   * GET /dashboard/alerts
   * Alertas críticos
   */
  async getAlerts(userId: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
      include: { settings: true }
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    const alerts = [];

    // Alert 1: Food Cost Spike
    const products = await prisma.product.findMany({
      where: { restaurantId: restaurant.id }
    });

    const highCostProducts = products.filter(p => {
      const foodCostPct = (p.cost / p.price) * 100;
      return foodCostPct > 35;
    });

    if (highCostProducts.length > 0) {
      const product = highCostProducts[0];
      const foodCostPct = ((product.cost / product.price) * 100).toFixed(1);

      alerts.push({
        type: 'critical',
        title: 'Food Cost Elevado',
        subtitle: `Critical Impact • ${product.name}`,
        description: `O produto "${product.name}" tem um food cost de ${foodCostPct}%, acima dos 35% recomendados. Reveja o fornecedor ou ajuste o preço.`,
        time: '2h ago',
        action: 'Rever Produto',
        actionUrl: `/products/${product.id}`
      });
    }

    // Alert 2: Low Revenue vs Goal
    const totalRevenue = products.reduce((sum, p) => sum + p.totalRevenue, 0);
    const revenueGoal = restaurant.settings?.revenueGoal || 50000;

    if (totalRevenue < revenueGoal * 0.7) {
      alerts.push({
        type: 'warning',
        title: 'Receita Abaixo da Meta',
        subtitle: 'Warning • Revenue Gap',
        description: `Receita atual (€${totalRevenue.toFixed(2)}) está 30% abaixo da meta mensal de €${revenueGoal}.`,
        time: '1d ago',
        action: 'Ver Estratégias',
        actionUrl: '/dashboard/opportunities'
      });
    }

    return alerts;
  }

  /**
   * GET /dashboard/opportunities
   * Oportunidades de melhoria
   */
  async getOpportunities(userId: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId }
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    const opportunities = [];

    // Opportunity 1: High Margin Low Sales
    const products = await prisma.product.findMany({
      where: { restaurantId: restaurant.id }
    });

    const gems = products.filter(p => {
      const margin = ((p.price - p.cost) / p.price) * 100;
      return margin > 60 && p.sales < 20;
    });

    if (gems.length > 0) {
      const totalPotential = gems.reduce((sum, p) => sum + p.price * 50, 0);

      opportunities.push({
        type: 'revenue',
        title: 'Produtos "Gemas" Não Promovidos',
        subtitle: `Opportunity • ${gems.length} produtos`,
        description: `${gems.length} produtos têm margem alta (>60%) mas vendas baixas. Promova-os com destaque no menu ou ofertas especiais.`,
        potentialRevenue: totalPotential,
        action: 'Ver Produtos',
        actionUrl: '/products?filter=gems'
      });
    }

    // Opportunity 2: Peak Hours Optimization
    if (restaurant.tables && restaurant.tables > 10) {
      opportunities.push({
        type: 'capacity',
        title: 'Otimização de Horário de Pico',
        subtitle: 'Opportunity • Reservas',
        description: `Com ${restaurant.tables} mesas, implementar sistema de reservas pode aumentar rotação em 25% durante fins de semana.`,
        potentialRevenue: 1200,
        action: 'Criar Sistema de Reservas',
        actionUrl: '/settings/reservations'
      });
    }

    return opportunities;
  }

  // Helper
  private getPeriodLabel(period: string): string {
    const labels: Record<string, string> = {
      'hoje': 'vs. ontem',
      'semana': 'vs. semana anterior',
      'mes': 'vs. mês anterior',
      'ano': 'vs. ano anterior'
    };
    return labels[period] || 'vs. período anterior';
  }
}

export const dashboardService = new DashboardService();
