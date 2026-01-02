import React from 'react';
import { Check, Zap, TrendingUp, Users, CreditCard, BarChart3, Package, MessageSquare, ExternalLink } from 'lucide-react';

const UpgradePROView = () => {
    const handleUpgrade = () => {
        window.open('https://iamenu.pt/', '_blank');
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
            padding: '40px 20px',
            overflowY: 'auto'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '8px 20px',
                        background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
                        borderRadius: '30px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '20px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        ⚡ Upgrade Profissional
                    </div>

                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #ffffff, #FF6B35)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '20px',
                        lineHeight: '1.2'
                    }}>
                        iaMenu PRO
                    </h1>

                    <p style={{
                        fontSize: '1.3rem',
                        color: 'rgba(255,255,255,0.7)',
                        maxWidth: '600px',
                        margin: '0 auto 30px',
                        lineHeight: '1.6'
                    }}>
                        A plataforma completa de gestão para restaurantes profissionais
                    </p>

                    <button
                        onClick={handleUpgrade}
                        style={{
                            padding: '18px 50px',
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 8px 30px rgba(255, 107, 53, 0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 12px 40px rgba(255, 107, 53, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 8px 30px rgba(255, 107, 53, 0.4)';
                        }}
                    >
                        <Zap size={20} />
                        Começar Agora
                        <ExternalLink size={18} />
                    </button>

                    <p style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255,255,255,0.5)',
                        marginTop: '15px'
                    }}>
                        💳 Teste grátis • ⚡ Configuração instantânea
                    </p>
                </div>

                {/* Comparison Table */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px',
                    padding: '40px',
                    marginBottom: '60px',
                    backdropFilter: 'blur(10px)'
                }}>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: 'white',
                        textAlign: 'center',
                        marginBottom: '40px'
                    }}>
                        Ecosystem vs iaMenu PRO
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '20px',
                        alignItems: 'start'
                    }}>
                        {/* Header */}
                        <div></div>
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '20px',
                            borderRadius: '16px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>
                                Ecosystem
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '5px' }}>
                                Grátis 30 dias
                            </div>
                        </div>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(255,140,66,0.2))',
                            border: '2px solid #FF6B35',
                            padding: '20px',
                            borderRadius: '16px',
                            textAlign: 'center',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: '#FF6B35',
                                padding: '4px 16px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: 'white'
                            }}>
                                RECOMENDADO
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>
                                iaMenu PRO
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginTop: '5px' }}>
                                Solução Completa
                            </div>
                        </div>

                        {/* Features */}
                        {[
                            { name: 'Comunidade & Networking', ecosystem: true, pro: true },
                            { name: 'Badges & Gamificação', ecosystem: true, pro: true },
                            { name: 'Posts & Grupos', ecosystem: true, pro: true },
                            { name: 'Menus Digitais QR', ecosystem: false, pro: true },
                            { name: 'Chat IA no Cardápio', ecosystem: false, pro: true },
                            { name: 'Gestão de Produtos', ecosystem: false, pro: true },
                            { name: 'Categorias & Traduções', ecosystem: false, pro: true },
                            { name: 'Dashboard Analytics', ecosystem: false, pro: true },
                            { name: 'Integração POS', ecosystem: false, pro: true },
                            { name: 'Pagamentos Online', ecosystem: false, pro: true },
                            { name: 'Suporte Prioritário', ecosystem: false, pro: true }
                        ].map((feature, idx) => (
                            <React.Fragment key={idx}>
                                <div style={{
                                    padding: '15px 0',
                                    color: 'rgba(255,255,255,0.9)',
                                    fontSize: '0.95rem',
                                    fontWeight: '500',
                                    borderBottom: idx < 10 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                                }}>
                                    {feature.name}
                                </div>
                                <div style={{
                                    padding: '15px 0',
                                    textAlign: 'center',
                                    borderBottom: idx < 10 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                                }}>
                                    {feature.ecosystem ? (
                                        <Check size={20} color="#4ade80" strokeWidth={3} />
                                    ) : (
                                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
                                    )}
                                </div>
                                <div style={{
                                    padding: '15px 0',
                                    textAlign: 'center',
                                    borderBottom: idx < 10 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                                }}>
                                    {feature.pro ? (
                                        <Check size={20} color="#FF6B35" strokeWidth={3} />
                                    ) : (
                                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
                                    )}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Features Grid */}
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    Tudo o que precisas para gerir o teu restaurante
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    marginBottom: '60px'
                }}>
                    {[
                        {
                            icon: <Package size={32} />,
                            title: 'Menus Digitais',
                            description: 'Cardápios interativos com QR Code, fotos, alergénios e traduções automáticas'
                        },
                        {
                            icon: <MessageSquare size={32} />,
                            title: 'Chat IA Integrado',
                            description: 'Assistente virtual no cardápio para ajudar clientes e responder perguntas'
                        },
                        {
                            icon: <BarChart3 size={32} />,
                            title: 'Analytics Avançado',
                            description: 'Dashboard completo com vendas, stock, top produtos e insights de negócio'
                        },
                        {
                            icon: <CreditCard size={32} />,
                            title: 'Pagamentos Online',
                            description: 'Integração com sistemas POS e processamento de pagamentos digitais'
                        },
                        {
                            icon: <Users size={32} />,
                            title: 'Gestão de Clientes',
                            description: 'CRM integrado, histórico de pedidos e programas de fidelização'
                        },
                        {
                            icon: <TrendingUp size={32} />,
                            title: 'Relatórios e KPIs',
                            description: 'Métricas em tempo real, previsões de vendas e análise de rentabilidade'
                        }
                    ].map((feature, idx) => (
                        <div key={idx} style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            padding: '30px',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255,107,53,0.1)';
                            e.currentTarget.style.borderColor = '#FF6B35';
                            e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                            <div style={{ color: '#FF6B35', marginBottom: '16px' }}>
                                {feature.icon}
                            </div>
                            <h3 style={{
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                color: 'white',
                                marginBottom: '12px'
                            }}>
                                {feature.title}
                            </h3>
                            <p style={{
                                fontSize: '0.9rem',
                                color: 'rgba(255,255,255,0.6)',
                                lineHeight: '1.6'
                            }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA Final */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(255,140,66,0.1))',
                    border: '2px solid #FF6B35',
                    borderRadius: '24px',
                    padding: '60px 40px',
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        fontWeight: '900',
                        color: 'white',
                        marginBottom: '20px'
                    }}>
                        Pronto para revolucionar o teu restaurante?
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        color: 'rgba(255,255,255,0.7)',
                        marginBottom: '30px',
                        maxWidth: '600px',
                        margin: '0 auto 30px'
                    }}>
                        Junta-te a centenas de restaurantes que já transformaram a sua gestão com o iaMenu PRO
                    </p>
                    <button
                        onClick={handleUpgrade}
                        style={{
                            padding: '20px 60px',
                            fontSize: '1.2rem',
                            fontWeight: '700',
                            background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 10px 40px rgba(255, 107, 53, 0.5)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-3px) scale(1.05)';
                            e.target.style.boxShadow = '0 15px 50px rgba(255, 107, 53, 0.7)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0) scale(1)';
                            e.target.style.boxShadow = '0 10px 40px rgba(255, 107, 53, 0.5)';
                        }}
                    >
                        <Zap size={24} />
                        Começar Teste Grátis
                        <ExternalLink size={20} />
                    </button>
                    <p style={{
                        fontSize: '0.85rem',
                        color: 'rgba(255,255,255,0.5)',
                        marginTop: '20px'
                    }}>
                        ✨ Sem cartão de crédito • 🚀 Configuração em 5 minutos • 💪 Suporte em português
                    </p>
                </div>

                {/* Footer Note */}
                <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.85rem'
                }}>
                    <p>
                        🌟 O Ecosystem continuará gratuito durante 30 dias.<br />
                        Depois, escolhe entre continuar na comunidade ou fazer upgrade para o iaMenu PRO.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UpgradePROView;
