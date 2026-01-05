import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Copy, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';

const StaffSchedule = () => {
    const [selectedWeek, setSelectedWeek] = useState('Semana Atual');
    const [showCreateModal, setShowCreateModal] = useState(false);

    const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const dates = ['09', '10', '11', '12', '13', '14', '15'];

    const scheduleData = {
        'João Silva': [
            { day: 0, time: '18:00-23:30', position: 'Barman Chefe', location: 'Sala', status: 'confirmed' },
            { day: 2, time: '19:00-00:00', position: 'Barman', location: 'Rooftop', status: 'confirmed' },
            { day: 4, time: '18:00-23:30', position: 'Barman Chefe', location: 'Sala', status: 'confirmed' },
        ],
        'Maria Costa': [
            { day: 1, time: '11:00-15:00', position: 'Empregado Mesa', location: 'Esplanada', status: 'confirmed' },
            { day: 3, time: '18:00-23:00', position: 'Empregado Mesa', location: 'Sala', status: 'pending' },
            { day: 5, time: '11:00-16:00', position: 'Empregado Mesa', location: 'Esplanada', status: 'confirmed' },
        ],
        'Sofia Martins': [
            { day: 0, time: '11:00-15:00', position: 'Empregado Mesa', location: 'Sala', status: 'confirmed' },
            { day: 2, time: '11:00-15:00', position: 'Empregado Mesa', location: 'Esplanada', status: 'swap' },
            { day: 6, time: '12:00-17:00', position: 'Empregado Mesa', location: 'Sala', status: 'confirmed' },
        ],
    };

    const getStatusColor = (status) => {
        const colors = {
            confirmed: 'bg-green-500/20 border-green-500/30 text-green-400',
            pending: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
            swap: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
        };
        return colors[status] || colors.confirmed;
    };

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-all">
                        <ChevronLeft size={20} className="text-white/60" />
                    </button>
                    <div className="text-center">
                        <h3 className="text-xl font-black text-white">{selectedWeek}</h3>
                        <p className="text-xs text-white/40">9 - 15 Outubro 2023</p>
                    </div>
                    <button className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center transition-all">
                        <ChevronRight size={20} className="text-white/60" />
                    </button>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-black text-sm transition-all">
                        <Copy size={16} />
                        Clonar Semana
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 transition-all"
                    >
                        <Plus size={18} />
                        Criar Turno
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="glass-panel p-8 rounded-[30px] overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    {/* Header */}
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="text-left pb-4 px-4">
                                <span className="text-xs font-black text-white/40 uppercase">Colaborador</span>
                            </th>
                            {weekDays.map((day, index) => (
                                <th key={index} className="text-center pb-4 px-2">
                                    <div className="text-xs font-black text-white/60 uppercase mb-1">{day}</div>
                                    <div className="text-sm font-bold text-white/40">{dates[index]}</div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {Object.entries(scheduleData).map(([name, shifts], staffIndex) => (
                            <tr key={staffIndex} className="border-b border-white/5">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center font-black text-white text-xs border border-primary/20">
                                            {name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-sm">{name}</div>
                                            <div className="text-xs text-white/40">Ver perfil</div>
                                        </div>
                                    </div>
                                </td>
                                {weekDays.map((_, dayIndex) => {
                                    const shift = shifts.find(s => s.day === dayIndex);
                                    return (
                                        <td key={dayIndex} className="py-4 px-2">
                                            {shift ? (
                                                <div className={`rounded-xl border p-3 text-center cursor-pointer hover:scale-105 transition-all ${getStatusColor(shift.status)}`}>
                                                    <div className="flex items-center justify-center gap-1 mb-1">
                                                        <Clock size={12} />
                                                        <span className="text-xs font-black">{shift.time}</span>
                                                    </div>
                                                    <div className="text-[10px] font-bold mb-1">{shift.position}</div>
                                                    <div className="flex items-center justify-center gap-1">
                                                        <MapPin size={10} />
                                                        <span className="text-[10px]">{shift.location}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button className="w-full h-20 bg-white/5 hover:bg-white/10 border border-white/5 border-dashed rounded-xl flex items-center justify-center transition-all group">
                                                    <Plus size={16} className="text-white/20 group-hover:text-white/40" />
                                                </button>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 px-4">
                <span className="text-xs font-bold text-white/40 uppercase">Legenda:</span>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded"></div>
                    <span className="text-xs text-white/60">Confirmado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500/20 border border-orange-500/30 rounded"></div>
                    <span className="text-xs text-white/60">Pendente</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500/20 border border-blue-500/30 rounded"></div>
                    <span className="text-xs text-white/60">Troca Solicitada</span>
                </div>
            </div>

            {/* Alerts */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-[24px] p-6">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-orange-400">warning</span>
                        <div>
                            <h4 className="text-white font-bold mb-1">Conflito Detectado</h4>
                            <p className="text-sm text-white/60">
                                João Silva tem 2 turnos simultâneos na Quinta-feira.
                                <button className="text-orange-400 font-bold ml-2 hover:underline">Resolver →</button>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-[24px] p-6">
                    <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-blue-400">info</span>
                        <div>
                            <h4 className="text-white font-bold mb-1">3 Turnos Sem Atribuir</h4>
                            <p className="text-sm text-white/60">
                                Sábado precisa de mais colaboradores.
                                <button className="text-blue-400 font-bold ml-2 hover:underline">Ver →</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffSchedule;
