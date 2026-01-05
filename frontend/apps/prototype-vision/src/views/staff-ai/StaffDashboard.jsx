import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, TrendingUp, Users, Calendar, Award } from 'lucide-react';

const StaffDashboard = () => {
    const upcomingShifts = [
        { id: 1, date: 'Hoje', time: '18:00 - 23:30', position: 'Barman Chefe', location: 'Sala Principal', staff: 'João Silva' },
        { id: 2, date: 'Amanhã', time: '19:00 - 00:00', position: 'Barman', location: 'Rooftop', staff: 'Maria Costa' },
        { id: 3, date: 'Quinta', time: '11:00 - 15:00', position: 'Empregado Mesa', location: 'Esplanada', staff: 'Sofia Martins' },
    ];

    const pendingRequests = [
        { id: 1, type: 'Troca de Turno', from: 'João Silva', status: 'pending', date: 'Sáb, 14 Out' },
        { id: 2, type: 'Pedido de Folga', from: 'Maria Costa', status: 'pending', date: '20-22 Out' },
        { id: 3, type: 'Férias', from: 'Pedro Santos', status: 'pending', date: '1-15 Nov' },
    ];

    const metrics = [
        { label: 'Turnos Esta Semana', value: '42', change: '+8%', icon: Calendar, color: 'blue' },
        { label: 'Taxa de Comparência', value: '96%', change: '+2%', icon: TrendingUp, color: 'green' },
        { label: 'Horas Trabalhadas', value: '284h', change: '+12h', icon: Clock, color: 'purple' },
        { label: 'Conflitos Resolvidos', value: '3', change: '-50%', icon: Award, color: 'orange' },
    ];

    return (
        <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid md:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-panel p-6 rounded-[24px]"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-12 h-12 bg-${metric.color}-500/20 rounded-xl flex items-center justify-center`}>
                                <metric.icon size={24} className={`text-${metric.color}-400`} />
                            </div>
                            <span className="text-xs font-bold text-green-400">{metric.change}</span>
                        </div>
                        <div className="text-3xl font-black text-white mb-1">{metric.value}</div>
                        <div className="text-xs text-white/60 font-bold uppercase">{metric.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Upcoming Shifts */}
                <div className="glass-panel p-8 rounded-[30px]">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                            Próximos Turnos
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {upcomingShifts.map((shift) => (
                            <div key={shift.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-primary font-black text-sm">{shift.date}</span>
                                            <span className="text-white/40 text-xs">•</span>
                                            <span className="text-white/60 text-sm font-bold">{shift.time}</span>
                                        </div>
                                        <h4 className="text-white font-bold">{shift.position}</h4>
                                        <p className="text-xs text-white/40 mt-1">{shift.location}</p>
                                    </div>
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center font-black text-white text-xs border border-primary/20">
                                        {shift.staff.split(' ').map(n => n[0]).join('')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="glass-panel p-8 rounded-[30px]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-orange-400 text-2xl">pending_actions</span>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                                Pedidos Pendentes
                            </h2>
                        </div>
                        <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-black rounded-full">
                            {pendingRequests.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {pendingRequests.map((request) => (
                            <div key={request.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <span className="text-xs font-black text-orange-400 uppercase">{request.type}</span>
                                        <h4 className="text-white font-bold mt-1">{request.from}</h4>
                                        <p className="text-xs text-white/40 mt-1">{request.date}</p>
                                    </div>
                                    <AlertCircle size={16} className="text-orange-400" />
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-xl text-xs font-black uppercase transition-all">
                                        Aprovar
                                    </button>
                                    <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl text-xs font-black uppercase transition-all">
                                        Recusar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Performance */}
            <div className="glass-panel p-8 rounded-[30px]">
                <div className="flex items-center gap-3 mb-6">
                    <Users size={24} className="text-primary" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                        Performance da Equipa
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                        <div className="text-4xl font-black text-green-400 mb-2">94%</div>
                        <div className="text-sm text-white/60 font-bold">Pontualidade</div>
                        <div className="text-xs text-green-400 mt-1">↑ 4%</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                        <div className="text-4xl font-black text-blue-400 mb-2">8.5</div>
                        <div className="text-sm text-white/60 font-bold">Avaliação Média</div>
                        <div className="text-xs text-blue-400 mt-1">↑ 0.3</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                        <div className="text-4xl font-black text-purple-400 mb-2">12%</div>
                        <div className="text-sm text-white/60 font-bold">Turnover Anual</div>
                        <div className="text-xs text-purple-400 mt-1">↓ 8%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
