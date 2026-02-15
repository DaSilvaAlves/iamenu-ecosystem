import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, PenTool, Hash, Target, Mail, Share2, Eye, Zap, RefreshCw, BarChart3, Send, HelpCircle, CheckCircle2, Clock } from 'lucide-react';

const CopyStudioView = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [results, setResults] = useState({});

    const tools = [
        { id: 'headline', title: 'Headline Impactante', desc: 'Gerar títulos que convertem', icon: Hash, color: 'text-blue-400' },
        { id: 'cta', title: 'Call-to-Action', desc: 'Botões e CTAs irresistíveis', icon: Target, color: 'text-red-400' },
        { id: 'desc', title: 'Descrição Produto', desc: 'Copy para descrever produto', icon: PenTool, color: 'text-purple-400' },
        { id: 'email', title: 'Email Campaign', desc: 'Email marketing com conversão', icon: Mail, color: 'text-yellow-400' },
        { id: 'social', title: 'Social Media', desc: 'Posts para redes sociais', icon: Share2, color: 'text-pink-400' },
    ];

    const stats = [
        { label: 'Stories Pendentes', value: 12 },
        { label: 'Em Desenvolvimento', value: 3 },
        { label: 'Aguardando Review', value: 5 },
        { label: 'Concluídas', value: 8 },
    ];

    const handleAction = (id) => {
        // Simulação de geração via IA
        const mockResults = {
            headline: "### Headlines Sugeridas:\n1. 'iaMenu: O Futuro da Restauração'\n2. 'Dobre os seus lucros com IA'\n3. 'Gestão sem stress: Conheça o ecossistema'",
            cta: "### CTAs Recomendadas:\n- 'Começar Agora Gratuitamente'\n- 'Ver Demonstração ao Vivo'\n- 'Quero Escalar o Meu Restaurante'",
        };
        setResults({ ...results, [id]: mockResults[id] || "Resultado gerado com sucesso pela IA do Copywriter Squad." });
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <header className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <PenTool className="text-primary" size={32} />
                    </div>
                    AIOS Copy Studio
                </h1>
                <p className="text-white/40 font-medium tracking-wide">
                    Interface Visual Integrada • <span className="text-primary/60">Copywriter Squad Active</span>
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Painel de Criação */}
                <div className="lg:col-span-8 space-y-6">
                    <section className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/[0.02]">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <Zap size={20} className="text-primary" />
                            Ferramentas de Criação
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tools.map((tool) => (
                                <motion.button
                                    key={tool.id}
                                    whileHover={{ x: 5 }}
                                    onClick={() => setActiveModal(tool.id)}
                                    className="flex items-start gap-4 p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-primary/20 transition-all text-left"
                                >
                                    <div className={`p-3 rounded-2xl bg-white/5 ${tool.color}`}>
                                        <tool.icon size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{tool.title}</div>
                                        <div className="text-sm text-white/40">{tool.desc}</div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Painel Lateral */}
                <div className="lg:col-span-4 space-y-6">
                    <section className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/[0.02]">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                            <BarChart3 size={20} className="text-primary" />
                            Status do Projeto
                        </h2>
                        <div className="space-y-4">
                            {stats.map((stat) => (
                                <div key={stat.label} className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <span className="text-white/40 text-sm font-medium">{stat.label}</span>
                                    <span className="text-white font-bold">{stat.value}</span>
                                </div>
                            ))}
                            <div className="pt-4 border-top border-white/5">
                                <span className="px-4 py-2 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Clock size={14} />
                                    Projeto em Andamento
                                </span>
                            </div>
                        </div>
                    </section>

                    <button className="w-full p-6 rounded-[30px] bg-primary text-black font-black uppercase tracking-tighter italic flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-primary/20">
                        <Send size={20} />
                        Enviar para Aprovação
                    </button>
                </div>
            </div>

            {/* Modal Simulado */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-panel w-full max-w-xl p-8 rounded-[40px] border border-white/10 bg-[#121212] shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                                    {tools.find(t => t.id === activeModal)?.title}
                                </h3>
                                <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <Layout className="text-white/40 rotate-45" size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Tópico ou Produto</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Novo menu digital para a Comunidade..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>

                                <button
                                    onClick={() => handleAction(activeModal)}
                                    className="w-full p-5 bg-white text-black font-black uppercase tracking-tighter italic rounded-2xl hover:bg-primary transition-colors flex items-center justify-center gap-2"
                                >
                                    Gerar Conteúdo com IA
                                    <Zap size={18} />
                                </button>

                                {results[activeModal] && (
                                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                                        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                                            <CheckCircle2 size={16} />
                                            Resultado Sugerido
                                        </div>
                                        <div className="text-white/80 whitespace-pre-wrap leading-relaxed font-medium">
                                            {results[activeModal]}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CopyStudioView;
