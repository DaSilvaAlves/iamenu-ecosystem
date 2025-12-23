import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle, Clock, ChevronDown, BookOpen, Award } from 'lucide-react';

const LessonItem = ({ title, duration, completed }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        cursor: 'pointer'
    }} className="hover:bg-white/5 group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {completed ? (
                <CheckCircle size={20} color="var(--success)" />
            ) : (
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }}></div>
            )}
            <span style={{ fontSize: '0.9rem', color: completed ? 'var(--text-muted)' : 'white' }}>{title}</span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{duration}</span>
    </div>
);

const Academy = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={18} color="var(--primary)" />
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>Curso em Destaque</span>
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>🚀 iaMenu Fundamentals: O Futuro do teu Restaurante</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Progresso Total</p>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>45%</h3>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <span>2 seções • 8 lições • 2h 15min</span>
                        <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}>Recolher todas as seções</span>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <ChevronDown size={18} />
                                <span style={{ fontWeight: '600' }}>Módulo 1: Setup e Visão Estratégica</span>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>5 lições • 1h 20min</span>
                        </div>
                        <div style={{ backgroundColor: '#0a0a0a' }}>
                            <LessonItem title="Aula 1 - Bem-vindo ao Ecossistema" duration="05:12" completed={true} />
                            <LessonItem title="Aula 2 - Configurar o teu Menu Digital Premium" duration="15:30" completed={true} />
                            <LessonItem title="Aula 3 - Estratégia de Preços e ROI" duration="22:45" completed={false} />
                            <LessonItem title="Aula 4 - Integrar com Zone Soft e POS" duration="18:20" completed={false} />
                            <LessonItem title="Aula 5 - Criar a tua primeira Ficha Técnica" duration="35:00" completed={false} />
                        </div>

                        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <ChevronDown size={18} color="var(--text-muted)" />
                                <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Módulo 2: Marketing Planner e IA</span>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>3 lições • 55min</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Sobre este curso</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
                            Aprende a dominar todas as ferramentas do iaMenu para maximizar a rentabilidade do teu negócio. Ideal para donos e gerentes de restaurantes.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                                <Clock size={16} color="var(--primary)" /> 2h 15min de conteúdo
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                                <PlayCircle size={16} color="var(--primary)" /> Acesso vitalício
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                                <Award size={16} color="var(--primary)" /> Certificado incluído
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <h4 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Instrutor</h4>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👨‍🍳</div>
                            <div>
                                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Eurico Alves</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Especialista em iaMenu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Academy;
