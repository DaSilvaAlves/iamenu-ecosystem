import { motion } from 'framer-motion';
import { UserPlus, Mail, Phone, Star } from 'lucide-react';

const StaffTeam = () => {
    const teamMembers = [
        { id: 1, name: 'João Silva', position: 'Barman Chefe', rating: 4.8, shifts: 28, avatar: 'JS', status: 'active' },
        { id: 2, name: 'Maria Costa', position: 'Empregado Mesa', rating: 4.6, shifts: 24, avatar: 'MC', status: 'active' },
        { id: 3, name: 'Sofia Martins', position: 'Empregado Mesa', rating: 4.9, shifts: 26, avatar: 'SM', status: 'active' },
        { id: 4, name: 'Pedro Santos', position: 'Cozinheiro', rating: 4.7, shifts: 30, avatar: 'PS', status: 'vacation' },
        { id: 5, name: 'Ana Rodrigues', position: 'Barman', rating: 4.5, shifts: 22, avatar: 'AR', status: 'active' },
        { id: 6, name: 'Carlos Ferreira', position: 'Empregado Mesa', rating: 4.4, shifts: 20, avatar: 'CF', status: 'onboarding' },
    ];

    const getStatusBadge = (status: keyof typeof badges) => {
        const badges = {
            active: { text: 'Ativo', color: 'green' },
            vacation: { text: 'Férias', color: 'blue' },
            onboarding: { text: 'Onboarding', color: 'orange' },
        } as const;
        const badge = badges[status] || badges.active;
        return (
            <span className={`px-2 py-1 bg-${badge.color}-500/20 border border-${badge.color}-500/30 text-${badge.color}-400 text-[10px] font-black rounded-full uppercase`}>
                {badge.text}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Gestão de Equipa</h2>
                    <p className="text-sm text-white/60 mt-1">{teamMembers.length} colaboradores registados</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 transition-all">
                    <UserPlus size={18} />
                    Adicionar Colaborador
                </button>
            </div>

            {/* Team Grid */}
            <div className="grid md:grid-cols-3 gap-4">
                {teamMembers.map((member, index) => (
                    <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-panel p-6 rounded-[24px] hover:border-primary/30 transition-all"
                    >
                        {/* Avatar & Status */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center font-black text-white text-lg">
                                {member.avatar}
                            </div>
                            {getStatusBadge(member.status)}
                        </div>

                        {/* Info */}
                        <h3 className="text-white font-black mb-1">{member.name}</h3>
                        <p className="text-sm text-white/60 mb-4">{member.position}</p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-white/5">
                            <div>
                                <div className="flex items-center gap-1 mb-1">
                                    <Star size={12} className="text-yellow-400" fill="currentColor" />
                                    <span className="text-sm font-black text-white">{member.rating}</span>
                                </div>
                                <div className="text-[10px] text-white/40 font-bold uppercase">Rating</div>
                            </div>
                            <div>
                                <div className="text-sm font-black text-white mb-1">{member.shifts}</div>
                                <div className="text-[10px] text-white/40 font-bold uppercase">Turnos/Mês</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button className="flex-1 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1">
                                <Mail size={12} />
                                Email
                            </button>
                            <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1">
                                <Phone size={12} />
                                Tel
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StaffTeam;
