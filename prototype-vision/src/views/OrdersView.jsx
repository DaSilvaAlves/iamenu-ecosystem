import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, ChefHat, Filter, Search, Plus, MoreHorizontal } from 'lucide-react';
import DataManager from '../utils/DataManager';

const OrderCard = ({ order }) => {
    const statusConfig = {
        'pending': { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: Clock, label: 'Pendente' },
        'completed': { color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2, label: 'Entregue' },
        'cancelled': { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertCircle, label: 'Cancelado' }
    };

    const config = statusConfig[order.status] || statusConfig.pending;
    const StatusIcon = config.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`glass-panel p-6 border ${config.border} rounded-[32px] group relative overflow-hidden`}
        >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-white/40 hover:text-white p-1">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-xl font-black text-white tracking-tight">{order.id}</h4>
                    <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest mt-1">
                        <StatusIcon size={12} className={config.color} />
                        <span>{order.time}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-black text-white">€{order.value.toFixed(2)}</p>
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${config.bg} ${config.color}`}>
                        {config.label}
                    </span>
                </div>
            </div>

            <div className="space-y-3 mb-6 pt-4 border-t border-white/5">
                {/* Mocked items for visualization */}
                {[1, 2].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-primary bg-primary/10 w-5 h-5 flex items-center justify-center rounded">1</span>
                            <span className="text-xs font-bold text-white/80 italic">Item Sugestão #{i + 1}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
                <button className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${order.status === 'completed' ? 'bg-white/5 text-white/20' : 'bg-primary text-black hover:bg-primary/90'}`}>
                    CONCLUIR
                </button>
                <button className="w-full py-3 rounded-2xl bg-white/5 text-white/40 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/10">
                    DETALHES
                </button>
            </div>
        </motion.div>
    );
};

const OrdersView = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const data = DataManager.getRecentOrders(12);
        if (data.length === 0) {
            // Default mock if empty
            setOrders([
                { id: '#ORD-1247', time: 'Há 5 min', status: 'pending', value: 45.50 },
                { id: '#ORD-1246', time: 'Há 12 min', status: 'completed', value: 67.80 },
                { id: '#ORD-1245', time: 'Há 18 min', status: 'completed', value: 32.90 },
                { id: '#ORD-1244', time: 'Há 25 min', status: 'pending', value: 89.20 }
            ]);
        } else {
            setOrders(data);
        }
    }, []);

    const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 space-y-8 max-w-7xl mx-auto"
        >
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/5 p-8 rounded-[32px] border border-white/10 backdrop-blur-3xl">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-primary/20 rounded-xl text-primary">
                            <ChefHat size={24} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Kitchen Control</h2>
                    </div>
                    <p className="text-white/40 font-bold text-sm ml-12">Gestão de fluxo de pedidos em tempo real.</p>
                </div>

                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-4 bg-primary text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                        <Plus size={20} strokeWidth={3} />
                        NOVO PEDIDO
                    </button>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="flex flex-wrap gap-4 items-center">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${filter === 'all' ? 'bg-white/10 border-primary text-primary' : 'bg-transparent border-white/10 text-white/40 hover:border-white/20'}`}
                >
                    Todos ({orders.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${filter === 'pending' ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-transparent border-white/10 text-white/40 hover:border-white/20'}`}
                >
                    Pendentes ({orders.filter(o => o.status === 'pending').length})
                </button>
                <button
                    onClick={() => setFilter('completed')}
                    className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${filter === 'completed' ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-transparent border-white/10 text-white/40 hover:border-white/20'}`}
                >
                    Concluídos ({orders.filter(o => o.status === 'completed').length})
                </button>

                <div className="h-8 w-px bg-white/10 mx-2 hidden md:block"></div>

                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                        type="text"
                        placeholder="Pesquisar por ID ou Mesa..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50"
                    />
                </div>
            </div>

            {/* Orders Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode='popLayout'>
                    {filteredOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </AnimatePresence>
            </div>

            {filteredOrders.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-[40px] border border-white/10 border-dashed">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/20">
                        <Filter size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-white/40">Nenhum pedido encontrado.</h3>
                    <p className="text-white/20 text-sm mt-2">Tenta mudar o filtro ou faz uma nova pesquisa.</p>
                </div>
            )}
        </motion.div>
    );
};

export default OrdersView;
