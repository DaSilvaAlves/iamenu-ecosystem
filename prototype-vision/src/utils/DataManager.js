// ===== DATA MANAGER (iaMenu Prototype Version) =====
// Centralizes data access and calculations for the dashboard

const DataManager = {
    // Get all orders from storage
    getOrders: function () {
        const saved = localStorage.getItem('restaurante_pedidos');
        return saved ? JSON.parse(saved).map(p => ({ ...p, tempo: new Date(p.tempo) })) : [];
    },

    // Get all products from storage
    getProducts: function () {
        const saved = localStorage.getItem('restaurante_produtos');
        return saved ? JSON.parse(saved) : [];
    },

    // Get all tables from storage
    getTables: function () {
        const saved = localStorage.getItem('restaurante_mesas');
        return saved ? JSON.parse(saved) : [];
    },

    // Calculate Dashboard Stats
    getDashboardStats: function (period = 'week') {
        const orders = this.getOrders();
        const now = new Date();
        let filteredOrders = [];

        // Filter by period
        if (period === 'today') {
            filteredOrders = orders.filter(o => new Date(o.tempo).toDateString() === now.toDateString());
        } else if (period === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredOrders = orders.filter(o => new Date(o.tempo) >= weekAgo);
        } else if (period === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredOrders = orders.filter(o => new Date(o.tempo) >= monthAgo);
        } else if (period === 'year') {
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            filteredOrders = orders.filter(o => new Date(o.tempo) >= yearAgo);
        }

        // Calculate stats
        const totalSales = filteredOrders.reduce((sum, o) => sum + (o.status !== 'Cancelado' ? o.total : 0), 0);
        const totalOrders = filteredOrders.length;
        const uniqueTables = new Set(filteredOrders.map(o => o.mesa)).size;
        const avgRevenue = totalOrders > 0 ? totalSales / totalOrders : 0;

        return {
            sales: totalSales,
            orders: totalOrders,
            avgRevenue: avgRevenue,
            customers: uniqueTables * 3, // Estimating 3 people per table
            periodGrowth: 12.5 // Mock growth for UI
        };
    },

    // Get Recent Orders for Dashboard
    getRecentOrders: function (limit = 6) {
        const orders = this.getOrders();
        return orders
            .sort((a, b) => new Date(b.tempo) - new Date(a.tempo))
            .slice(0, limit)
            .map(o => ({
                id: `#ORD-${o.id}`,
                time: this.formatTimeAgo(new Date(o.tempo)),
                status: o.status === 'Pendente' ? 'pending' : o.status === 'Entregue' ? 'completed' : 'pending',
                value: o.total,
                originalStatus: o.status
            }));
    },

    // Get Top Products
    getTopProducts: function (limit = 5) {
        const orders = this.getOrders();
        const products = this.getProducts();
        const productStats = {};

        // If no real products, use defaults for demonstrate
        if (products.length === 0) {
            return [
                { name: 'Hambúrguer Gourmet', category: 'Main Course', sales: 156, revenue: 2025.44, trend: 'up', margin: '65%' },
                { name: 'Pizza Margherita', category: 'Main Course', sales: 142, revenue: 2059.00, trend: 'up', margin: '64%' },
                { name: 'Tacos de Frango', category: 'Main Course', sales: 128, revenue: 1344.00, trend: 'down', margin: '70%' },
                { name: 'Salada Caesar', category: 'Salads', sales: 98, revenue: 979.02, trend: 'up', margin: '72%' }
            ].slice(0, limit);
        }

        products.forEach(p => {
            productStats[p.nome] = {
                name: p.nome,
                category: p.categoria,
                sales: 0,
                revenue: 0,
                margin: p.custo > 0 ? (((p.preco - p.custo) / p.preco) * 100).toFixed(1) + '%' : '0%',
                trend: 'up'
            };
        });

        orders.forEach(o => {
            if (o.status !== 'Cancelado' && o.items) {
                o.items.forEach(itemName => {
                    const name = typeof itemName === 'string' ? itemName : itemName.nome;
                    if (productStats[name]) {
                        productStats[name].sales++;
                        const product = products.find(p => p.nome === name);
                        if (product) productStats[name].revenue += product.preco;
                    }
                });
            }
        });

        return Object.values(productStats)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, limit);
    },

    // Get Tables Status
    getTablesStatus: function () {
        const tables = this.getTables();
        if (tables.length === 0) {
            return Array.from({ length: 12 }, (_, i) => ({
                number: i + 1,
                status: (i + 1) % 3 === 0 ? 'occupied' : (i + 1) % 5 === 0 ? 'reserved' : 'free',
                value: (i + 1) % 3 === 0 ? 45.50 + i : 0,
                time: (i + 1) % 3 === 0 ? '35 min' : (i + 1) % 5 === 0 ? '19:00' : null
            }));
        }
        return tables.map(t => ({
            number: t.numero,
            status: t.status === 'ocupada' ? 'occupied' : t.status === 'livre' ? 'free' : 'reserved',
            value: t.valor || 0,
            time: t.tempo
        }));
    },

    // --- ADVANCED BI METRICS ---

    // Get Financial Stats (Revenue vs Expenses)
    getFinancialStats: function () {
        const stats = this.getDashboardStats('month');
        const savedExpenses = localStorage.getItem('dashboard_expenses');
        const expenses = savedExpenses ? JSON.parse(savedExpenses) : [
            { id: 1, description: 'Fornecedor Bebidas', category: 'Fornecedores', value: 450.00, date: new Date().toISOString() },
            { id: 2, description: 'Eletricidade', category: 'Utilidades', value: 120.00, date: new Date().toISOString() },
            { id: 3, description: 'Rendas/Aluguer', category: 'Fixos', value: 850.00, date: new Date().toISOString() }
        ];

        const totalExpenses = expenses.reduce((sum, e) => sum + e.value, 0);

        return {
            revenue: stats.sales,
            expenses: totalExpenses,
            profit: stats.sales - totalExpenses,
            margin: stats.sales > 0 ? ((stats.sales - totalExpenses) / stats.sales * 100).toFixed(1) : 0,
            history: expenses
        };
    },

    // Get Performance Metrics for Radar Chart
    getPerformanceMetrics: function () {
        // In a real app, these would come from reviews or POS timings
        return {
            labels: ['Qualidade', 'Serviço', 'Tempo Espera', 'Ambiente', 'Preço', 'Limpeza'],
            data: [4.8, 4.5, 3.8, 4.7, 4.2, 4.9] // Scale 0-5
        };
    },

    // Get Customer Analytics
    getCustomerAnalytics: function () {
        const orders = this.getOrders();
        const customerMap = {};

        orders.forEach(o => {
            const customerId = o.mesa; // Simplified: using table as proxy
            if (!customerMap[customerId]) {
                customerMap[customerId] = {
                    id: customerId,
                    orders: 0,
                    totalSpent: 0,
                    lastVisit: o.tempo
                };
            }
            customerMap[customerId].orders++;
            customerMap[customerId].totalSpent += o.total;
            if (new Date(o.tempo) > new Date(customerMap[customerId].lastVisit)) {
                customerMap[customerId].lastVisit = o.tempo;
            }
        });

        const customers = Object.values(customerMap);
        const recurring = customers.filter(c => c.orders > 1).length;
        const total = customers.length || 1;

        return {
            total: total,
            recurring: recurring,
            new: total - recurring,
            recurringRate: ((recurring / total) * 100).toFixed(1),
            avgTicket: (orders.reduce((sum, o) => sum + o.total, 0) / (orders.length || 1)).toFixed(2),
            topCustomers: customers.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5)
        };
    },

    // Helper: Format time ago
    formatTimeAgo: function (date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " anos";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " meses";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " dias";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " min";
        return "Agora";
    }
};

export default DataManager;
