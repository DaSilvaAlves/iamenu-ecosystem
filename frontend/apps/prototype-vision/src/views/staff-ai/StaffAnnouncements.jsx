import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pin, Heart, MessageCircle, Image as ImageIcon } from 'lucide-react';

const StaffAnnouncements = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const announcements = [
        {
            id: 1,
            title: 'Atualização de Horários de Verão',
            author: 'Ricardo Silva',
            date: 'Hoje, 10:30',
            content: 'A partir da próxima semana, entraremos no horário de verão. Por favor verifiquem os novos turnos na secção de escala.',
            category: 'IMPORTANTE',
            isPinned: true,
            likes: 12,
            comments: 3,
        },
        {
            id: 2,
            title: 'Funcionário do Mês: Sofia! 🎉',
            author: 'Sistema iaMenu',
            date: '2 dias atrás',
            content: 'Parabéns à Sofia pela dedicação excepcional este mês. O seu esforço na gestão da sala cheia no último sábado foi incrível.',
            category: 'RECONHECIMENTO',
            likes: 45,
            comments: 8,
            hasImage: true,
        },
        {
            id: 3,
            title: 'Novo Menu de Inverno',
            author: 'Chef António',
            date: '3 dias atrás',
            content: 'Lançamos o novo menu de inverno. Por favor, familiarizem-se com os novos pratos e alergénios antes do próximo turno.',
            category: 'OPERACIONAL',
            likes: 18,
            comments: 5,
        },
    ];

    const getCategoryColor = (category) => {
        const colors = {
            IMPORTANTE: 'bg-red-500/20 border-red-500/30 text-red-400',
            RECONHECIMENTO: 'bg-green-500/20 border-green-500/30 text-green-400',
            OPERACIONAL: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
            FORMAÇÃO: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
        };
        return colors[category] || colors.OPERACIONAL;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Comunicação Interna</h2>
                    <p className="text-sm text-white/60 mt-1">Feed de anúncios e comunicados da gestão</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 transition-all"
                >
                    <Plus size={18} />
                    Novo Anúncio
                </button>
            </div>

            {/* Announcements Feed */}
            <div className="space-y-4">
                {announcements.map((announcement, index) => (
                    <motion.div
                        key={announcement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-panel p-8 rounded-[30px] hover:border-primary/20 transition-all"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center font-black text-white text-xs border border-primary/20">
                                    {announcement.author.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">{announcement.author}</h4>
                                    <p className="text-xs text-white/40">{announcement.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {announcement.isPinned && (
                                    <Pin size={16} className="text-primary" fill="currentColor" />
                                )}
                                <span className={`text-xs font-black px-3 py-1 rounded-full uppercase border ${getCategoryColor(announcement.category)}`}>
                                    {announcement.category}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-xl font-black text-white mb-3">{announcement.title}</h3>
                        <p className="text-white/60 leading-relaxed mb-4">{announcement.content}</p>

                        {/* Image */}
                        {announcement.hasImage && (
                            <div className="rounded-2xl overflow-hidden mb-4 aspect-video bg-white/5">
                                <img
                                    src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80"
                                    alt="Announcement"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-6">
                                <button className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors">
                                    <Heart size={18} />
                                    <span className="text-sm font-bold">{announcement.likes}</span>
                                </button>
                                <button className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors">
                                    <MessageCircle size={18} />
                                    <span className="text-sm font-bold">{announcement.comments}</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Info Card */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-[24px] p-6 flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-400">info</span>
                <div>
                    <h4 className="text-white font-bold mb-1">Comunicação Simples e Direta</h4>
                    <p className="text-sm text-white/60">
                        Os anúncios são exibidos para toda a equipa. Para comunicação individual, utilize os contactos diretos na aba Equipa.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StaffAnnouncements;
