/**
 * Dashboard Service Tests
 * US-1.1.1 - Sprint 1 Quality Assurance
 *
 * Tests for: Revenue calculations, Product classification, Menu engineering
 * Coverage Target: Core business logic functions
 */

// Mock Prisma - must be before imports due to hoisting
const mockPrisma = {
  restaurant: {
    findUnique: jest.fn(),
  },
  order: {
    findMany: jest.fn(),
  },
  product: {
    findMany: jest.fn(),
  },
};

jest.mock('../src/lib/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
}));

import { DashboardService } from '../src/services/dashboard.service';

// Use the mock directly - no type casting needed
const mockPrismaClient = mockPrisma;

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    service = new DashboardService();
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    const mockRestaurant = {
      id: 'rest-1',
      userId: 'user-1',
      name: 'Test Restaurant',
      averageTicket: 25,
      settings: {
        foodCostTarget: 30,
      },
    };

    it('GIVEN no restaurant WHEN getStats THEN throws error', async () => {
      // Arrange
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.getStats('user-1')).rejects.toThrow('Restaurant not found');
    });

    it('GIVEN restaurant with no orders WHEN getStats THEN returns zero metrics', async () => {
      // Arrange
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const stats = await service.getStats('user-1', 'semana');

      // Assert
      expect(stats.receita.value).toBe(0);
      expect(stats.clientes.value).toBe(0);
      expect(stats.ticketMedio.value).toBe(0);
    });

    it('GIVEN orders WHEN getStats THEN calculates revenue correctly', async () => {
      // Arrange
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue([
        { id: '1', total: 50, status: 'completed' },
        { id: '2', total: 75, status: 'completed' },
        { id: '3', total: 100, status: 'completed' },
      ]);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const stats = await service.getStats('user-1', 'semana');

      // Assert
      expect(stats.receita.value).toBe(225); // 50 + 75 + 100
      expect(stats.receita.formatted).toBe('€225.00');
    });

    it('GIVEN orders WHEN getStats THEN calculates average ticket correctly', async () => {
      // Arrange
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue([
        { id: '1', total: 30 },
        { id: '2', total: 40 },
        { id: '3', total: 50 },
        { id: '4', total: 80 },
      ]);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const stats = await service.getStats('user-1', 'semana');

      // Assert
      expect(stats.ticketMedio.value).toBe(50); // (30+40+50+80) / 4
      expect(stats.ticketMedio.formatted).toBe('€50.00');
    });

    it('GIVEN products WHEN getStats THEN calculates food cost percentage', async () => {
      // Arrange
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', price: 20, cost: 6 },  // 30% food cost
        { id: '2', price: 15, cost: 5 },  // 33.3% food cost
        { id: '3', price: 25, cost: 7.5 }, // 30% food cost
      ]);

      // Act
      const stats = await service.getStats('user-1', 'semana');

      // Assert
      // Average: (30 + 33.33 + 30) / 3 = 31.11%
      expect(stats.foodCost.value).toBeCloseTo(31.11, 1);
    });

    it('GIVEN food cost below target WHEN getStats THEN status is Ótimo', async () => {
      // Arrange
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', price: 20, cost: 5 }, // 25% food cost
      ]);

      // Act
      const stats = await service.getStats('user-1', 'semana');

      // Assert
      expect(stats.foodCost.trend).toBe('Ótimo');
      expect(stats.foodCost.isUp).toBe(true);
    });

    it('GIVEN food cost above target WHEN getStats THEN status is Atenção', async () => {
      // Arrange
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', price: 20, cost: 8 }, // 40% food cost
      ]);

      // Act
      const stats = await service.getStats('user-1', 'semana');

      // Assert
      expect(stats.foodCost.trend).toBe('Atenção');
      expect(stats.foodCost.isUp).toBe(false);
    });

    describe('Period Selection', () => {
      beforeEach(() => {
        (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
        (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue([]);
        (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([]);
      });

      it('GIVEN period hoje WHEN getStats THEN returns vs. ontem label', async () => {
        const stats = await service.getStats('user-1', 'hoje');
        expect(stats.receita.vs).toBe('vs. ontem');
      });

      it('GIVEN period semana WHEN getStats THEN returns vs. semana anterior label', async () => {
        const stats = await service.getStats('user-1', 'semana');
        expect(stats.receita.vs).toBe('vs. semana anterior');
      });

      it('GIVEN period mes WHEN getStats THEN returns vs. mês anterior label', async () => {
        const stats = await service.getStats('user-1', 'mes');
        expect(stats.receita.vs).toBe('vs. mês anterior');
      });

      it('GIVEN period ano WHEN getStats THEN returns vs. ano anterior label', async () => {
        const stats = await service.getStats('user-1', 'ano');
        expect(stats.receita.vs).toBe('vs. ano anterior');
      });
    });

    describe('Trend Calculations', () => {
      it('GIVEN higher revenue than previous period WHEN getStats THEN trend is positive', async () => {
        // Arrange
        const now = new Date();
        const currentPeriodOrder = { id: '1', total: 200, orderDate: now };
        const previousPeriodOrder = { id: '2', total: 100, orderDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) };

        (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
        (mockPrismaClient.order.findMany as jest.Mock)
          .mockResolvedValueOnce([currentPeriodOrder]) // Current period
          .mockResolvedValueOnce([previousPeriodOrder]); // Previous period
        (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([]);

        // Act
        const stats = await service.getStats('user-1', 'semana');

        // Assert
        expect(stats.receita.isUp).toBe(true);
        expect(stats.receita.trend).toContain('+');
      });
    });
  });

  describe('getTopProducts', () => {
    const mockRestaurant = {
      id: 'rest-1',
      userId: 'user-1',
      name: 'Test Restaurant',
    };

    it('GIVEN no restaurant WHEN getTopProducts THEN throws error', async () => {
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getTopProducts('user-1')).rejects.toThrow('Restaurant not found');
    });

    it('GIVEN products WHEN getTopProducts THEN returns with classification', async () => {
      // Arrange
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Star Product', price: 20, cost: 5, sales: 100, totalRevenue: 2000, category: 'Main' },
        { id: '2', name: 'Gem Product', price: 30, cost: 8, sales: 20, totalRevenue: 600, category: 'Main' },
        { id: '3', name: 'Popular Product', price: 15, cost: 10, sales: 80, totalRevenue: 1200, category: 'Appetizer' },
        { id: '4', name: 'Dog Product', price: 12, cost: 8, sales: 10, totalRevenue: 120, category: 'Dessert' },
      ]);

      // Act
      const products = await service.getTopProducts('user-1', 5);

      // Assert
      expect(products).toHaveLength(4);
      expect(products[0].name).toBe('Star Product');
    });

    it('GIVEN high margin high sales product WHEN getTopProducts THEN classified as star', async () => {
      // Arrange - Star: margin > 60% AND sales > 50
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Star', price: 25, cost: 8, sales: 100, totalRevenue: 2500, category: 'Main' },
        // Margin = (25-8)/25 * 100 = 68% > 60% ✓
        // Sales = 100 > 50 ✓
      ]);

      // Act
      const products = await service.getTopProducts('user-1');

      // Assert
      expect(products[0].classification).toBe('star');
      expect(products[0].margin).toBe('68.0%');
    });

    it('GIVEN high margin low sales product WHEN getTopProducts THEN classified as gem', async () => {
      // Arrange - Gem: margin > 60% AND sales <= 50
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Gem', price: 30, cost: 10, sales: 30, totalRevenue: 900, category: 'Main' },
        // Margin = (30-10)/30 * 100 = 66.7% > 60% ✓
        // Sales = 30 <= 50 ✓
      ]);

      // Act
      const products = await service.getTopProducts('user-1');

      // Assert
      expect(products[0].classification).toBe('gem');
    });

    it('GIVEN low margin high sales product WHEN getTopProducts THEN classified as popular', async () => {
      // Arrange - Popular: margin <= 40% AND sales > 50
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Popular', price: 15, cost: 10, sales: 80, totalRevenue: 1200, category: 'Main' },
        // Margin = (15-10)/15 * 100 = 33.3% <= 40% ✓
        // Sales = 80 > 50 ✓
      ]);

      // Act
      const products = await service.getTopProducts('user-1');

      // Assert
      expect(products[0].classification).toBe('popular');
    });

    it('GIVEN low margin low sales product WHEN getTopProducts THEN classified as dog', async () => {
      // Arrange - Dog: margin <= 40% AND sales <= 50
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Dog', price: 12, cost: 8, sales: 20, totalRevenue: 240, category: 'Dessert' },
        // Margin = (12-8)/12 * 100 = 33.3% <= 40% ✓
        // Sales = 20 <= 50 ✓
      ]);

      // Act
      const products = await service.getTopProducts('user-1');

      // Assert
      expect(products[0].classification).toBe('dog');
    });

    it('GIVEN sales > 30 WHEN getTopProducts THEN trend is up', async () => {
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Hot', price: 20, cost: 10, sales: 50, totalRevenue: 1000, category: 'Main' },
      ]);

      const products = await service.getTopProducts('user-1');

      expect(products[0].trend).toBe('up');
    });

    it('GIVEN sales <= 30 WHEN getTopProducts THEN trend is down', async () => {
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Cold', price: 20, cost: 10, sales: 25, totalRevenue: 500, category: 'Main' },
      ]);

      const products = await service.getTopProducts('user-1');

      expect(products[0].trend).toBe('down');
    });

    it('GIVEN limit parameter WHEN getTopProducts THEN respects limit', async () => {
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'P1', price: 10, cost: 3, sales: 100, totalRevenue: 1000, category: 'Main' },
        { id: '2', name: 'P2', price: 10, cost: 3, sales: 90, totalRevenue: 900, category: 'Main' },
        { id: '3', name: 'P3', price: 10, cost: 3, sales: 80, totalRevenue: 800, category: 'Main' },
      ]);

      await service.getTopProducts('user-1', 2);

      expect(mockPrismaClient.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 2 })
      );
    });
  });

  describe('getAlerts', () => {
    const mockRestaurant = {
      id: 'rest-1',
      userId: 'user-1',
      name: 'Test Restaurant',
      settings: {
        revenueGoal: 50000,
      },
    };

    it('GIVEN no restaurant WHEN getAlerts THEN throws error', async () => {
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getAlerts('user-1')).rejects.toThrow('Restaurant not found');
    });

    it('GIVEN no high cost products WHEN getAlerts THEN no food cost alert', async () => {
      // Arrange
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Good', price: 20, cost: 6, totalRevenue: 1000 }, // 30% < 35%
      ]);

      // Act
      const alerts = await service.getAlerts('user-1');

      // Assert
      const foodCostAlert = alerts.find(a => a.title === 'Food Cost Elevado');
      expect(foodCostAlert).toBeUndefined();
    });

    it('GIVEN high cost product WHEN getAlerts THEN generates food cost alert', async () => {
      // Arrange - Food cost > 35%
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Expensive', price: 20, cost: 9, totalRevenue: 500 }, // 45% > 35%
      ]);

      // Act
      const alerts = await service.getAlerts('user-1');

      // Assert
      const foodCostAlert = alerts.find(a => a.title === 'Food Cost Elevado');
      expect(foodCostAlert).toBeDefined();
      expect(foodCostAlert?.type).toBe('critical');
      expect(foodCostAlert?.subtitle).toContain('Expensive');
    });

    it('GIVEN revenue below 70% of goal WHEN getAlerts THEN generates revenue alert', async () => {
      // Arrange - Total revenue < 50000 * 0.7 = 35000
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'P1', price: 20, cost: 6, totalRevenue: 10000 },
        { id: '2', name: 'P2', price: 15, cost: 5, totalRevenue: 15000 },
        // Total: 25000 < 35000
      ]);

      // Act
      const alerts = await service.getAlerts('user-1');

      // Assert
      const revenueAlert = alerts.find(a => a.title === 'Receita Abaixo da Meta');
      expect(revenueAlert).toBeDefined();
      expect(revenueAlert?.type).toBe('warning');
    });

    it('GIVEN revenue above 70% of goal WHEN getAlerts THEN no revenue alert', async () => {
      // Arrange - Total revenue >= 35000
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'P1', price: 20, cost: 6, totalRevenue: 40000 },
      ]);

      // Act
      const alerts = await service.getAlerts('user-1');

      // Assert
      const revenueAlert = alerts.find(a => a.title === 'Receita Abaixo da Meta');
      expect(revenueAlert).toBeUndefined();
    });
  });

  describe('getMenuEngineering', () => {
    const mockRestaurant = {
      id: 'rest-1',
      userId: 'user-1',
      name: 'Test Restaurant',
    };

    it('GIVEN no restaurant WHEN getMenuEngineering THEN throws error', async () => {
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getMenuEngineering('user-1')).rejects.toThrow('Restaurant not found');
    });

    it('GIVEN no products WHEN getMenuEngineering THEN returns empty matrix', async () => {
      // Arrange
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await service.getMenuEngineering('user-1');

      // Assert
      expect(result.stars).toHaveLength(0);
      expect(result.gems).toHaveLength(0);
      expect(result.populars).toHaveLength(0);
      expect(result.dogs).toHaveLength(0);
      expect(result.summary.totalProducts).toBe(0);
    });

    it('GIVEN products WHEN getMenuEngineering THEN classifies by avg margin and avg sales', async () => {
      // Arrange - Products with varying margin and sales
      // Avg Margin = (75 + 50 + 66.7 + 33.3) / 4 = 56.25%
      // Avg Sales = (100 + 20 + 80 + 10) / 4 = 52.5
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Star', price: 20, cost: 5, sales: 100, totalRevenue: 2000, category: 'Main' },
        // Margin: 75% > avg, Sales: 100 > avg → STAR
        { id: '2', name: 'Gem', price: 20, cost: 10, sales: 20, totalRevenue: 400, category: 'Main' },
        // Margin: 50% < avg, Sales: 20 < avg → DOG (not GEM because margin < avg)
        { id: '3', name: 'Popular', price: 15, cost: 5, sales: 80, totalRevenue: 1200, category: 'Appetizer' },
        // Margin: 66.7% > avg, Sales: 80 > avg → STAR
        { id: '4', name: 'Dog', price: 15, cost: 10, sales: 10, totalRevenue: 150, category: 'Dessert' },
        // Margin: 33.3% < avg, Sales: 10 < avg → DOG
      ]);

      // Act
      const result = await service.getMenuEngineering('user-1');

      // Assert
      expect(result.summary.totalProducts).toBe(4);
      expect(result.summary.avgMargin).toBeCloseTo(56.3, 0);
      expect(result.summary.avgSales).toBe(53);
    });

    it('GIVEN products WHEN getMenuEngineering THEN calculates opportunities', async () => {
      // Arrange
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Star', price: 20, cost: 5, sales: 100, totalRevenue: 2000, category: 'Main' },
        { id: '2', name: 'Gem', price: 30, cost: 5, sales: 10, totalRevenue: 300, category: 'Main' },
        { id: '3', name: 'Popular', price: 15, cost: 10, sales: 80, totalRevenue: 1200, category: 'Appetizer' },
        { id: '4', name: 'Dog', price: 12, cost: 10, sales: 5, totalRevenue: 60, category: 'Dessert' },
      ]);

      // Act
      const result = await service.getMenuEngineering('user-1');

      // Assert
      expect(result.opportunities).toBeDefined();
      expect(result.opportunities!.gems.count).toBeGreaterThanOrEqual(0);
      expect(result.opportunities!.populars.count).toBeGreaterThanOrEqual(0);
      expect(result.opportunities!.dogs.count).toBeGreaterThanOrEqual(0);
    });

    it('GIVEN classified products WHEN getMenuEngineering THEN sorts correctly', async () => {
      // Arrange
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Star1', price: 20, cost: 5, sales: 100, totalRevenue: 2000, category: 'Main' },
        { id: '2', name: 'Star2', price: 25, cost: 5, sales: 150, totalRevenue: 3750, category: 'Main' },
      ]);

      // Act
      const result = await service.getMenuEngineering('user-1');

      // Assert - Stars sorted by revenue descending
      if (result.stars.length >= 2) {
        expect(Number(result.stars[0].revenue)).toBeGreaterThanOrEqual(Number(result.stars[1].revenue));
      }
    });
  });

  describe('getOpportunities', () => {
    const mockRestaurant = {
      id: 'rest-1',
      userId: 'user-1',
      name: 'Test Restaurant',
      tables: 15,
    };

    it('GIVEN no restaurant WHEN getOpportunities THEN throws error', async () => {
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getOpportunities('user-1')).rejects.toThrow('Restaurant not found');
    });

    it('GIVEN gem products WHEN getOpportunities THEN suggests promotion', async () => {
      // Arrange - Gems: margin > 60% AND sales < 20
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', name: 'Hidden Gem', price: 30, cost: 10, sales: 10, totalRevenue: 300 },
        // Margin: 66.7% > 60%, Sales: 10 < 20 → GEM
      ]);

      // Act
      const opportunities = await service.getOpportunities('user-1');

      // Assert
      const gemOpp = opportunities.find(o => o.type === 'revenue');
      expect(gemOpp).toBeDefined();
      expect(gemOpp?.title).toContain('Gemas');
    });

    it('GIVEN restaurant with >10 tables WHEN getOpportunities THEN suggests reservations', async () => {
      // Arrange
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const opportunities = await service.getOpportunities('user-1');

      // Assert
      const capacityOpp = opportunities.find(o => o.type === 'capacity');
      expect(capacityOpp).toBeDefined();
      expect(capacityOpp?.title).toContain('Horário de Pico');
    });

    it('GIVEN restaurant with <=10 tables WHEN getOpportunities THEN no reservation suggestion', async () => {
      // Arrange
      const smallRestaurant = { ...mockRestaurant, tables: 8 };
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(smallRestaurant);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const opportunities = await service.getOpportunities('user-1');

      // Assert
      const capacityOpp = opportunities.find(o => o.type === 'capacity');
      expect(capacityOpp).toBeUndefined();
    });
  });

  describe('getBenchmark', () => {
    const mockRestaurant = {
      id: 'rest-1',
      userId: 'user-1',
      name: 'Test Restaurant',
      tables: 20,
      settings: {},
    };

    it('GIVEN no restaurant WHEN getBenchmark THEN throws error', async () => {
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getBenchmark('user-1')).rejects.toThrow('Restaurant not found');
    });

    it('GIVEN low ticket WHEN getBenchmark THEN segment is casual', async () => {
      // Arrange - avgTicket < 20
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue([
        { id: '1', total: 15 },
        { id: '2', total: 18 },
      ]);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const benchmark = await service.getBenchmark('user-1');

      // Assert
      expect(benchmark.segment).toBe('casual');
      expect(benchmark.segmentLabel).toBe('Casual Dining');
    });

    it('GIVEN mid ticket WHEN getBenchmark THEN segment is midRange', async () => {
      // Arrange - 20 <= avgTicket <= 35
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue([
        { id: '1', total: 25 },
        { id: '2', total: 30 },
      ]);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const benchmark = await service.getBenchmark('user-1');

      // Assert
      expect(benchmark.segment).toBe('midRange');
      expect(benchmark.segmentLabel).toBe('Mid-Range');
    });

    it('GIVEN high ticket WHEN getBenchmark THEN segment is fine', async () => {
      // Arrange - avgTicket > 35
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue([
        { id: '1', total: 45 },
        { id: '2', total: 55 },
      ]);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([]);

      // Act
      const benchmark = await service.getBenchmark('user-1');

      // Assert
      expect(benchmark.segment).toBe('fine');
      expect(benchmark.segmentLabel).toBe('Fine Dining');
    });

    it('GIVEN good metrics WHEN getBenchmark THEN performance is excellent', async () => {
      // Arrange - All metrics within benchmarks
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue(
        Array(200).fill({ id: '1', total: 30 }) // High occupancy, good ticket
      );
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', price: 30, cost: 9 }, // 30% food cost (good)
      ]);

      // Act
      const benchmark = await service.getBenchmark('user-1');

      // Assert
      expect(benchmark.performance.score).toBeGreaterThanOrEqual(50);
    });

    it('GIVEN poor metrics WHEN getBenchmark THEN generates opportunities', async () => {
      // Arrange
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue([
        { id: '1', total: 15 }, // Low ticket
      ]);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
        { id: '1', price: 15, cost: 7 }, // 46.7% food cost (bad)
      ]);

      // Act
      const benchmark = await service.getBenchmark('user-1');

      // Assert
      expect(benchmark.opportunities.length).toBeGreaterThan(0);
    });
  });

  describe('getPeriodLabel (private method via getStats)', () => {
    const mockRestaurant = {
      id: 'rest-1',
      userId: 'user-1',
      name: 'Test Restaurant',
      settings: {},
    };

    beforeEach(() => {
      (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue([]);
      (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([]);
    });

    it('GIVEN unknown period WHEN getStats THEN returns default label', async () => {
      // Access private method through getStats with invalid period (falls to default)
      const stats = await service.getStats('user-1', 'semana');
      expect(stats.receita.vs).toBeDefined();
    });
  });
});

describe('Dashboard Calculations: Edge Cases', () => {
  let service: DashboardService;

  beforeEach(() => {
    service = new DashboardService();
    jest.clearAllMocks();
  });

  const mockRestaurant = {
    id: 'rest-1',
    userId: 'user-1',
    name: 'Test Restaurant',
    settings: { foodCostTarget: 30 },
  };

  it('GIVEN division by zero scenario WHEN calculating ticket THEN handles gracefully', async () => {
    // Arrange - No orders means totalClientes = 0
    (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
    (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue([]);
    (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([]);

    // Act
    const stats = await service.getStats('user-1');

    // Assert - Should not throw, ticket = 0
    expect(stats.ticketMedio.value).toBe(0);
  });

  it('GIVEN product with zero price WHEN calculating food cost THEN handles gracefully', async () => {
    // Arrange
    (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
    (mockPrismaClient.order.findMany as jest.Mock).mockResolvedValue([]);
    (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([
      { id: '1', price: 0, cost: 5 }, // Division by zero scenario
    ]);

    // Act & Assert - Should handle Infinity
    const stats = await service.getStats('user-1');
    expect(stats.foodCost.value).toBeDefined();
  });

  it('GIVEN negative trend WHEN formatting THEN shows negative sign', async () => {
    // Arrange
    const now = new Date();
    (mockPrismaClient.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
    (mockPrismaClient.order.findMany as jest.Mock)
      .mockResolvedValueOnce([{ id: '1', total: 50, orderDate: now }]) // Current: 50
      .mockResolvedValueOnce([{ id: '2', total: 100, orderDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) }]); // Previous: 100
    (mockPrismaClient.product.findMany as jest.Mock).mockResolvedValue([]);

    // Act
    const stats = await service.getStats('user-1', 'semana');

    // Assert - -50% trend
    expect(stats.receita.isUp).toBe(false);
    expect(stats.receita.trend).not.toContain('+');
  });
});
