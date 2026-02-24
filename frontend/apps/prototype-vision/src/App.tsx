import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { useSidebarStore, useViewportDetection } from './stores/uiStore';
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
import ResponsesTab from './views/ResponsesTab';
import TakewayLandingView from './views/TakewayLandingView';
import ReputacaoOnlineView from './views/ReputacaoOnlineView';
import HubsRegionaisView from './views/HubsRegionaisView';
import VisaoEcossistemaView from './views/VisaoEcossistemaView';
import StaffAIView from './views/StaffAIView';
import SupplierDetail from './views/SupplierDetail';
import CopyStudioView from './views/CopyStudioView';
import { AnimatePresence } from 'framer-motion';

const App = () => {
    console.log('📱 App: Render Cycle Start');
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const { isMobile, isOpen: sidebarOpen, close: closeSidebar } = useSidebarStore();
    const { init: initViewport } = useViewportDetection();

    useEffect(() => {
        const cleanup = initViewport();
        return cleanup;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isMobile && sidebarOpen) {
            closeSidebar();
        }
    }, [location.pathname, isMobile, sidebarOpen, closeSidebar]);

    useEffect(() => {
        const onboardingCompleted = localStorage.getItem('iaMenu_onboarding_completed');
        if (!onboardingCompleted) {
            setShowOnboarding(true);
        }
    }, []);

    const navigateToGroupDetail = (groupId: string) => {
        setSelectedGroupId(groupId);
    };

    const handleBackToGroups = () => {
        setSelectedGroupId(null);
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
                <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
                    <Sidebar selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />
                    <main style={{ flex: 1, padding: isMobile ? '16px' : '32px', overflowY: 'auto', backgroundColor: '#0c0c0c' }}>
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
                                        <Route path="/onboarding" element={<OnboardingView onComplete={() => navigate('/dashboard')} />} />
                                        <Route path="/visao" element={<VisaoEcossistemaView />} />
                                        <Route path="/reputacao" element={<ReputacaoOnlineView />} />
                                        <Route path="/equipas" element={<StaffAIView />} />
                                        <Route path="/marketplace" element={<Marketplace />} />
                                        <Route path="/marketplace/quotes/:rfqId/responses" element={<ResponsesTab />} />
                                        <Route path="/marketplace/suppliers/:id" element={<SupplierDetail />} />
                                        <Route path="/takeway" element={<TakewayLandingView />} />
                                        <Route path="/hubs" element={<HubsRegionaisView />} />
                                        <Route path="/lab" element={<ChatView />} />
                                        <Route path="/copy-studio" element={<CopyStudioView />} />
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
