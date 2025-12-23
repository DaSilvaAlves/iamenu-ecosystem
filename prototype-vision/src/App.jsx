import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardBI from './views/DashboardBI';
import Academy from './views/Academy';
import MarketingPlanner from './views/MarketingPlanner';
import PaymentsAutomationView from './views/PaymentsAutomationView';
import FoodCostView from './views/FoodCostView';
import GastroLens from './views/GastroLens';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Award, MoreHorizontal, Plus } from 'lucide-react';

const CommunityView = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
        <div style={{
            width: '100%',
            height: '340px',
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
            backgroundImage: 'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid var(--border)'
        }}>
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 40px'
            }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '12px' }}>iaMenu Ecosystem</h2>
                <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px' }}>
                    Juntos estamos a revolucionar a restauração em Portugal. Bem-vindos ao futuro!
                </p>
            </div>
        </div>

        <div className="flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Feed</h3>
            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.875rem' }}>Popular ↓</div>
                <button style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={18} /> New post
                </button>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--border)' }}></div>
                        <span style={{ fontSize: '0.9rem' }}>Vais partilhar algo hoje, Eurico?</span>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--border)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👩‍🍳</div>
                                <div>
                                    <h4 style={{ fontWeight: 'bold', fontSize: '1rem' }}>Sónia Rodrigues</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>há 1 hora em <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Marketing Planner</span></p>
                                </div>
                            </div>
                            <MoreHorizontal size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px' }}>
                            [ESTRATÉGIA] Como aumentei o meu ticket médio em 20% com o QRCode Multilingue
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', marginBottom: '20px' }}>
                            Pessoal, a integração do menu multilingue foi o "game-changer". Os turistas agora pedem entradas e vinhos que antes nem sabiam que existiam. Vejam este fluxo que desenhei...
                        </p>

                        <div style={{
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            padding: '20px',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>📝</div>
                                <span style={{ fontWeight: '600' }}>Fluxo-Conversao.pdf</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>24.5 KB</span>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        padding: '12px 24px',
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        gap: '24px',
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><MessageSquare size={16} /> 24 Comentários</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><Award size={16} /> 15 Kudo</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Eventos Próximos</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { date: '28 JAN', title: 'Webinar: IA na Gestão de Stocks', time: '15:00 WET' },
                            { date: '12 FEV', title: 'Networking Algarve: Restauradores 4.0', time: '11:00 WET' }
                        ].map(event => (
                            <div key={event.title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <div style={{
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    padding: '8px',
                                    borderRadius: '6px',
                                    textAlign: 'center',
                                    minWidth: '60px'
                                }}>
                                    <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{event.date.split(' ')[0]}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{event.date.split(' ')[1]}</p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.85rem', fontWeight: '600' }}>{event.title}</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{event.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Tendências</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['#DigitalGastro', '#EcoEfficiency', '#StaffRetention', '#MarketAI'].map(tag => (
                            <span key={tag} style={{
                                fontSize: '0.75rem',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                color: 'var(--text-muted)',
                                cursor: 'pointer'
                            }}>{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

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
