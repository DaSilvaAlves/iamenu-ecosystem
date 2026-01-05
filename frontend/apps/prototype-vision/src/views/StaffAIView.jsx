import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, GraduationCap, Megaphone, LayoutDashboard } from 'lucide-react';
import StaffDashboard from './staff-ai/StaffDashboard';
import StaffSchedule from './staff-ai/StaffSchedule';
import StaffTeam from './staff-ai/StaffTeam';
import StaffOnboarding from './staff-ai/StaffOnboarding';
import StaffAnnouncements from './staff-ai/StaffAnnouncements';

const StaffAIView = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'schedule', label: 'Escalas', icon: Calendar },
        { id: 'team', label: 'Equipa', icon: Users },
        { id: 'onboarding', label: 'Onboarding', icon: GraduationCap },
        { id: 'announcements', label: 'Anúncios', icon: Megaphone },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="glass-panel p-8 rounded-[40px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="material-symbols-outlined text-primary text-4xl">groups</span>
                                <h1 className="font-black text-4xl text-white uppercase tracking-tighter">
                                    Escalas de Staff AI
                                </h1>
                            </div>
                            <p className="text-white/60 text-sm max-w-2xl">
                                Gestão inteligente de equipas, turnos e formação. Reduz conflitos,
                                aumenta transparência e melhora a satisfação do staff.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-2xl">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 text-sm font-bold">Sistema Ativo</span>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <div className="text-2xl font-black text-primary mb-1">12</div>
                            <div className="text-xs text-white/60 font-bold uppercase">Colaboradores Ativos</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <div className="text-2xl font-black text-primary mb-1">3</div>
                            <div className="text-xs text-white/60 font-bold uppercase">Pedidos Pendentes</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <div className="text-2xl font-black text-green-400 mb-1">85%</div>
                            <div className="text-xs text-white/60 font-bold uppercase">Satisfação da Equipa</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <div className="text-2xl font-black text-blue-400 mb-1">2</div>
                            <div className="text-xs text-white/60 font-bold uppercase">Em Onboarding</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="glass-panel rounded-[30px] p-2 flex gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[24px] font-black text-sm uppercase tracking-wider transition-all ${
                            activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-white/40 hover:text-white/60 hover:bg-white/5'
                        }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'dashboard' && <StaffDashboard />}
                    {activeTab === 'schedule' && <StaffSchedule />}
                    {activeTab === 'team' && <StaffTeam />}
                    {activeTab === 'onboarding' && <StaffOnboarding />}
                    {activeTab === 'announcements' && <StaffAnnouncements />}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default StaffAIView;
