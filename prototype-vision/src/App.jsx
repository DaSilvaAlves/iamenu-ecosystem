import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardBI from './views/DashboardBI';
import Academy from './views/Academy';
import MarketingPlanner from './views/MarketingPlanner';
import PaymentsAutomationView from './views/PaymentsAutomationView';
import FoodCostView from './views/FoodCostView';
import GastroLens from './views/GastroLens';
import CommunityView from './views/CommunityView';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const StandardPlaceholder = ({ title, icon: Icon }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-20 rounded-[40px] text-center border border-white/5 border-dashed bg-white/[0.01]"
        style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-white/20 mb-8">
            {Icon ? <Icon size={40} /> : <div className="text-4xl italic font-black">ia</div>}
        </div>
        <h3 className="text-3xl font-black text-white/20 uppercase italic tracking-tighter">Módulo {title}</h3>
        <p className="text-white/10 font-bold mt-2 uppercase text-xs tracking-[0.4em]">Integração com o Core iaMenu em curso...</p>
        <div className="mt-12 flex gap-4">
            <div className="w-2 h-2 rounded-full bg-primary/20 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-primary/20 animate-pulse delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-primary/20 animate-pulse delay-150"></div>
        </div>
    </motion.div>
);

const App = () => {
    const [currentView, setView] = useState('comunidade');

    const renderContent = () => {
        switch (currentView) {
            case 'comunidade': return <CommunityView />;
            case 'dashboard': return <DashboardBI />;
            case 'foodcost': return <FoodCostView />;
            case 'marketing': return <MarketingPlanner />;
            case 'gastrolens': return <GastroLens />;
            case 'pagamentos': return <PaymentsAutomationView />;
            case 'aulas': return <Academy />;
            case 'onboarding': return <StandardPlaceholder title="Onboarding" icon={Plus} />;
            case 'visao': return <StandardPlaceholder title="Visão do Ecossistema" />;
            case 'reputacao': return <StandardPlaceholder title="Audit de Reputação" />;
            case 'equipas': return <StandardPlaceholder title="Escalas de Staff AI" />;
            case 'marketplace': return <StandardPlaceholder title="Marketplace" />;
            case 'hubs': return <StandardPlaceholder title="Hubs Regionais" />;
            case 'lab': return <StandardPlaceholder title="Laboratório" />;
            default: return <CommunityView />;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
            <TopBar />
            <div style={{ display: 'flex', flex: 1 }}>
                <Sidebar currentView={currentView} setView={setView} />
                <main style={{ flex: 1, padding: '32px', overflowY: 'auto', backgroundColor: '#0c0c0c' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <AnimatePresence mode="wait">
                            <div key={currentView}>
                                {renderContent()}
                            </div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
