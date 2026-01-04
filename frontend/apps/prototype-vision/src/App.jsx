import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardBI from './views/DashboardBI';
import AlertsView from './views/AlertsView';
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
import Marketplace from './views/Marketplace';
import ResponsesTab from './views/ResponsesTab'; // Adicionar import para ResponsesTab
import TakewayLandingView from './views/TakewayLandingView';
import ReputacaoOnlineView from './views/ReputacaoOnlineView';
import HubsRegionaisView from './views/HubsRegionaisView';
import VisaoEcossistemaView from './views/VisaoEcossistemaView';
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

import { Routes, Route, useLocation } from 'react-router-dom';
import SupplierDetail from './views/SupplierDetail';

const App = () => {
    // State for features not yet migrated to router state
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onboardingCompleted = localStorage.getItem('iaMenu_onboarding_completed');
        if (!onboardingCompleted) {
            setShowOnboarding(true);
        }
    }, []);

    // These functions will be refactored later to use navigate()
    const navigateToGroupDetail = (groupId) => {
        setSelectedGroupId(groupId);
        // In a future step, this would be: navigate(`/grupos/${groupId}`);
    };

    const handleBackToGroups = () => {
        // In a future step, this would be: navigate('/grupos');
    }

    return (
        <>
            {showOnboarding && (
                <TourRapidoView
                    onComplete={() => setShowOnboarding(false)}
                    onSkip={() => setShowOnboarding(false)}
                />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
                <TopBar />
                <div style={{ display: 'flex', flex: 1 }}>
                    <Sidebar selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />
                    <main style={{ flex: 1, padding: '32px', overflowY: 'auto', backgroundColor: '#0c0c0c' }}>
                        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                            <AnimatePresence mode="wait">
                                <div key={location.pathname}>
                                    <Routes location={location}>
                                        <Route path="/" element={<CommunityView selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />} />
                                        <Route path="/comunidade" element={<CommunityView selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />} />
                                        <Route path="/grupos" element={<GroupsView onViewGroup={navigateToGroupDetail} />} />
                                        <Route path="/grupo-detalhe" element={<GroupDetailView groupId={selectedGroupId} onBack={handleBackToGroups} />} />
                                        <Route path="/pesquisa" element={<SearchView onNavigateToGroup={navigateToGroupDetail} />} />
                                        <Route path="/perfil" element={<ProfileView />} />
                                        <Route path="/dashboard" element={<DashboardBI />} />
                                        <Route path="/alerts" element={<AlertsView />} />
                                        <Route path="/foodcost" element={<FoodCostView />} />
                                        <Route path="/marketing" element={<MarketingPlanner />} />
                                        <Route path="/gastrolens" element={<GastroLens />} />
                                        <Route path="/upgrade" element={<UpgradePROView />} />
                                        <Route path="/pagamentos" element={<PaymentsAutomationView />} />
                                        <Route path="/aulas" element={<Academy />} />
                                        <Route path="/onboarding" element={<OnboardingView onComplete={() => { /* navigate to dashboard */ }} />} />
                                        <Route path="/visao" element={<VisaoEcossistemaView />} />
                                        <Route path="/reputacao" element={<ReputacaoOnlineView />} />
                                        <Route path="/equipas" element={<StandardPlaceholder title="Escalas de Staff AI" />} />
                                        <Route path="/marketplace" element={<Marketplace />} />
                                        <Route path="/marketplace/quotes/:rfqId/responses" element={<ResponsesTab />} />
                                        <Route path="/marketplace/suppliers/:id" element={<SupplierDetail />} />
                                        <Route path="/takeway" element={<TakewayLandingView />} />
                                        <Route path="/hubs" element={<HubsRegionaisView />} />
                                        <Route path="/lab" element={<ChatView />} />
                                    </Routes>
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
