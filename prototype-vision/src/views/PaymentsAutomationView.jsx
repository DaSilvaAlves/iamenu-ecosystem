import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShoppingCart, Send, CheckCircle, Smartphone, Globe, ArrowRight, Zap } from 'lucide-react';

const PaymentsAutomationView = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard size={18} color="var(--primary)" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Faturação & Eficiência</span>
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Pagamentos Integrados & Automação</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Do clique do cliente ao sistema do restaurante, em segundos.</p>
                </div>
                <div style={{
                    backgroundColor: 'rgba(255, 77, 0, 0.1)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid var(--primary)',
                    color: 'var(--primary)',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                }}>
                    Funcionalidade PRO (Piloto)
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Step 1: Integrated Payments */}
                <div className="glass-panel" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Smartphone size={24} color="var(--primary)" /> Smart Checkout
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                        O cliente paga diretamente no seu smartphone. Sem esperas pela conta, sem erros de terminal.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { name: 'MB Way', status: 'Ativo', icon: '📱' },
                            { name: 'Multibanco (Referência/Entidade)', status: 'Ativo', icon: '🏧' },
                            { name: 'Stripe (Cartão de Crédito/Apple Pay)', status: 'Q1 2026', icon: '💳' }
                        ].map(method => (
                            <div key={method.name} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px',
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                borderRadius: '12px',
                                border: '1px solid var(--border)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{method.icon}</span>
                                    <span style={{ fontWeight: '600' }}>{method.name}</span>
                                </div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: method.status === 'Ativo' ? 'var(--success)' : 'var(--warning)',
                                    fontWeight: 'bold'
                                }}>
                                    {method.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step 2: Automation Flow */}
                <div className="glass-panel" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Zap size={24} color="var(--primary)" /> Fluxo de Pedidos Nativo
                    </h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                        Os pedidos do iaMenu entram diretamente no sistema de gestão do restaurante.
                    </p>

                    <div style={{ position: 'relative', padding: '10px 0' }}>
                        {[
                            { step: 'Cliente faz pedido no iaMenu', icon: Globe },
                            { step: 'Validação automática da mesa', icon: CheckCircle },
                            { step: 'Envio direto para o Sistema POS', icon: Send },
                            { step: 'Impressão imediata na cozinha', icon: ShoppingCart }
                        ].map((item, i, arr) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: i === arr.length - 1 ? 0 : '24px' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    zIndex: 2
                                }}>
                                    <item.icon size={16} />
                                </div>
                                <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>{item.step}</span>
                                {i < arr.length - 1 && (
                                    <div style={{
                                        position: 'absolute',
                                        left: '15px',
                                        top: `${32 + i * 56}px`,
                                        width: '2px',
                                        height: '24px',
                                        backgroundColor: 'rgba(255, 77, 0, 0.2)'
                                    }}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '16px' }}>Impacto Operacional (iaMenu.pt Piloto)</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', marginTop: '20px' }}>
                    <div>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>-40%</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Carga de trabalho no staff de sala</p>
                    </div>
                    <div style={{ width: '1px', backgroundColor: 'var(--border)' }}></div>
                    <div>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>0</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Erros de registo no sistema de caixa</p>
                    </div>
                    <div style={{ width: '1px', backgroundColor: 'var(--border)' }}></div>
                    <div>
                        <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>+15%</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rotação de mesas nos picos</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PaymentsAutomationView;
