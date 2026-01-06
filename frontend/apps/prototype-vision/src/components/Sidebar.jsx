import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    MessageSquare,
    ChevronDown,
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
    Package
} from 'lucide-react';
import { CommunityAPI } from '../services/api';
import NotificationBadge from './NotificationBadge';
import NotificationsPanel from './NotificationsPanel';

const NavItem = ({ icon: Icon, label, to, badge }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

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


const SidebarSection = ({ title, children, hasChevron = true }) => (
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

const Sidebar = ({ selectedGroup, setSelectedGroup }) => {
    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const location = useLocation();
    const isComunidadeActive = location.pathname === '/comunidade' || location.pathname === '/';

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

    return (
        <div style={{
            width: '280px',
            height: '100vh',
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border)',
            padding: '16px',
            position: 'sticky',
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
        }}>
            {/* Notifications */}
            <div style={{ marginBottom: '16px' }}>
                <NotificationBadge
                    onClick={() => setShowNotifications(!showNotifications)}
                />
                <NotificationsPanel
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                />
            </div>

            <div style={{ marginBottom: '24px' }}>
                <Link
                    to="/comunidade"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${isComunidadeActive ? 'bg-white/5 text-white' : 'text-text-muted hover:text-white'
                        }`}
                    style={{ backgroundColor: isComunidadeActive ? 'rgba(255,255,255,0.08)' : 'transparent' }}
                >
                    <div style={{
                        padding: '6px',
                        borderRadius: '6px',
                        backgroundColor: isComunidadeActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)'
                    }}>
                        <MessageSquare size={16} color={isComunidadeActive ? 'white' : 'inherit'} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Feed</span>
                </Link>
            </div>

            <SidebarSection title="Comece por aqui">
                <NavItem label="Primeiros Passos iaMenu" icon={Zap} to="/onboarding" />
                <NavItem label="Visão do Ecossistema" icon={Brain} to="/visao" />
            </SidebarSection>

            <SidebarSection title="Academia e Gestão">
                <NavItem label="Reputação Online" icon={Star} to="/reputacao" />
                <NavItem label="iaMenu PRO - Upgrade" icon={Zap} to="/upgrade" badge="PRO" />
                <NavItem label="iaMenu Takeway" icon={Package} to="/takeway" badge="NOVO" />
                <NavItem label="Custos & Fichas Técnica" icon={Calculator} to="/foodcost" />
                <NavItem label="Plano de Marketing" icon={Target} to="/marketing" />
                <NavItem label="Fotos & IA de Pratos" icon={Camera} to="/gastrolens" badge="NOVO" />
                <NavItem label="Painel de Controlo do Negócio" icon={LayoutDashboard} to="/dashboard" />
                <NavItem label="Escalas de Staff AI" icon={Users} to="/equipas" />
                <NavItem label="Aulas ao VIVO" icon={Video} to="/aulas" />
            </SidebarSection>

            <SidebarSection title="Grupos da Comunidade">
                {loadingGroups ? (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0 12px' }}>A carregar...</p>
                ) : (
                    groups.slice(0, 5).map((group) => (
                        <div key={group.id} onClick={() => setSelectedGroup(group)}>
                             <NavItem
                                label={group.name}
                                icon={getGroupIcon(group.category)}
                                badge={group.memberCount > 0 ? group.memberCount.toString() : null}
                                to="/comunidade" // All group clicks go to the community feed
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

            <SidebarSection title="Hub de Negócios">
                <NavItem label="Rede de Fornecedores" icon={ShoppingCart} to="/marketplace" />
                <NavItem label="Centros Regionais (Algarve)" icon={MapPin} to="/hubs" badge="5" />
            </SidebarSection>

            <div style={{
                marginTop: 'auto',
                paddingTop: '20px',
                padding: '12px',
                textAlign: 'center'
            }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>Powered by iaMenu Core</p>
            </div>
        </div>
    );
};

export default Sidebar;