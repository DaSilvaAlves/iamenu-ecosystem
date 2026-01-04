import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, TrendingUp, Clock } from 'lucide-react';

const PAIN_CATEGORIES = ['Margem', 'Staff', 'Clientes', 'Delivery', 'Tech'];
const IMPACT_LEVELS = [
    { value: 'LOW', label: 'Baixo', color: 'green' },
    { value: 'MEDIUM', label: 'Médio', color: 'yellow' },
    { value: 'HIGH', label: 'Alto', color: 'red' },
];

const HubFeedback = ({ hub }) => {
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Margem');
    const [impact, setImpact] = useState('MEDIUM');
    const [isExpanding, setIsExpanding] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleExpand = async () => {
        if (!description.trim()) return;
        setIsExpanding(true);

        // Simulate AI expansion
        setTimeout(() => {
            const expanded = `${description}\n\nContexto adicional: Esta dor afeta diretamente a operação diária do restaurante, impactando a rentabilidade e a experiência do cliente. Seria valioso ter uma solução integrada no iaMenu que permita monitorizar e otimizar este aspecto.`;
            setDescription(expanded);
            setIsExpanding(false);
        }, 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setDescription('');
        }, 3000);
    };

    const getImpactColor = (impactValue) => {
        const colors = {
            green: 'bg-green-500/10 border-green-500 text-green-400',
            yellow: 'bg-yellow-500/10 border-yellow-500 text-yellow-400',
            red: 'bg-red-500/10 border-red-500 text-red-400',
        };
        const level = IMPACT_LEVELS.find(l => l.value === impactValue);
        return colors[level?.color] || colors.yellow;
    };

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="glass-panel p-8 rounded-[30px] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="material-symbols-outlined text-primary text-3xl">campaign</span>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                            Dores da Região
                        </h2>
                    </div>
                    <p className="text-white/60 text-sm mb-4 max-w-2xl">
                        A sua opinião alimenta diretamente o Roadmap do iaMenu. Partilhe os desafios que enfrenta na sua região
                        e ajude-nos a criar soluções que fazem a diferença.
                    </p>
                    <div className="flex items-center gap-2 bg-white/5 border border-primary/20 px-4 py-2 rounded-2xl w-fit">
                        <Sparkles size={16} className="text-primary" />
                        <span className="text-white text-xs font-bold">AI Assistant disponível</span>
                    </div>
                </div>
            </div>

            {/* Feedback Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glass-panel p-8 rounded-[30px] space-y-6">
                    {/* Category Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-white/60">
                            Categoria do Problema
                        </label>
                        <div className="grid grid-cols-5 gap-3">
                            {PAIN_CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    className={`py-3 px-4 rounded-2xl text-sm font-black uppercase border transition-all ${
                                        category === cat
                                            ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20'
                                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white/60'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Impact Level */}
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-white/60">
                            Impacto no Negócio
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {IMPACT_LEVELS.map((level) => (
                                <button
                                    key={level.value}
                                    type="button"
                                    onClick={() => setImpact(level.value)}
                                    className={`py-3 rounded-2xl text-sm font-black uppercase border transition-all ${
                                        impact === level.value
                                            ? getImpactColor(level.value) + ' shadow-lg'
                                            : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                                    }`}
                                >
                                    {level.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-black uppercase tracking-widest text-white/60">
                                Descrição Detalhada
                            </label>
                            <button
                                type="button"
                                onClick={handleExpand}
                                disabled={isExpanding || !description}
                                className="text-xs font-black text-primary flex items-center gap-2 hover:underline disabled:opacity-50 uppercase"
                            >
                                {isExpanding ? (
                                    <>
                                        <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                                        Melhorando...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={14} />
                                        Melhorar com AI
                                    </>
                                )}
                            </button>
                        </div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/30 min-h-[180px] focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                            placeholder="Descreva aqui a dor que está a sentir no seu negócio..."
                        ></textarea>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!description.trim()}
                    className="w-full glass-panel py-6 rounded-[30px] bg-primary hover:bg-primary/90 text-white font-black text-lg uppercase tracking-wider shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {isSubmitted ? (
                        <>
                            <span className="material-symbols-outlined">check_circle</span>
                            Enviado com Sucesso!
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            Enviar para a Equipa
                        </>
                    )}
                </button>
            </form>

            {/* Stats Preview */}
            <div className="glass-panel p-8 rounded-[30px] bg-primary/5 border-primary/20">
                <h4 className="text-sm font-black text-primary mb-4 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp size={16} />
                    Impacto na Comunidade
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                        <div className="text-3xl font-black text-primary mb-1">85%</div>
                        <div className="text-xs font-bold text-white/40 uppercase tracking-wider">Dores Similares</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                        <div className="text-3xl font-black text-primary mb-1">12h</div>
                        <div className="text-xs font-bold text-white/40 uppercase tracking-wider">Tempo Resposta</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HubFeedback;
