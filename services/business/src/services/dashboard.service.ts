import { PrismaClient } from '../../prisma/generated/client';

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

  /**
   * GET /dashboard/sales-trends
   * Tendências de vendas (hora a hora ou diárias)
   */
  async getSalesTrends(userId: string, period: 'hoje' | 'semana' | 'mes' = 'hoje') {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId }
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    const now = new Date();
    let startDate = new Date();
    let groupBy: 'hour' | 'day' = 'hour';

    switch (period) {
      case 'hoje':
        startDate.setHours(0, 0, 0, 0);
        groupBy = 'hour';
        break;
      case 'semana':
        startDate.setDate(now.getDate() - 7);
        groupBy = 'day';
        break;
      case 'mes':
        startDate.setMonth(now.getMonth() - 1);
        groupBy = 'day';
        break;
    }

    const orders = await prisma.order.findMany({
      where: {
        restaurantId: restaurant.id,
        orderDate: {
          gte: startDate
        },
        status: 'completed'
      },
      orderBy: { orderDate: 'asc' }
    });

    // Agrupar por hora ou dia
    const trends: Record<string, { revenue: number; orders: number }> = {};

    orders.forEach(order => {
      let key: string;
      const date = new Date(order.orderDate);

      if (groupBy === 'hour') {
        // Hora do dia (0-23)
        key = `${date.getHours()}:00`;
      } else {
        // Dia da semana ou data
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
      }

      if (!trends[key]) {
        trends[key] = { revenue: 0, orders: 0 };
      }

      trends[key].revenue += order.total;
      trends[key].orders += 1;
    });

    // Converter para array ordenado
    const data = Object.entries(trends)
      .map(([label, values]) => ({
        label,
        revenue: values.revenue,
        orders: values.orders
      }))
      .sort((a, b) => {
        if (groupBy === 'hour') {
          return parseInt(a.label) - parseInt(b.label);
        }
        return a.label.localeCompare(b.label);
      });

    return {
      period,
      groupBy,
      data
    };
  }

  /**
   * GET /dashboard/menu-engineering
   * Matriz de rentabilidade (Stars, Dogs, Gems, Populars)
   */
  async getMenuEngineering(userId: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId }
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    const products = await prisma.product.findMany({
      where: { restaurantId: restaurant.id }
    });

    if (products.length === 0) {
      return {
        stars: [],
        gems: [],
        populars: [],
        dogs: [],
        summary: {
          totalProducts: 0,
          totalRevenue: 0,
          avgMargin: 0
        }
      };
    }

    // Calcular métricas
    const totalRevenue = products.reduce((sum, p) => sum + p.totalRevenue, 0);
    const avgSales = products.reduce((sum, p) => sum + p.sales, 0) / products.length;
    const margins = products.map(p => ((p.price - p.cost) / p.price) * 100);
    const avgMargin = margins.reduce((sum, m) => sum + m, 0) / margins.length;

    // Classificar produtos
    const classified = products.map(p => {
      const margin = ((p.price - p.cost) / p.price) * 100;
      const isHighMargin = margin > avgMargin;
      const isHighVolume = p.sales > avgSales;

      let category: 'star' | 'gem' | 'popular' | 'dog';
      if (isHighMargin && isHighVolume) category = 'star';
      else if (isHighMargin && !isHighVolume) category = 'gem';
      else if (!isHighMargin && isHighVolume) category = 'popular';
      else category = 'dog';

      return {
        id: p.id,
        name: p.name,
        category: p.category,
        sales: p.sales,
        revenue: p.totalRevenue,
        price: p.price,
        cost: p.cost,
        margin: parseFloat(margin.toFixed(1)),
        classification: category,
        // Para o scatter plot
        x: p.sales, // Eixo X: volume de vendas
        y: margin   // Eixo Y: margem %
      };
    });

    // Agrupar por classificação
    const stars = classified.filter(p => p.classification === 'star');
    const gems = classified.filter(p => p.classification === 'gem');
    const populars = classified.filter(p => p.classification === 'popular');
    const dogs = classified.filter(p => p.classification === 'dog');

    // Calcular potencial de revenue por categoria
    const gemsPotential = gems.reduce((sum, p) => sum + (p.price * 50), 0); // Se venderem 50 unidades
    const popularsPotential = populars.reduce((sum, p) => {
      // Se aumentarem margem em 5%
      const currentProfit = (p.price - p.cost) * p.sales;
      const newPrice = p.price * 1.05;
      const newProfit = (newPrice - p.cost) * p.sales;
      return sum + (newProfit - currentProfit);
    }, 0);

    return {
      stars: stars.sort((a, b) => b.revenue - a.revenue),
      gems: gems.sort((a, b) => b.margin - a.margin),
      populars: populars.sort((a, b) => b.sales - a.sales),
      dogs: dogs.sort((a, b) => a.revenue - b.revenue),
      summary: {
        totalProducts: products.length,
        totalRevenue,
        avgMargin: parseFloat(avgMargin.toFixed(1)),
        avgSales: Math.round(avgSales)
      },
      opportunities: {
        gems: {
          count: gems.length,
          potential: gemsPotential,
          suggestion: `Promover ${gems.length} produtos "Gemas" com destaque no menu pode gerar +€${gemsPotential.toFixed(0)} em revenue.`
        },
        populars: {
          count: populars.length,
          potential: popularsPotential,
          suggestion: `Otimizar custos de ${populars.length} produtos "Populares" pode aumentar margem em €${popularsPotential.toFixed(0)}.`
        },
        dogs: {
          count: dogs.length,
          potential: 0,
          suggestion: dogs.length > 0
            ? `Considere remover ou reformular ${dogs.length} produtos de baixo desempenho para liberar espaço no menu.`
            : 'Nenhum produto para remover no momento.'
        }
      }
    };
  }

  /**
   * GET /dashboard/ai-prediction
   * Previsão IA com sugestões acionáveis
   */
  async getAIPrediction(userId: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
      include: { settings: true }
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    // Analisar últimos 30 dias de vendas
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await prisma.order.findMany({
      where: {
        restaurantId: restaurant.id,
        orderDate: {
          gte: thirtyDaysAgo
        },
        status: 'completed'
      }
    });

    // Calcular média de vendas por dia da semana
    const salesByDayOfWeek: Record<number, number[]> = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    };

    orders.forEach(order => {
      const dayOfWeek = new Date(order.orderDate).getDay();
      salesByDayOfWeek[dayOfWeek].push(order.total);
    });

    // Próximo dia da semana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDayOfWeek = tomorrow.getDay();

    const tomorrowSales = salesByDayOfWeek[tomorrowDayOfWeek];
    const avgTomorrowRevenue = tomorrowSales.length > 0
      ? tomorrowSales.reduce((a, b) => a + b, 0) / tomorrowSales.length
      : 0;

    // Calcular tendência
    const lastWeekSales = salesByDayOfWeek[tomorrowDayOfWeek].slice(-4);
    const avgLastWeek = lastWeekSales.length > 0
      ? lastWeekSales.reduce((a, b) => a + b, 0) / lastWeekSales.length
      : 0;

    const trend = avgLastWeek > 0
      ? ((avgTomorrowRevenue - avgLastWeek) / avgLastWeek) * 100
      : 0;

    // Produto mais vendido
    const products = await prisma.product.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { sales: 'desc' },
      take: 1
    });

    const topProduct = products[0];
    const estimatedCovers = Math.round(avgTomorrowRevenue / (restaurant.averageTicket || 25));

    // Gerar sugestão
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const tomorrowName = dayNames[tomorrowDayOfWeek];

    let suggestion = '';
    let action = '';

    if (trend > 15) {
      suggestion = `${tomorrowName} deverá ter um aumento de ${trend.toFixed(0)}% na procura. Prepare +${Math.ceil(estimatedCovers * 0.15)} cobertos e reforce o stock de ${topProduct?.name || 'produtos populares'}.`;
      action = 'Ajustar Stock';
    } else if (trend < -15) {
      suggestion = `${tomorrowName} prevê-se mais calmo (-${Math.abs(trend).toFixed(0)}%). Aproveite para reduzir staff de sala em 1-2 pax e focus em preparação de pratos especiais.`;
      action = 'Otimizar Staff';
    } else {
      suggestion = `${tomorrowName} deverá ter procura estável (~€${avgTomorrowRevenue.toFixed(0)}). Prepare ${estimatedCovers} cobertos e mantenha níveis normais de stock.`;
      action = 'Manter Operação';
    }

    return {
      date: tomorrow.toISOString().split('T')[0],
      dayOfWeek: tomorrowName,
      estimatedRevenue: avgTomorrowRevenue,
      estimatedCovers,
      trend: `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`,
      isUp: trend > 0,
      confidence: 85, // Simplificado - em produção seria cálculo ML real
      suggestion,
      action,
      topProduct: topProduct?.name || 'N/A'
    };
  }

  /**
   * GET /dashboard/demand-forecast
   * Previsão de demanda para próximos 7 dias
   */
  async getDemandForecast(userId: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId }
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    // Analisar últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await prisma.order.findMany({
      where: {
        restaurantId: restaurant.id,
        orderDate: {
          gte: thirtyDaysAgo
        },
        status: 'completed'
      }
    });

    // Agrupar vendas por dia da semana
    const salesByDayOfWeek: Record<number, { revenue: number[]; orders: number[] }> = {
      0: { revenue: [], orders: [] },
      1: { revenue: [], orders: [] },
      2: { revenue: [], orders: [] },
      3: { revenue: [], orders: [] },
      4: { revenue: [], orders: [] },
      5: { revenue: [], orders: [] },
      6: { revenue: [], orders: [] }
    };

    orders.forEach(order => {
      const dayOfWeek = new Date(order.orderDate).getDay();
      salesByDayOfWeek[dayOfWeek].revenue.push(order.total);
      salesByDayOfWeek[dayOfWeek].orders.push(1);
    });

    // Gerar previsão para próximos 7 dias
    const forecast = [];
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      const dayOfWeek = targetDate.getDay();

      const historicalRevenue = salesByDayOfWeek[dayOfWeek].revenue;
      const historicalOrders = salesByDayOfWeek[dayOfWeek].orders;

      // Calcular média
      const avgRevenue = historicalRevenue.length > 0
        ? historicalRevenue.reduce((a, b) => a + b, 0) / historicalRevenue.length
        : 0;

      const avgOrders = historicalOrders.length;

      // Aplicar fator de sazonalidade (fim de semana +20%, meio da semana -10%)
      let seasonalityFactor = 1.0;
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Domingo ou Sábado
        seasonalityFactor = 1.2;
      } else if (dayOfWeek === 2 || dayOfWeek === 3) { // Terça ou Quarta
        seasonalityFactor = 0.9;
      }

      const predictedRevenue = avgRevenue * seasonalityFactor;
      const predictedOrders = Math.round(avgOrders * seasonalityFactor);

      // Calcular confiança (baseado em quantidade de dados históricos)
      const confidence = Math.min(95, Math.round((historicalRevenue.length / 4) * 100));

      forecast.push({
        date: targetDate.toISOString().split('T')[0],
        dayName: dayNames[dayOfWeek],
        dayOfWeek,
        revenue: Math.round(predictedRevenue),
        orders: predictedOrders,
        confidence,
        trend: dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6 ? 'up' : 'stable'
      });
    }

    // Calcular totais
    const totalPredictedRevenue = forecast.reduce((sum, f) => sum + f.revenue, 0);
    const totalPredictedOrders = forecast.reduce((sum, f) => sum + f.orders, 0);

    return {
      forecast,
      summary: {
        totalRevenue: totalPredictedRevenue,
        totalOrders: totalPredictedOrders,
        avgDailyRevenue: Math.round(totalPredictedRevenue / 7),
        peakDay: forecast.reduce((max, f) => f.revenue > max.revenue ? f : max, forecast[0]),
        confidence: Math.round(forecast.reduce((sum, f) => sum + f.confidence, 0) / 7)
      }
    };
  }

  /**
   * GET /dashboard/peak-hours-heatmap
   * Mapa de calor com horários de pico semanais
   */
  async getPeakHoursHeatmap(userId: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId }
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    // Analisar últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await prisma.order.findMany({
      where: {
        restaurantId: restaurant.id,
        orderDate: {
          gte: thirtyDaysAgo
        },
        status: 'completed'
      }
    });

    // Criar matriz 7 dias x 24 horas
    const heatmapData: Record<number, Record<number, { count: number; revenue: number }>> = {};

    // Inicializar matriz
    for (let day = 0; day < 7; day++) {
      heatmapData[day] = {};
      for (let hour = 0; hour < 24; hour++) {
        heatmapData[day][hour] = { count: 0, revenue: 0 };
      }
    }

    // Preencher com dados reais
    orders.forEach(order => {
      const date = new Date(order.orderDate);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();

      heatmapData[dayOfWeek][hour].count += 1;
      heatmapData[dayOfWeek][hour].revenue += order.total;
    });

    // Encontrar intensidade máxima (para normalização)
    let maxCount = 0;
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        if (heatmapData[day][hour].count > maxCount) {
          maxCount = heatmapData[day][hour].count;
        }
      }
    }

    // Converter para formato do frontend
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const heatmap = [];

    for (let day = 0; day < 7; day++) {
      const dayData = [];
      for (let hour = 0; hour < 24; hour++) {
        const cell = heatmapData[day][hour];
        const intensity = maxCount > 0 ? (cell.count / maxCount) * 100 : 0;

        dayData.push({
          hour,
          count: cell.count,
          revenue: Math.round(cell.revenue),
          intensity: Math.round(intensity) // 0-100 para cor do heatmap
        });
      }

      heatmap.push({
        day,
        dayName: dayNames[day],
        hours: dayData
      });
    }

    // Identificar peak hours globais
    const allCells = heatmap.flatMap(day =>
      day.hours.map(h => ({ day: day.dayName, hour: h.hour, count: h.count, revenue: h.revenue }))
    );

    const peakHours = allCells
      .filter(c => c.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      heatmap,
      peakHours,
      summary: {
        totalOrders: orders.length,
        busiestDay: heatmap.reduce((max, day) => {
          const dayTotal = day.hours.reduce((sum, h) => sum + h.count, 0);
          const maxTotal = max.hours.reduce((sum, h) => sum + h.count, 0);
          return dayTotal > maxTotal ? day : max;
        }),
        busiestHour: peakHours[0]?.hour || 12,
        maxIntensity: maxCount
      }
    };
  }

  /**
   * GET /dashboard/benchmark
   * Benchmark vs. Setor (comparação com médias do mercado)
   */
  async getBenchmark(userId: string) {
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
      include: { settings: true }
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    // Obter dados atuais do restaurante (último mês)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const orders = await prisma.order.findMany({
      where: {
        restaurantId: restaurant.id,
        orderDate: {
          gte: lastMonth
        },
        status: 'completed'
      }
    });

    const products = await prisma.product.findMany({
      where: { restaurantId: restaurant.id }
    });

    // Calcular métricas do restaurante
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Food Cost médio
    const foodCosts = products.map(p => (p.cost / p.price) * 100);
    const avgFoodCost = foodCosts.length > 0
      ? foodCosts.reduce((sum, fc) => sum + fc, 0) / foodCosts.length
      : 0;

    // Calcular revenue per seat (se tiver mesas configuradas)
    const tables = restaurant.tables || 20; // Default 20 mesas
    const seatsPerTable = 4; // Default 4 lugares por mesa
    const totalSeats = tables * seatsPerTable;
    const revenuePerSeat = totalRevenue / totalSeats;

    // Taxa de ocupação estimada (baseado em ticket médio e capacidade)
    const maxDailyCapacity = totalSeats * 2; // 2 rotações por dia
    const daysInMonth = 30;
    const maxMonthlyOrders = maxDailyCapacity * daysInMonth;
    const occupancyRate = (totalOrders / maxMonthlyOrders) * 100;

    // BENCHMARKS DO SETOR (médias de mercado - Portugal/Europa)
    const industryBenchmarks = {
      foodCost: {
        min: 28,
        max: 32,
        ideal: 30,
        label: 'Food Cost Ideal'
      },
      avgTicket: {
        casual: 15,
        midRange: 25,
        fine: 40,
        label: 'Ticket Médio por Segmento'
      },
      occupancyRate: {
        min: 60,
        ideal: 75,
        max: 85,
        label: 'Taxa de Ocupação'
      },
      revenuePerSeat: {
        casual: 800,
        midRange: 1200,
        fine: 2000,
        label: 'Revenue per Seat/Mês'
      }
    };

    // Determinar segmento do restaurante (baseado em ticket médio)
    let segment: 'casual' | 'midRange' | 'fine' = 'midRange';
    if (avgTicket < 20) segment = 'casual';
    else if (avgTicket > 35) segment = 'fine';

    // Comparações
    const comparisons = {
      foodCost: {
        yours: parseFloat(avgFoodCost.toFixed(1)),
        industry: industryBenchmarks.foodCost.ideal,
        status: avgFoodCost <= industryBenchmarks.foodCost.max ? 'good' : 'warning',
        diff: parseFloat((avgFoodCost - industryBenchmarks.foodCost.ideal).toFixed(1)),
        label: 'Food Cost %'
      },
      avgTicket: {
        yours: parseFloat(avgTicket.toFixed(2)),
        industry: industryBenchmarks.avgTicket[segment],
        status: avgTicket >= industryBenchmarks.avgTicket[segment] ? 'good' : 'warning',
        diff: parseFloat((avgTicket - industryBenchmarks.avgTicket[segment]).toFixed(2)),
        label: 'Ticket Médio'
      },
      occupancyRate: {
        yours: parseFloat(occupancyRate.toFixed(1)),
        industry: industryBenchmarks.occupancyRate.ideal,
        status: occupancyRate >= industryBenchmarks.occupancyRate.min ? 'good' : 'warning',
        diff: parseFloat((occupancyRate - industryBenchmarks.occupancyRate.ideal).toFixed(1)),
        label: 'Taxa de Ocupação %'
      },
      revenuePerSeat: {
        yours: parseFloat(revenuePerSeat.toFixed(2)),
        industry: industryBenchmarks.revenuePerSeat[segment],
        status: revenuePerSeat >= industryBenchmarks.revenuePerSeat[segment] * 0.8 ? 'good' : 'warning',
        diff: parseFloat((revenuePerSeat - industryBenchmarks.revenuePerSeat[segment]).toFixed(2)),
        label: 'Revenue per Seat'
      }
    };

    // Classificação geral de performance
    const scores = Object.values(comparisons).map(c => c.status === 'good' ? 1 : 0) as number[];
    const totalScore = scores.reduce((sum: number, s: number) => sum + s, 0);
    const scorePercentage = (totalScore / scores.length) * 100;

    let performanceRating: 'excellent' | 'good' | 'average' | 'below' = 'average';
    let performanceLabel = 'Médio';
    let performanceColor = 'yellow';

    if (scorePercentage >= 75) {
      performanceRating = 'excellent';
      performanceLabel = 'Excelente';
      performanceColor = 'green';
    } else if (scorePercentage >= 50) {
      performanceRating = 'good';
      performanceLabel = 'Bom';
      performanceColor = 'blue';
    } else if (scorePercentage < 25) {
      performanceRating = 'below';
      performanceLabel = 'Abaixo da Média';
      performanceColor = 'red';
    }

    // Identificar oportunidades automaticamente
    const opportunities = [];

    if (comparisons.foodCost.status === 'warning') {
      opportunities.push({
        type: 'cost',
        title: 'Reduzir Food Cost',
        description: `Seu food cost de ${avgFoodCost.toFixed(1)}% está acima do ideal (30%). Reveja fornecedores e porções.`,
        impact: 'high',
        potentialSavings: totalRevenue * ((avgFoodCost - 30) / 100)
      });
    }

    if (comparisons.avgTicket.status === 'warning') {
      opportunities.push({
        type: 'revenue',
        title: 'Aumentar Ticket Médio',
        description: `Ticket médio de €${avgTicket.toFixed(2)} está abaixo do mercado ${segment} (€${industryBenchmarks.avgTicket[segment]}). Implemente upselling.`,
        impact: 'high',
        potentialRevenue: (industryBenchmarks.avgTicket[segment] - avgTicket) * totalOrders
      });
    }

    if (comparisons.occupancyRate.status === 'warning') {
      opportunities.push({
        type: 'capacity',
        title: 'Melhorar Taxa de Ocupação',
        description: `Taxa de ocupação de ${occupancyRate.toFixed(1)}% está abaixo do ideal (75%). Aumente marketing e sistema de reservas.`,
        impact: 'medium',
        potentialRevenue: (maxMonthlyOrders * 0.75 - totalOrders) * avgTicket
      });
    }

    if (comparisons.revenuePerSeat.status === 'warning') {
      opportunities.push({
        type: 'efficiency',
        title: 'Otimizar Revenue per Seat',
        description: `Revenue per Seat de €${revenuePerSeat.toFixed(2)} está abaixo do mercado. Aumente rotação de mesas.`,
        impact: 'medium',
        potentialRevenue: (industryBenchmarks.revenuePerSeat[segment] - revenuePerSeat) * totalSeats
      });
    }

    return {
      segment,
      segmentLabel: segment === 'casual' ? 'Casual Dining' : segment === 'fine' ? 'Fine Dining' : 'Mid-Range',
      performance: {
        rating: performanceRating,
        label: performanceLabel,
        color: performanceColor,
        score: scorePercentage
      },
      comparisons,
      opportunities,
      summary: {
        totalRevenue,
        totalOrders,
        avgTicket,
        avgFoodCost,
        occupancyRate,
        revenuePerSeat,
        totalSeats
      }
    };
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
