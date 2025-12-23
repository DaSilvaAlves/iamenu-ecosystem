import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    ClipboardList,
    Grid3X3,
    Wallet,
    Users,
    TrendingUp,
    Settings,
    RefreshCcw,
    Plus,
    Bell,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2,
    AlertTriangle,
    ChevronRight,
    Download
} from 'lucide-react';
import DataManager from '../utils/DataManager';

// --- Sub-componentes de Vista ---

const StatCard = ({ title, value, trend, type, icon: Icon }) => (
    <div className="glass-panel p-6 rounded-[32px] border border-white/5 hover:border-white/20 transition-all group">
        <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                <Icon size={24} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-black ${type === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {type === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {trend}
            </div>
        </div>
        <h3 className="text-3xl font-black text-white mb-1 tracking-tight">{value}</h3>
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{title}</p>
    </div>
);

const OverviewTab = ({ stats, hourlySales, topProducts }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Vendas Totais" value={`€${stats.sales.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`} trend="+12.5%" type="up" icon={Wallet} />
            <StatCard title="Pedidos" value={stats.orders} trend="+8.2%" type="up" icon={ClipboardList} />
            <StatCard title="Receita Média" value={`€${stats.avgRevenue.toFixed(2)}`} trend="-3.1%" type="down" icon={TrendingUp} />
            <StatCard title="Clientes" value={stats.customers} trend="+15.7%" type="up" icon={Users} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-panel p-8 rounded-[32px]">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-white">Vendas por Período</h3>
                    <div className="flex gap-2">
                        {['Diário', 'Semanal', 'Mensal'].map(p => (
                            <button key={p} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${p === 'Diário' ? 'bg-primary text-black' : 'text-white/40 hover:bg-white/5'}`}>{p}</button>
                        ))}
                    </div>
                </div>
                <div className="h-[300px] flex items-end gap-3 justify-between">
                    {hourlySales.map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                            <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(h, 5)}%` }} className={`w-full rounded-lg transition-all ${h > 80 ? 'bg-primary' : 'bg-white/10 group-hover:bg-white/20'}`} />
                            <span className="text-[10px] font-bold text-white/30">{12 + i}h</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-panel p-8 rounded-[32px]">
                <h3 className="text-xl font-bold text-white mb-6">Produtos Populares</h3>
                <div className="space-y-4">
                    {topProducts.slice(0, 5).map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div>
                                <h4 className="text-sm font-bold text-white">{p.name}</h4>
                                <p className="text-[10px] text-white/30 uppercase">{p.sales || p.orders} vendas</p>
                            </div>
                            <span className="text-xs font-black text-green-500">{p.margin || '75%'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const ProductsTab = () => {
    const [products] = useState(DataManager.getProducts());
    return (
        <div className="glass-panel rounded-[32px] overflow-hidden border border-white/5">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white uppercase italic">Inventário Operacional</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-[10px] font-black rounded-xl uppercase tracking-widest"><Plus size={14} /> Novo Item</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 text-[10px] uppercase font-black text-white/20 tracking-widest">
                            <th className="px-8 py-6">Produto</th>
                            <th className="px-8 py-6">Categoria</th>
                            <th className="px-8 py-6 text-right">Preço Unit.</th>
                            <th className="px-8 py-6 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {products.length > 0 ? products.map((p, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-5 font-bold text-white">{p.nome}</td>
                                <td className="px-8 py-5 text-white/40 text-xs font-bold uppercase">{p.categoria}</td>
                                <td className="px-8 py-5 text-right font-black text-white">€{p.preco.toFixed(2)}</td>
                                <td className="px-8 py-5 text-center">
                                    <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-1 rounded">ATIVO</span>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="px-8 py-20 text-center text-white/20 font-bold uppercase italic tracking-widest">Nenhum produto registado</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const OrdersTab = () => {
    const [orders] = useState(DataManager.getOrders());
    const [filterStatus, setFilterStatus] = useState('Todos');

    const statusConfig = {
        'Pendente': { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: Clock },
        'Em Preparação': { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: RefreshCcw },
        'Pronto': { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2 },
        'Entregue': { color: 'text-white/40', bg: 'bg-white/5', border: 'border-white/10', icon: CheckCircle2 },
        'Cancelado': { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle }
    };

    const filtered = orders.filter(o => filterStatus === 'Todos' || o.status === filterStatus);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/5 p-6 rounded-[32px] border border-white/10">
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {['Todos', 'Pendente', 'Em Preparação', 'Pronto', 'Entregue'].map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-primary text-black' : 'text-white/40 hover:bg-white/5'}`}>{s}</button>
                    ))}
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">A aguardar</p>
                    <p className="text-xl font-black text-primary uppercase">{orders.filter(o => o.status === 'Pendente').length} Pedidos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((o) => {
                    const config = statusConfig[o.status] || statusConfig.Pendente;
                    const Icon = config.icon;
                    return (
                        <motion.div layout key={o.id} className={`glass-panel p-6 rounded-[32px] border ${config.border} flex flex-col justify-between h-[280px]`}>
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h4 className="text-xl font-black text-white tracking-tighter">#ORD-{o.id}</h4>
                                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Mesa {o.mesa} • {o.garcom || 'Eurico'}</p>
                                    </div>
                                    <div className={`p-2 rounded-xl ${config.bg} ${config.color}`}><Icon size={16} /></div>
                                </div>
                                <ul className="space-y-2 mb-4">
                                    {(o.items || []).slice(0, 3).map((item, idx) => (
                                        <li key={idx} className="text-xs text-white/60 font-bold flex items-center gap-2 italic">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" /> {typeof item === 'string' ? item : item.nome}
                                        </li>
                                    ))}
                                    {o.items && o.items.length > 3 && <li className="text-[10px] text-white/20 font-black uppercase tracking-widest">+ {o.items.length - 3} outros itens</li>}
                                </ul>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <p className="text-xl font-black text-white tracking-tighter">€{o.total.toFixed(2)}</p>
                                <button className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black text-white/40 uppercase hover:text-white hover:bg-white/10 transition-all tracking-widest">Gerir</button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

const TablesTab = () => {
    const tables = DataManager.getTablesStatus();
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {tables.map(t => (
                <div key={t.number} className={`glass-panel p-8 rounded-[40px] border flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 ${t.status === 'occupied' ? 'border-red-500/20 bg-red-500/5' : t.status === 'reserved' ? 'border-orange-500/20 bg-orange-500/5' : 'border-primary/20 bg-primary/5'}`}>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Mesa</span>
                    <h4 className="text-4xl font-black text-white italic">{t.number}</h4>
                    <span className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-full tracking-widest ${t.status === 'occupied' ? 'bg-red-500/20 text-red-500' : t.status === 'reserved' ? 'bg-orange-500/20 text-orange-500' : 'bg-primary/20 text-primary'}`}>
                        {t.status === 'occupied' ? 'Ocupada' : t.status === 'reserved' ? 'Reservada' : 'Livre'}
                    </span>
                </div>
            ))}
        </div>
    );
};

const FinanceTab = ({ analytics }) => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-8 rounded-[32px] border border-green-500/10">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Receita Total Bruta</p>
                    <h3 className="text-3xl font-black text-green-500 tracking-tighter italic">€{analytics.revenue.toFixed(2)}</h3>
                </div>
                <div className="glass-panel p-8 rounded-[32px] border border-red-500/10">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Total de custo operacional</p>
                    <h3 className="text-3xl font-black text-red-500 tracking-tighter italic">€{analytics.expenses.toFixed(2)}</h3>
                </div>
                <div className="glass-panel p-8 rounded-[32px] border border-primary/20 bg-primary/5">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Net Profit (Estimado)</p>
                    <h3 className="text-3xl font-black text-primary tracking-tighter italic">€{analytics.profit.toFixed(2)}</h3>
                </div>
            </div>

            <div className="glass-panel rounded-[40px] overflow-hidden border border-white/5">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">Fluxo de Caixa Operacional</h3>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white/60 text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] border border-white/10 hover:bg-white/10 transition-all"><Download size={14} /> Exportar Relatório</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-medium">
                        <thead>
                            <tr className="border-b border-white/5 text-[9px] uppercase font-black text-white/20 tracking-[0.3em]">
                                <th className="px-8 py-6">Timeline</th>
                                <th className="px-8 py-6 text-center">Tipo fluxo</th>
                                <th className="px-8 py-6">Entidade / Descrição</th>
                                <th className="px-8 py-6 text-right">Valor líquido</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {analytics.history.map((e, i) => (
                                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-5 text-white/40 text-[10px] font-black tracking-widest">{new Date(e.date).toLocaleDateString('pt-PT')}</td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="text-[8px] font-black px-3 py-1 rounded-full bg-red-500/10 text-red-500 uppercase tracking-widest">OUTFLOW</span>
                                    </td>
                                    <td className="px-8 py-5 text-white font-bold text-sm tracking-tighter">{e.description}</td>
                                    <td className="px-8 py-5 text-right font-black text-red-500 tracking-tight">- €{e.value.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const PerformanceRadar = ({ metrics }) => {
    const size = 300;
    const center = size / 2;
    const radius = 100;
    const angleStep = (Math.PI * 2) / metrics.labels.length;

    // Gerar pontos para o polígono de dados
    const points = metrics.data.map((val, i) => {
        const r = (val / 5) * radius;
        const x = center + r * Math.cos(i * angleStep - Math.PI / 2);
        const y = center + r * Math.sin(i * angleStep - Math.PI / 2);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-2xl">
                {/* Grelha do Radar */}
                {[1, 2, 3, 4, 5].map(step => (
                    <circle
                        key={step}
                        cx={center} cy={center}
                        r={(step / 5) * radius}
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                        strokeOpacity="0.1"
                    />
                ))}

                {/* Eixos */}
                {metrics.labels.map((label, i) => {
                    const x = center + radius * Math.cos(i * angleStep - Math.PI / 2);
                    const y = center + radius * Math.sin(i * angleStep - Math.PI / 2);
                    const lx = center + (radius + 25) * Math.cos(i * angleStep - Math.PI / 2);
                    const ly = center + (radius + 15) * Math.sin(i * angleStep - Math.PI / 2);

                    return (
                        <g key={i}>
                            <line x1={center} y1={center} x2={x} y2={y} stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
                            <text
                                x={lx} y={ly}
                                textAnchor="middle"
                                className="fill-white/40 text-[8px] font-black uppercase tracking-tighter"
                            >
                                {label}
                            </text>
                        </g>
                    );
                })}

                {/* Polígono de Dados */}
                <motion.polygon
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    points={points}
                    fill="var(--primary)"
                    fillOpacity="0.2"
                    stroke="var(--primary)"
                    strokeWidth="2"
                />
            </svg>
        </div>
    );
};

const ReportsTab = ({ metrics }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-10 rounded-[40px] border border-white/5 flex flex-col items-center justify-center space-y-8">
            <div className="text-center">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Performance Radar</h4>
                <p className="text-white/40 text-xs font-bold font-mono">KPIs de Qualidade e Eficiência</p>
            </div>
            <PerformanceRadar metrics={metrics} />
            <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-white/5">
                <div className="text-center">
                    <p className="text-[10px] font-black text-white/20 uppercase mb-1">Score Geral</p>
                    <p className="text-xl font-black text-white italic">4.6<span className="text-xs text-white/20">/5.0</span></p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black text-white/20 uppercase mb-1">Status</p>
                    <p className="text-xl font-black text-green-500 italic uppercase">Excelente</p>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="glass-panel p-8 rounded-[40px] border border-white/5">
                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">Próximos Relatórios</h4>
                <div className="space-y-4">
                    {[
                        { title: 'Inventário e Stock', date: 'Hoje, 22:00', icon: Package },
                        { title: 'Performance de Staff', date: 'Amanhã, 09:00', icon: Users },
                        { title: 'Análise de Margens AI', date: '30 DEZ', icon: TrendingUp }
                    ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/5 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                    <r.icon size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{r.title}</p>
                                    <p className="text-[10px] text-white/20 uppercase font-black">{r.date}</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-white/10 group-hover:text-primary" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const CustomersTab = ({ analytics }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Clientes" value={analytics.total} trend="+4%" type="up" icon={Users} />
            <StatCard title="Taxa Retenção" value={`${analytics.recurringRate}%`} trend="+2.5%" type="up" icon={RefreshCcw} />
            <StatCard title="Ticket Médio" value={`€${analytics.avgTicket}`} trend="+€5.1" type="up" icon={TrendingUp} />
        </div>

        <div className="glass-panel rounded-[40px] overflow-hidden border border-white/5">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">Ranking de Fidelização</h3>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-black rounded-full uppercase italic">Vips Detetados</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left font-medium">
                    <thead>
                        <tr className="border-b border-white/5 text-[9px] uppercase font-black text-white/20 tracking-[0.3em]">
                            <th className="px-8 py-6">ID / Mesa</th>
                            <th className="px-8 py-6">Visitas</th>
                            <th className="px-8 py-6 text-right">Gasto Total</th>
                            <th className="px-8 py-6 text-center">Última Visita</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {analytics.topCustomers.map((c, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-8 py-5 text-white font-bold flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">#{c.id}</div>
                                    Mesa {c.id}
                                </td>
                                <td className="px-8 py-5 text-white/60 font-black text-xs">{c.orders} Orders</td>
                                <td className="px-8 py-5 text-right font-black text-white">€{c.totalSpent.toFixed(2)}</td>
                                <td className="px-8 py-5 text-center text-[10px] font-black text-white/20 uppercase">{new Date(c.lastVisit).toLocaleDateString('pt-PT')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// --- Componente Principal ---

const DashboardBI = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({ sales: 0, orders: 0, avgRevenue: 0, customers: 0, periodGrowth: 12.5 });
    const [topProducts, setTopProducts] = useState([]);
    const [hourlySales, setHourlySales] = useState([]);
    const [performanceMetrics, setPerformanceMetrics] = useState({ labels: [], data: [] });
    const [customerAnalytics, setCustomerAnalytics] = useState({ total: 0, recurringRate: 0, avgTicket: 0, topCustomers: [] });
    const [financialStats, setFinancialStats] = useState({ revenue: 0, expenses: 0, profit: 0, margin: 0, history: [] });

    const loadData = () => {
        setStats(DataManager.getDashboardStats('month'));
        setTopProducts(DataManager.getTopProducts(10));
        setHourlySales(DataManager.getSalesByHour());
        setPerformanceMetrics(DataManager.getPerformanceMetrics());
        setCustomerAnalytics(DataManager.getCustomerAnalytics());
        setFinancialStats(DataManager.getFinancialStats());
    };

    useEffect(() => {
        loadData();
    }, []);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'produtos', label: 'Produtos', icon: Package },
        { id: 'pedidos', label: 'Pedidos', icon: ClipboardList },
        { id: 'mesas', label: 'Mesas', icon: Grid3X3 },
        { id: 'financeiro', label: 'Financeiro', icon: Wallet },
        { id: 'clientes', label: 'Clientes', icon: Users },
        { id: 'relatorios', label: 'Relatórios', icon: TrendingUp },
        { id: 'definicoes', label: 'Definições', icon: Settings },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 pb-32 max-w-7xl mx-auto space-y-8">
            {/* Top Bar Centralized */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/5 p-8 rounded-[40px] border border-white/10 backdrop-blur-3xl">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic text-glow">Control Center</h1>
                    <p className="text-white/40 font-bold text-sm tracking-wide">Gestão integrada em tempo real • Eurico Alves</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={loadData} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 text-white/40 transition-all border border-white/10 text-primary animate-pulse"><RefreshCcw size={20} /></button>
                    <button className="flex items-center gap-2 px-6 py-4 bg-primary text-black font-black rounded-2xl hover:scale-105 transition-all text-sm tracking-tighter italic shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"><Plus size={18} strokeWidth={3} /> NOVO PEDIDO</button>
                    <div className="relative">
                        <button className="p-4 bg-white/5 rounded-2xl text-white/40 border border-white/10"><Bell size={20} /></button>
                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-[10px] font-black flex items-center justify-center text-white border-4 border-[#121212]">3</span>
                    </div>
                </div>
            </div>

            {/* Internal Tab Navigation */}
            <div className="flex flex-wrap gap-2 bg-white/5 p-2 rounded-[32px] border border-white/10 overflow-x-auto no-scrollbar">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === item.id ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                        <item.icon size={14} />
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Content Swapper */}
            <div className="min-h-[500px]">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'dashboard' && <OverviewTab stats={stats} hourlySales={hourlySales} topProducts={topProducts} />}
                        {activeTab === 'produtos' && <ProductsTab />}
                        {activeTab === 'pedidos' && <OrdersTab />}
                        {activeTab === 'mesas' && <TablesTab />}
                        {activeTab === 'financeiro' && <FinanceTab analytics={financialStats} />}
                        {activeTab === 'clientes' && <CustomersTab analytics={customerAnalytics} />}
                        {activeTab === 'relatorios' && <ReportsTab metrics={performanceMetrics} />}
                        {activeTab === 'definicoes' && (
                            <div className="glass-panel p-20 rounded-[40px] text-center border border-white/5 border-dashed bg-white/[0.01]">
                                <h3 className="text-3xl font-black text-white/10 uppercase italic tracking-tighter">Módulo Configurações</h3>
                                <p className="text-white/5 font-bold mt-2 uppercase text-[10px] tracking-[0.5em]">Ajuste as preferências do motor de IA iaMenu...</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Floating Action Menu */}
            <div className="fixed bottom-10 right-10 z-[1000]">
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 bg-primary text-black rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center border-4 border-[#121212] transition-colors"
                >
                    <Plus size={32} strokeWidth={3} />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default DashboardBI;
