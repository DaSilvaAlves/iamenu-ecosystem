import { Check, Smartphone, DollarSign, Clock, TrendingUp, ExternalLink } from 'lucide-react';

const TakewayLandingView = () => {
    const handleActivateTakeway = () => {
        window.open('https://iamenu-takeway.vercel.app/', '_blank');
    };

    const benefits = [
        { icon: DollarSign, title: 'Sem Comissões', description: 'Zero percentagem por pedido. Modelo SaaS fixo mensal.' },
        { icon: Smartphone, title: 'White-Label', description: 'Marca própria do restaurante. Cliente sente que compra diretamente a ti.' },
        { icon: Clock, title: 'Rápido Setup', description: 'Configuração guiada. Pronto para receber pedidos em 48-72h.' },
        { icon: TrendingUp, title: 'Mais Controlo', description: 'Dados dos clientes, histórico de pedidos e gestão nas tuas mãos.' }
    ];

    const features = [
        'Pedidos Take-Away e Delivery Direto',
        'Pagamentos MB Way e Cartão integrados',
        'Gestão de Menu completa',
        'Horários e Zonas de Entrega configuráveis',
        'Notificações automáticas para clientes',
        'Painel de Insights em tempo real',
        'Links para Site, Instagram, Google Business',
        'QR Codes para embalagens'
    ];

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
                        📦 Produto Separado
                    </div>

                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #ffffff, #ff4d00)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '20px',
                        lineHeight: '1.2'
                    }}>
                        iaMenu Takeway
                    </h1>

                    <p style={{
                        fontSize: '1.3rem',
                        color: 'rgba(255,255,255,0.7)',
                        maxWidth: '700px',
                        margin: '0 auto 30px',
                        lineHeight: '1.6'
                    }}>
                        O teu canal de pedidos online direto, com a tua marca, <strong style={{ color: '#ff4d00' }}>sem comissões</strong>
                    </p>

                    <button
                        onClick={handleActivateTakeway}
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
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 107, 53, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 107, 53, 0.4)';
                        }}
                    >
                        <ExternalLink size={20} />
                        Ativar iaMenu Takeway
                    </button>

                    <p style={{
                        fontSize: '0.9rem',
                        color: 'rgba(255,255,255,0.4)',
                        marginTop: '15px'
                    }}>
                        Produto independente do iaMenu PRO
                    </p>
                </div>

                {/* Problema vs Solução */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '40px',
                    marginBottom: '50px'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div>
                            <h3 style={{ color: '#EF4444', fontSize: '1.3rem', marginBottom: '15px', fontWeight: '700' }}>
                                ❌ O Problema
                            </h3>
                            <ul style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '2' }}>
                                <li>Pagas 20-30% de comissão em Uber Eats/Glovo/Bolt</li>
                                <li>Não tens canal próprio eficiente para pedidos online</li>
                                <li>Dependes de telefone e WhatsApp desorganizado</li>
                                <li>Perdes controlo sobre dados dos clientes</li>
                            </ul>
                        </div>
                        <div>
                            <h3 style={{ color: '#ff4d00', fontSize: '1.3rem', marginBottom: '15px', fontWeight: '700' }}>
                                ✅ A Solução
                            </h3>
                            <ul style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '2' }}>
                                <li>Preço fixo mensal, sem percentagem por pedido</li>
                                <li>Sistema profissional de pedidos com tua marca</li>
                                <li>Gestão centralizada e automática</li>
                                <li>Todos os dados de clientes nas tuas mãos</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '25px',
                    marginBottom: '50px'
                }}>
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '15px',
                                padding: '30px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255, 77, 0, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255, 77, 0, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            }}
                        >
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '15px'
                            }}>
                                <benefit.icon size={24} color="white" />
                            </div>
                            <h3 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '8px', fontWeight: '600' }}>
                                {benefit.title}
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Features List */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '40px',
                    marginBottom: '50px'
                }}>
                    <h2 style={{
                        color: 'white',
                        fontSize: '2rem',
                        marginBottom: '30px',
                        fontWeight: '700',
                        textAlign: 'center'
                    }}>
                        Tudo o que precisas para começar
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '15px'
                    }}>
                        {features.map((feature, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #FF6B35, #FF8C42)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Check size={14} color="white" />
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                                    {feature}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pricing */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 77, 0, 0.1), rgba(255, 107, 53, 0.05))',
                    border: '2px solid rgba(255, 77, 0, 0.3)',
                    borderRadius: '20px',
                    padding: '50px',
                    textAlign: 'center',
                    marginBottom: '50px'
                }}>
                    <h2 style={{
                        color: 'white',
                        fontSize: '2.5rem',
                        marginBottom: '15px',
                        fontWeight: '800'
                    }}>
                        Sem comissões. Sem surpresas.
                    </h2>
                    <p style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '1.2rem',
                        marginBottom: '30px',
                        maxWidth: '600px',
                        margin: '0 auto 30px'
                    }}>
                        Modelo de preço fixo mensal. Cada pedido que recebes, o lucro é 100% teu.
                    </p>
                    <button
                        onClick={handleActivateTakeway}
                        style={{
                            padding: '18px 60px',
                            fontSize: '1.2rem',
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
                            gap: '12px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 107, 53, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 107, 53, 0.4)';
                        }}
                    >
                        <ExternalLink size={24} />
                        Começar Agora
                    </button>
                </div>

                {/* FAQ / Info */}
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '15px',
                    padding: '30px',
                    textAlign: 'center'
                }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>
                        <strong style={{ color: '#ff4d00' }}>Importante:</strong> O iaMenu Takeway é um produto <strong>independente</strong> do iaMenu PRO.{' '}
                        Podes usá-lo sozinho ou integrá-lo opcionalmente com o iaMenu Ecosystem via API no futuro.{' '}
                        <br />
                        Ideal para restaurantes focados em take-away e delivery que ainda não precisam de um ecossistema completo de gestão.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TakewayLandingView;
