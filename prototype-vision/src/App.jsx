import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardBI from './views/DashboardBI';
import Academy from './views/Academy';
import MarketingPlanner from './views/MarketingPlanner';
import PaymentsAutomationView from './views/PaymentsAutomationView';
import FoodCostView from './views/FoodCostView';
import GastroLens from './views/GastroLens';
import CommunityView from './views/CommunityView';
import ProfileView from './views/ProfileView';
import GroupsView from './views/GroupsView';
import GroupDetailView from './views/GroupDetailView';
import SearchView from './views/SearchView';
import ChatView from './views/ChatView';
import UpgradePROView from './views/UpgradePROView';
import TourRapidoView from './views/TourRapidoView';
import OnboardingView from './views/OnboardingView';
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
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        // Check if onboarding was completed
        const onboardingCompleted = localStorage.getItem('iaMenu_onboarding_completed');
        if (!onboardingCompleted) {
            setShowOnboarding(true);
        }
    }, []);

    const navigateToGroupDetail = (groupId) => {
        setSelectedGroupId(groupId);
        setView('grupo-detalhe');
    };

    const renderContent = () => {
        switch (currentView) {
            case 'comunidade': return <CommunityView selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />;
            case 'grupos': return <GroupsView onViewGroup={navigateToGroupDetail} />;
            case 'grupo-detalhe': return <GroupDetailView groupId={selectedGroupId} onBack={() => setView('grupos')} />;
            case 'pesquisa': return <SearchView onNavigateToGroup={navigateToGroupDetail} />;
            case 'perfil': return <ProfileView />;
            case 'dashboard': return <DashboardBI />;
            case 'foodcost': return <FoodCostView />;
            case 'marketing': return <MarketingPlanner />;
            case 'gastrolens': return <GastroLens />;
            case 'upgrade': return <UpgradePROView />;
            case 'pagamentos': return <PaymentsAutomationView />;
            case 'aulas': return <Academy />;
            case 'onboarding': return <OnboardingView onComplete={() => setView('dashboard')} />;
            case 'visao': return <StandardPlaceholder title="Visão do Ecossistema" />;
            case 'reputacao': return <StandardPlaceholder title="Audit de Reputação" />;
            case 'equipas': return <StandardPlaceholder title="Escalas de Staff AI" />;
            case 'marketplace': return <StandardPlaceholder title="Marketplace" />;
            case 'hubs': return <StandardPlaceholder title="Hubs Regionais" />;
            case 'lab': return <ChatView />;
            default: return <CommunityView selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />;
        }
    };

    return (
        <>
            {showOnboarding && (
                <TourRapidoView
                    onComplete={() => setShowOnboarding(false)}
                    onSkip={() => setShowOnboarding(false)}
                />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
                <TopBar setView={setView} />
                <div style={{ display: 'flex', flex: 1 }}>
                    <Sidebar currentView={currentView} setView={setView} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />
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
        </>
    );
};

export default App;
