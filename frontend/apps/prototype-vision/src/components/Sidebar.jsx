import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    ChevronDown,
    ChevronLeft,
    MapPin,
    Zap,
    Brain,
    Lightbulb,
    Trophy,
    Video,
    Library,
    Users,
    ShoppingCart,
    FlaskConical,
    Target,
    LayoutDashboard,
    Calculator,
    Star,
    CreditCard,
    Camera,
    ChefHat,
    Package,
    X
} from 'lucide-react';
import { CommunityAPI } from '../services/api';
import NotificationBadge from './NotificationBadge';
import NotificationsPanel from './NotificationsPanel';
import { useSidebarStore } from '../stores/uiStore';

const NavItem = ({ icon: Icon, label, to, badge, isCollapsed = false }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    if (isCollapsed) {
        return (
            <Link
                to={to}
                className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all duration-200 group relative ${isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                title={label}
            >
                {Icon && <Icon size={20} className={isActive ? 'text-primary' : 'text-white/50 group-hover:text-primary'} />}
                {badge && (
                    <span className="absolute -top-1 -right-1 text-[0.6rem] bg-primary text-white px-1.5 py-0.5 rounded-full">
                        {badge}
                    </span>
                )}
            </Link>
        );
    }

    return (
        <Link
            to={to}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group ${isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
        >
            <div className="flex items-center gap-3">
                {Icon && <Icon size={18} className={isActive ? 'text-primary' : 'text-white/50 group-hover:text-primary'} />}
                <span style={{ fontSize: '0.875rem' }}>{label}</span>
            </div>
            {badge && (
                <span style={{
                    fontSize: '0.7rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: 'var(--text-muted)'
                }}>
                    {badge}
                </span>
            )}
        </Link>
    );
};


const SidebarSection = ({ title, children, hasChevron = true, isCollapsed = false }) => {
    if (isCollapsed) {
        return (
            <div style={{ marginBottom: '16px' }}>
                <div className="w-8 h-px bg-white/10 mx-auto mb-3" />
                <div className="flex flex-col gap-1 items-center">
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div style={{ marginBottom: '24px' }}>
            <p style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                fontWeight: '700',
                padding: '0 12px',
                marginBottom: '10px',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
            }}>
                {title} {hasChevron && <ChevronDown size={12} />}
            </p>
            <div className="flex flex-col gap-1">
                {children}
            </div>
        </div>
    );
};

// Extracted sidebar content for reuse in mobile drawer and desktop sidebar
const SidebarContent = ({
    groups,
    loadingGroups,
    showNotifications,
    setShowNotifications,
    isComunidadeActive,
    setSelectedGroup,
    getGroupIcon,
    isCollapsed = false
}) => {
    const location = useLocation();

    return (
        <>
            {/* Notifications - hidden when collapsed */}
            {!isCollapsed && (
                <div style={{ marginBottom: '16px' }}>
                    <NotificationBadge
                        onClick={() => setShowNotifications(!showNotifications)}
                    />
                    <NotificationsPanel
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                    />
                </div>
            )}

            {/* Feed link */}
            <div style={{ marginBottom: '24px' }}>
                <Link
                    to="/comunidade"
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg cursor-pointer transition-all ${isComunidadeActive ? 'bg-white/5 text-white' : 'text-text-muted hover:text-white'
                        }`}
                    style={{ backgroundColor: isComunidadeActive ? 'rgba(255,255,255,0.08)' : 'transparent' }}
                    title={isCollapsed ? 'Feed' : undefined}
                >
                    <div style={{
                        padding: '6px',
                        borderRadius: '6px',
                        backgroundColor: isComunidadeActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)'
                    }}>
                        <MessageSquare size={16} color={isComunidadeActive ? 'white' : 'inherit'} />
                    </div>
                    {!isCollapsed && <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Feed</span>}
                </Link>
            </div>

            <SidebarSection title="Comece por aqui" isCollapsed={isCollapsed}>
                <NavItem label="Primeiros Passos iaMenu" icon={Zap} to="/onboarding" isCollapsed={isCollapsed} />
                <NavItem label="Visão do Ecossistema" icon={Brain} to="/visao" isCollapsed={isCollapsed} />
            </SidebarSection>

            <SidebarSection title="Academia e Gestão" isCollapsed={isCollapsed}>
                <NavItem label="Reputação Online" icon={Star} to="/reputacao" isCollapsed={isCollapsed} />
                <NavItem label="iaMenu PRO - Upgrade" icon={Zap} to="/upgrade" badge="PRO" isCollapsed={isCollapsed} />
                <NavItem label="iaMenu Takeway" icon={Package} to="/takeway" badge="NOVO" isCollapsed={isCollapsed} />
                <NavItem label="Custos & Fichas Técnica" icon={Calculator} to="/foodcost" isCollapsed={isCollapsed} />
                <NavItem label="Plano de Marketing" icon={Target} to="/marketing" isCollapsed={isCollapsed} />
                <NavItem label="Fotos & IA de Pratos" icon={Camera} to="/gastrolens" badge="NOVO" isCollapsed={isCollapsed} />
                <NavItem label="Painel de Controlo do Negócio" icon={LayoutDashboard} to="/dashboard" isCollapsed={isCollapsed} />
                <NavItem label="Escalas de Staff AI" icon={Users} to="/equipas" isCollapsed={isCollapsed} />
                <NavItem label="Aulas ao VIVO" icon={Video} to="/aulas" isCollapsed={isCollapsed} />
            </SidebarSection>

            {/* Groups section - hidden when collapsed */}
            {!isCollapsed && (
                <SidebarSection title="Grupos da Comunidade" isCollapsed={isCollapsed}>
                    {loadingGroups ? (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0 12px' }}>A carregar...</p>
                    ) : (
                        groups.slice(0, 5).map((group) => (
                            <div key={group.id} onClick={() => setSelectedGroup(group)}>
                                <NavItem
                                    label={group.name}
                                    icon={getGroupIcon(group.category)}
                                    badge={group.memberCount > 0 ? group.memberCount.toString() : null}
                                    to="/comunidade"
                                    isCollapsed={isCollapsed}
                                />
                            </div>
                        ))
                    )}
                    <div style={{ padding: '8px 12px', marginTop: '8px' }}>
                        <Link
                            to="/grupos"
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--primary)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                textDecoration: 'none',
                                fontWeight: '600',
                            }}
                        >
                            Ver todos os {groups.length} grupos →
                        </Link>
                    </div>
                </SidebarSection>
            )}

            <SidebarSection title="Hub de Negócios" isCollapsed={isCollapsed}>
                <NavItem label="Rede de Fornecedores" icon={ShoppingCart} to="/marketplace" isCollapsed={isCollapsed} />
                <NavItem label="Centros Regionais (Algarve)" icon={MapPin} to="/hubs" badge="5" isCollapsed={isCollapsed} />
            </SidebarSection>

            {/* Footer - hidden when collapsed */}
            {!isCollapsed && (
                <div style={{
                    marginTop: 'auto',
                    paddingTop: '20px',
                    padding: '12px',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>Powered by iaMenu Core</p>
                </div>
            )}
        </>
    );
};

const Sidebar = ({ selectedGroup, setSelectedGroup }) => {
    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const location = useLocation();
    const isComunidadeActive = location.pathname === '/comunidade' || location.pathname === '/';

    // Responsive state from store
    const { isMobile, isTablet, isCollapsed, isOpen, close, toggle } = useSidebarStore();

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            const data = await CommunityAPI.getGroups({ limit: 10 });
            setGroups(data.data || []);
        } catch (err) {
            console.error('Error loading groups:', err);
        } finally {
            setLoadingGroups(false);
        }
    };

    const getGroupIcon = (category) => {
        if (category === 'region') return MapPin;
        if (category === 'theme') return Lightbulb;
        return Users;
    };

    // Calculate sidebar width based on state
    const getSidebarWidth = () => {
        if (isMobile) return '280px';
        if (isCollapsed) return '64px';
        return '280px';
    };

    // Swipe gesture support for mobile
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);
    const minSwipeDistance = 50;

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchEndX.current = null;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > minSwipeDistance;

        if (isLeftSwipe && isOpen) {
            close();
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    // Mobile: render as drawer overlay
    if (isMobile) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={close}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                zIndex: 998,
                                backdropFilter: 'blur(4px)'
                            }}
                        />
                        {/* Sidebar drawer with swipe support */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '280px',
                                height: '100vh',
                                backgroundColor: 'var(--bg-sidebar)',
                                borderRight: '1px solid var(--border)',
                                padding: '16px',
                                zIndex: 999,
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'auto',
                                touchAction: 'pan-y'
                            }}
                        >
                            {/* Close button */}
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold">Menu</span>
                                <button
                                    onClick={close}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <SidebarContent
                                groups={groups}
                                loadingGroups={loadingGroups}
                                showNotifications={showNotifications}
                                setShowNotifications={setShowNotifications}
                                isComunidadeActive={isComunidadeActive}
                                setSelectedGroup={setSelectedGroup}
                                getGroupIcon={getGroupIcon}
                                isCollapsed={false}
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    }

    // Tablet/Desktop: render as fixed sidebar
    return (
        <div style={{
            width: getSidebarWidth(),
            minWidth: getSidebarWidth(),
            height: 'calc(100vh - 64px)',
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border)',
            padding: isCollapsed ? '16px 8px' : '16px',
            position: 'sticky',
            top: '64px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            transition: 'width 0.3s ease, min-width 0.3s ease, padding 0.3s ease'
        }}>
            <SidebarContent
                groups={groups}
                loadingGroups={loadingGroups}
                showNotifications={showNotifications}
                setShowNotifications={setShowNotifications}
                isComunidadeActive={isComunidadeActive}
                setSelectedGroup={setSelectedGroup}
                getGroupIcon={getGroupIcon}
                isCollapsed={isCollapsed}
            />
        </div>
    );
};

export default Sidebar;