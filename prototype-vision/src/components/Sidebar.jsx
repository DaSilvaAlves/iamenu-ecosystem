import React, { useState, useEffect } from 'react';
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
    ChefHat
} from 'lucide-react';
import { CommunityAPI } from '../services/api';
import NotificationBadge from './NotificationBadge';
import NotificationsPanel from './NotificationsPanel';

const NavItem = ({ icon: Icon, label, active, onClick, badge }) => (
    <div
        onClick={onClick}
        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group ${active
            ? 'bg-white/10 text-white'
            : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
    >
        <div className="flex items-center gap-3">
            {Icon && <Icon size={18} className={active ? 'text-primary' : 'text-white/50 group-hover:text-primary'} />}
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
    </div>
);

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

const Sidebar = ({ currentView, setView, selectedGroup, setSelectedGroup }) => {
    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

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
                <div
                    onClick={() => setView('comunidade')}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${currentView === 'comunidade' ? 'bg-white/5 text-white' : 'text-text-muted hover:text-white'
                        }`}
                    style={{ backgroundColor: currentView === 'comunidade' ? 'rgba(255,255,255,0.08)' : 'transparent' }}
                >
                    <div style={{
                        padding: '6px',
                        borderRadius: '6px',
                        backgroundColor: currentView === 'comunidade' ? 'var(--primary)' : 'rgba(255,255,255,0.05)'
                    }}>
                        <MessageSquare size={16} color={currentView === 'comunidade' ? 'white' : 'inherit'} />
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Feed</span>
                </div>
            </div>

            <SidebarSection title="Comece por aqui">
                <NavItem label="Onboarding iaMenu" icon={Zap} active={currentView === 'onboarding'} onClick={() => setView('onboarding')} />
                <NavItem label="Visão do Ecossistema" icon={Brain} active={currentView === 'visao'} onClick={() => setView('visao')} />
            </SidebarSection>

            <SidebarSection title="Academia e Gestão">
                <NavItem label="Audit de Reputação Online" icon={Star} active={currentView === 'reputacao'} onClick={() => setView('reputacao')} />
                <NavItem label="Pagamentos & Pedidos" icon={CreditCard} active={currentView === 'pagamentos'} onClick={() => setView('pagamentos')} badge="PRO" />
                <NavItem label="Food Cost & Fichas Técnicas" icon={Calculator} active={currentView === 'foodcost'} onClick={() => setView('foodcost')} />
                <NavItem label="Marketing Planner AI" icon={Target} active={currentView === 'marketing'} onClick={() => setView('marketing')} />
                <NavItem label="GastroLens AI" icon={Camera} active={currentView === 'gastrolens'} onClick={() => setView('gastrolens')} badge="NOVO" />
                <NavItem label="Dashboard Business Intel" icon={LayoutDashboard} active={currentView === 'dashboard'} onClick={() => setView('dashboard')} />
                <NavItem label="Escalas de Staff AI" icon={Users} active={currentView === 'equipas'} onClick={() => setView('equipas')} />
                <NavItem label="Aulas ao VIVO" icon={Video} active={currentView === 'aulas'} onClick={() => setView('aulas')} />
            </SidebarSection>

            <SidebarSection title="Grupos da Comunidade">
                {loadingGroups ? (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0 12px' }}>A carregar...</p>
                ) : (
                    groups.slice(0, 5).map((group) => (
                        <NavItem
                            key={group.id}
                            label={group.name}
                            icon={getGroupIcon(group.category)}
                            badge={group.memberCount > 0 ? group.memberCount.toString() : null}
                            active={selectedGroup?.id === group.id}
                            onClick={() => {
                                setSelectedGroup(group);
                                setView('comunidade');
                            }}
                        />
                    ))
                )}
                <div style={{ padding: '8px 12px', marginTop: '8px' }}>
                    <button
                        onClick={() => setView('grupos')}
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
                    </button>
                </div>
            </SidebarSection>

            <SidebarSection title="Hub de Negócios">
                <NavItem label="Marketplace Fornecedores" icon={ShoppingCart} active={currentView === 'marketplace'} onClick={() => setView('marketplace')} />
                <NavItem label="Hubs Regionais (Algarve)" icon={MapPin} active={currentView === 'hubs'} onClick={() => setView('hubs')} badge="5" />
                <NavItem label="Chat Comunidade" icon={MessageSquare} active={currentView === 'lab'} onClick={() => setView('lab')} badge="99+" />
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
