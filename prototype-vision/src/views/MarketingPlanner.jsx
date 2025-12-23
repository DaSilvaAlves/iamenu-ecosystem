import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Image as ImageIcon,
    Sparkles,
    Send,
    Share2,
    Instagram,
    Target,
    ChefHat,
    Utensils,
    Zap,
    AlertCircle,
    Download,
    RefreshCcw,
    X,
    Clock,
    TrendingUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateMarketingPlan } from '../utils/GeminiService';

const MarketingPlanner = () => {
    const [showFullPlanner, setShowFullPlanner] = useState(false);
    const [step, setStep] = useState('briefing'); // 'briefing', 'loading', 'result'
    const [formData, setFormData] = useState({
        name: '',
        cuisine: '',
        uniquePoint: '',
        challenge: '',
        targetAudience: '',
        apiKey: localStorage.getItem('gemini_api_key') || ''
    });
    const [plan, setPlan] = useState('');
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'apiKey') localStorage.setItem('gemini_api_key', value);
    };

    const handleGenerate = async () => {
        if (!formData.name || !formData.cuisine || !formData.apiKey) {
            setError("Por favor, preencha pelo menos o Nome, Cozinha e API Key.");
            return;
        }

        setStep('loading');
        setError(null);
        try {
            const result = await generateMarketingPlan(formData);
            setPlan(result);
            setStep('result');
        } catch (err) {
            setError(err.message);
            setStep('briefing');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
        >
            {/* Header - Restaurado o botão original com upgrade */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Marketing Planner AI</h2>
                    <p className="text-white/40 font-bold text-sm tracking-wide">Gastro-Marketing automatizado para o teu restaurante.</p>
                </div>
                {!showFullPlanner ? (
                    <button
                        onClick={() => setShowFullPlanner(true)}
                        className="bg-primary text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20 uppercase italic tracking-tighter"
                    >
                        <Sparkles size={20} /> Gerar Plano Estratégico 30 Dias
                    </button>
                ) : (
                    <button
                        onClick={() => setShowFullPlanner(false)}
                        className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 text-white/40 transition-all border border-white/10 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                    >
                        <X size={16} /> Fechar Gerador
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {!showFullPlanner ? (
                    /* VIEW 1: O DASHBOARD ORIGINAL (O QUE O EURICO QUER MANTER) */
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        <div className="lg:col-span-2 space-y-8">
                            {/* Card: Sugestão da IA para o Almoço */}
                            <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/[0.01]">
                                <h3 className="text-xl font-bold text-white mb-6">Sugestão da IA para o Almoço</h3>

                                <div className="bg-white/[0.02] rounded-3xl border border-white/10 p-8 mb-8">
                                    <p className="italic text-white/90 leading-relaxed text-lg mb-6">
                                        "Procuras o refúgio perfeito para o teu almoço de terça-feira? 🍽️ Hoje o nosso Bacalhau à Lagareiro está a sair fumegante e dourado! Com o azeite regional e as batatas a murro perfeitas. Reserva já a tua mesa e deixa o resto connosco. #iaMenu #GastronomiaPortuguesa #AlmoçoPerfeito"
                                    </p>
                                    <div className="flex gap-3">
                                        <span className="text-xs font-black text-primary uppercase tracking-widest">#Restaurante</span>
                                        <span className="text-xs font-black text-white/20 uppercase tracking-widest">#Tradicao</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button className="flex-1 bg-white/5 py-4 rounded-2xl text-white/60 font-bold hover:bg-white/10 transition-all">Refazer Texto</button>
                                    <button className="flex-1 bg-white/5 py-4 rounded-2xl text-white/60 font-bold hover:bg-white/10 transition-all">Trocar Imagem</button>
                                    <button className="flex-[1.5] bg-primary py-4 rounded-2xl text-white font-black hover:scale-102 transition-all shadow-lg shadow-primary/20">Agendar no Facebook/IG</button>
                                </div>
                            </div>

                            {/* Card: Calendário Editorial */}
                            <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/[0.01]">
                                <h3 className="text-xl font-bold text-white mb-6 font-black uppercase italic tracking-tighter">Calendário Editorial</h3>
                                <div className="grid grid-cols-7 gap-4">
                                    {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => (
                                        <div key={i} className={`text-center p-4 rounded-3xl border transition-all ${i === 1 ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5' : 'bg-white/[0.02] border-white/5'}`}>
                                            <p className={`text-[10px] font-black mb-2 ${i === 1 ? 'text-primary' : 'text-white/20'}`}>{day}</p>
                                            <p className={`text-xl font-black ${i === 1 ? 'text-white' : 'text-white/40'}`}>{23 + i}</p>
                                            {i < 3 && <div className="w-1.5 h-1.5 bg-primary rounded-full mx-auto mt-2 animate-pulse"></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Card: Instagram Preview */}
                            <div className="glass-panel p-8 rounded-[40px] border border-white/5">
                                <h4 className="font-black text-white uppercase italic mb-6 flex items-center gap-3">
                                    <Instagram size={20} className="text-pink-500" /> Instagram Preview
                                </h4>
                                <div className="w-full aspect-square rounded-3xl bg-neutral-900 border border-white/5 mb-6 overflow-hidden ring-1 ring-white/10">
                                    <img
                                        src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=2069"
                                        className="w-full h-full object-cover"
                                        alt="Dish"
                                    />
                                </div>
                                <div className="flex gap-4 mb-4">
                                    <Share2 size={20} className="text-white/40 cursor-pointer hover:text-white transition-colors" />
                                    <Send size={20} className="text-white/40 cursor-pointer hover:text-white transition-colors" />
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-xs text-white/80 leading-relaxed">
                                        <span className="font-extrabold text-white mr-2">O Cantinho do Eurico</span>
                                        Procuras o refúgio perfeito para o teu almoço de terça-feira? 🍽️ Hoje o nosso Bacalhau...
                                    </p>
                                </div>
                            </div>

                            {/* Card: Métricas Recomendadas */}
                            <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-primary/5">
                                <h4 className="font-black text-white uppercase italic mb-6 text-sm tracking-widest">Métricas Recomendadas</h4>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center group cursor-help">
                                        <div className="flex items-center gap-3">
                                            <Clock size={16} className="text-white/20" />
                                            <span className="text-xs font-bold text-white/40 uppercase">Horário Ideal:</span>
                                        </div>
                                        <span className="text-sm font-black text-white">11:30 - 12:15</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Target size={16} className="text-white/20" />
                                            <span className="text-xs font-bold text-white/40 uppercase">Audiência Alvo:</span>
                                        </div>
                                        <span className="text-sm font-black text-white">Trabalhadores Locais</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <TrendingUp size={16} className="text-white/20" />
                                            <span className="text-xs font-bold text-white/40 uppercase">Engajamento:</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-success uppercase">Alto</span>
                                            <div className="flex gap-0.5">
                                                <div className="w-1 h-3 bg-success rounded-full"></div>
                                                <div className="w-1 h-3 bg-success rounded-full"></div>
                                                <div className="w-1 h-3 bg-success rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* VIEW 2: O MOTOR DE IA (O "UPGRADE") */
                    <motion.div
                        key="full-planner"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                    >
                        {step === 'briefing' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 glass-panel p-8 rounded-[40px] border border-white/5 space-y-6 bg-white/[0.01]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Target size={24} /></div>
                                        <h3 className="text-xl font-bold text-white uppercase italic">Briefing Estratégico do Conselho</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-2">Nome do Restaurante</label>
                                            <input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/10 outline-none focus:border-primary/50 transition-all"
                                                placeholder="Ex: O Cantinho do Eurico"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-2">Tipo de Cozinha</label>
                                            <input
                                                name="cuisine"
                                                value={formData.cuisine}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/10 outline-none focus:border-primary/50 transition-all"
                                                placeholder="Ex: Portuguesa Regional"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-2">O Que Vos Torna Notáveis? (Vaca Roxa)</label>
                                        <textarea
                                            name="uniquePoint"
                                            value={formData.uniquePoint}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/10 outline-none focus:border-primary/50 transition-all resize-none"
                                            placeholder="Ex: Receita de família com 50 anos, azeite de produção própria..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-2">Público Alvo</label>
                                            <input
                                                name="targetAudience"
                                                value={formData.targetAudience}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/10 outline-none focus:border-primary/50 transition-all"
                                                placeholder="Ex: Famílias e Turistas"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-2">Maior Desafio</label>
                                            <input
                                                name="challenge"
                                                value={formData.challenge}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/10 outline-none focus:border-primary/50 transition-all"
                                                placeholder="Ex: Pouco movimento ao jantar"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-2">Google Gemini API Key</label>
                                            <input
                                                name="apiKey"
                                                type="password"
                                                value={formData.apiKey}
                                                onChange={handleInputChange}
                                                className="w-full bg-primary/5 border border-primary/20 rounded-2xl px-6 py-4 text-white placeholder-white/20 outline-none focus:border-primary transition-all font-mono"
                                                placeholder="Cole aqui a sua chave de API..."
                                            />
                                        </div>
                                        {error && (
                                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-black uppercase">
                                                <AlertCircle size={16} /> {error}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleGenerate}
                                        className="w-full bg-primary text-black font-black py-6 rounded-3xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 uppercase italic tracking-tighter"
                                    >
                                        <Sparkles size={24} /> Gerar Plano Estratégico Lendário
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-primary/5">
                                        <h4 className="text-xl font-black text-white uppercase italic mb-6">Mestres Consultores</h4>
                                        <div className="space-y-4">
                                            {[
                                                { name: 'Gordon Ramsay', role: 'Visual & Sensory', icon: ChefHat },
                                                { name: 'Seth Godin', role: 'Remarkable Story', icon: Target },
                                                { name: 'Alex Hormozi', role: 'Grand Slam Offer', icon: Utensils },
                                                { name: 'Gary Vee', role: 'Attention Strategy', icon: Zap }
                                            ].map(x => (
                                                <div key={x.name} className="flex gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40"><x.icon size={20} /></div>
                                                    <div>
                                                        <p className="text-sm font-black text-white">{x.name}</p>
                                                        <p className="text-[10px] text-white/30 uppercase font-bold">{x.role}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'loading' && (
                            <div className="glass-panel p-20 rounded-[40px] text-center space-y-8 bg-white/[0.01]">
                                <div className="relative w-32 h-32 mx-auto">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-primary/20 border-l-transparent rounded-full"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ChefHat className="text-primary animate-bounce" size={40} />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">O Conselho está a reunir...</h3>
                                <p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.4em]">Analisando o DNA do teu Restaurante.</p>
                            </div>
                        )}

                        {step === 'result' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 glass-panel p-10 rounded-[40px] border border-white/10 bg-white/[0.01] prose prose-invert prose-p:text-white/80 prose-headings:text-white prose-strong:text-primary max-w-none">
                                    <div className="flex justify-between items-center mb-8 pb-8 border-b border-white/5">
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="text-primary" size={24} />
                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Plano Gerado com IA</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white/40"><Download size={18} /></button>
                                            <button
                                                onClick={() => setStep('briefing')}
                                                className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white/40"
                                            ><RefreshCcw size={18} /></button>
                                        </div>
                                    </div>
                                    <ReactMarkdown className="marketing-plan-rendered">
                                        {plan}
                                    </ReactMarkdown>
                                </div>

                                <div className="space-y-8">
                                    <div className="glass-panel p-8 rounded-[40px] border border-white/5">
                                        <h4 className="font-black text-white uppercase italic mb-6 flex items-center gap-3">
                                            <Instagram size={20} className="text-pink-500" /> Live Preview (Upgrade)
                                        </h4>
                                        <div className="w-full aspect-square rounded-3xl bg-neutral-900 border border-white/5 mb-6 overflow-hidden ring-1 ring-white/10">
                                            <img
                                                src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=2069"
                                                className="w-full h-full object-cover"
                                                alt="Dish"
                                            />
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                            <p className="text-xs text-white/80 leading-relaxed italic">
                                                <span className="font-extrabold text-white mr-2">{formData.name || 'Restaurante'}</span>
                                                {plan.substring(0, 100)}...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MarketingPlanner;
