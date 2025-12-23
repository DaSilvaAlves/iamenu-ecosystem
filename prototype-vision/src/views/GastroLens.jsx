import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera,
    Upload,
    Sparkles,
    ChefHat,
    AlertTriangle,
    CheckCircle2,
    X,
    Utensils,
    Info,
    ArrowRight,
    Search,
    Brain,
    Image as ImageIcon
} from 'lucide-react';
import { generateDishAnalysis, enhanceFoodImage } from '../utils/GeminiService';

const GastroLens = () => {
    // 1. ESTADOS
    const [status, setStatus] = useState('IDLE'); // IDLE, PROCESSING, SUCCESS, ERROR
    const [originalImage, setOriginalImage] = useState(null);
    const [enhancedImage, setEnhancedImage] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const [dishName, setDishName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [apiKey, setApiKey] = useState(localStorage.getItem('iaMenu_Gemini_Key') || '');

    const fileInputRef = useRef(null);

    // 2. HANDLERS
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result);
                setEnhancedImage(null);
                setAnalysis(null);
                setStatus('IDLE');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProcess = async () => {
        if (!originalImage || !dishName) return;

        if (!apiKey) {
            setError("Por favor, insira a sua Gemini API Key.");
            setStatus('ERROR');
            return;
        }

        setStatus('PROCESSING');
        setError(null);
        localStorage.setItem('iaMenu_Gemini_Key', apiKey);

        try {
            const base64Data = originalImage.split(',')[1];
            const mimeType = originalImage.split(';')[0].split(':')[1];

            // Executar em paralelo
            const [enhancedImg, result] = await Promise.all([
                enhanceFoodImage(apiKey, base64Data, mimeType),
                generateDishAnalysis(apiKey, base64Data, mimeType, dishName, ingredients)
            ]);

            setEnhancedImage(`data:${mimeType};base64,${enhancedImg}`);
            setAnalysis(result);
            setStatus('SUCCESS');
        } catch (err) {
            console.error(err);
            setError("Falha ao processar a imagem. Verifica a tua API Key e tenta de novo.");
            setStatus('ERROR');
        }
    };

    const reset = () => {
        setStatus('IDLE');
        setOriginalImage(null);
        setEnhancedImage(null);
        setAnalysis(null);
        setDishName('');
        setIngredients('');
        setError(null);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 glass-effect rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden bg-white/[0.02]">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] -z-10" />
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/20 rounded-xl">
                            <Camera className="text-primary w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">GastroLens AI Scanner</h1>
                    </div>
                    <p className="text-white/40 font-bold text-sm tracking-wide">Transforma fotos brutas em obras de arte e descrições técnicas.</p>
                </div>

                {status === 'SUCCESS' && (
                    <button onClick={reset} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/10">
                        Novo Scan
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {status === 'IDLE' || status === 'ERROR' ? (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        {/* Formulário */}
                        <div className="glass-panel p-8 rounded-[40px] border border-white/5 space-y-6">
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                                <Brain className="text-primary" size={20} /> Briefing do Prato
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-2">Nome do Prato (Obrigatório)</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Polvo à Lagareiro iaMenu"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/10 outline-none focus:border-primary/50 transition-all font-bold"
                                        value={dishName}
                                        onChange={e => setDishName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-2">Ingredientes Principais (Opcional)</label>
                                    <textarea
                                        placeholder="Ex: Polvo, batata a murro, azeite extra virgem, alho, louro..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/10 outline-none focus:border-primary/50 transition-all min-h-[120px] font-medium text-sm leading-relaxed"
                                        value={ingredients}
                                        onChange={e => setIngredients(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-2">Gemini API Key</label>
                                    <input
                                        type="password"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white/40 font-mono text-xs outline-none focus:border-primary/50 transition-all font-bold"
                                        value={apiKey}
                                        onChange={e => setApiKey(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                                    <AlertTriangle className="text-red-500 shrink-0" size={18} />
                                    <p className="text-xs text-red-400 font-bold leading-relaxed">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handleProcess}
                                disabled={!originalImage || !dishName}
                                className={`w-full py-5 rounded-[24px] font-black uppercase italic tracking-tighter flex items-center justify-center gap-3 transition-all shadow-2xl ${originalImage && dishName
                                        ? 'bg-primary text-black shadow-primary/20 hover:scale-[1.02]'
                                        : 'bg-white/5 text-white/10 cursor-not-allowed'
                                    }`}
                            >
                                <Sparkles size={20} /> Transformar Menu
                            </button>
                        </div>

                        {/* Upload de Imagem */}
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className={`relative rounded-[40px] border-2 border-dashed transition-all cursor-pointer group flex flex-col items-center justify-center p-12 overflow-hidden ${originalImage ? 'border-primary/30' : 'border-white/10 hover:border-white/20'
                                }`}
                        >
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />

                            {originalImage ? (
                                <>
                                    <img src={originalImage} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Preview" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                    <div className="relative z-10 text-center">
                                        <div className="w-16 h-16 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                                            <Upload className="text-primary" size={24} />
                                        </div>
                                        <p className="text-white font-black uppercase tracking-widest text-xs">Alterar Fotografia</p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center space-y-6">
                                    <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto border border-white/10 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="text-white/20" size={40} />
                                    </div>
                                    <div>
                                        <p className="text-white text-lg font-black italic uppercase tracking-tighter">Largue a sua foto aqui</p>
                                        <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Formatos aceites: JPG, PNG, WEBP</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : status === 'PROCESSING' ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-20 flex flex-col items-center text-center space-y-8"
                    >
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white/5" />
                            <div className="absolute inset-0 w-32 h-32 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ChefHat className="text-primary animate-bounce" size={40} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">O Chef está a trabalhar...</h2>
                            <p className="text-white/40 font-bold max-w-md mx-auto leading-relaxed">
                                Estamos a analisar cada pixel, a melhorar a iluminação e a redigir a descrição perfeita para o teu menu.
                            </p>
                            <div className="flex justify-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary/20 animate-pulse delay-75"></span>
                                <span className="w-2 h-2 rounded-full bg-primary/20 animate-pulse delay-150"></span>
                                <span className="w-2 h-2 rounded-full bg-primary/20 animate-pulse delay-300"></span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-12"
                    >
                        {/* Comparação de Imagem */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[500px]">
                            <div className="relative group rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
                                <img src={originalImage} className="w-full h-full object-cover grayscale opacity-50" alt="Original" />
                                <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl border border-white/10">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Foto Original</p>
                                </div>
                            </div>
                            <div className="relative rounded-[40px] overflow-hidden border border-primary/30 shadow-2xl shadow-primary/10">
                                <img src={enhancedImage || originalImage} className="w-full h-full object-cover" alt="Enhanced" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 px-4 py-2 bg-primary/20 backdrop-blur-md rounded-xl border border-primary/30 flex items-center gap-2">
                                    <Sparkles className="text-primary" size={14} />
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest italic">IA Visual Upgrade</p>
                                </div>
                            </div>
                        </div>

                        {/* Detalhes Técnicos e Copy */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Copywriting */}
                            <div className="lg:col-span-2 glass-panel p-10 rounded-[40px] border border-white/5 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Copy de Menu Sensorial</h4>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} size={10} className="text-primary/40" />)}
                                    </div>
                                </div>
                                <p className="text-2xl font-black text-white italic leading-tight">
                                    "{analysis?.description}"
                                </p>
                                <div className="pt-6 flex gap-4 border-t border-white/5">
                                    <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                        Copiar Descrição
                                    </button>
                                    <button className="px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                        Adicionar ao Menu Digital
                                    </button>
                                </div>
                            </div>

                            {/* Alérgenos */}
                            <div className="glass-panel p-10 rounded-[40px] border border-white/5 space-y-8 bg-primary/[0.02]">
                                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Checkpoint Nutricional</h4>

                                <div className="space-y-6">
                                    <AllergenIndicator
                                        label="Contém Glúten"
                                        active={analysis?.hasGluten}
                                        severity="RED"
                                        description={analysis?.hasGluten ? "Identificado rasto de cereais na base ou molho." : "Livre de rasto de cereais identificável."}
                                    />
                                    <div className="w-full h-px bg-white/5" />
                                    <AllergenIndicator
                                        label="Contém Lactose"
                                        active={analysis?.hasLactose}
                                        severity="BLUE"
                                        description={analysis?.hasLactose ? "Presença de derivados de leite ou gordura animal." : "Ingredientes de base vegetal ou sem laticínios."}
                                    />
                                </div>

                                <div className="p-4 bg-white/5 rounded-2xl flex items-start gap-3">
                                    <Info className="text-white/20 shrink-0" size={16} />
                                    <p className="text-[9px] text-white/30 uppercase font-black leading-relaxed tracking-wider">
                                        Análise baseada em visão computacional. Recomenda-se validação técnica presencial.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AllergenIndicator = ({ label, active, severity, description }) => (
    <div className="space-y-3">
        <div className="flex items-center justify-between">
            <span className="font-black text-white text-xs uppercase italic tracking-tighter">{label}</span>
            {active ? (
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${severity === 'RED' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    <AlertTriangle size={10} /> DETETADO
                </div>
            ) : (
                <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 size={10} /> SEGURO
                </div>
            )}
        </div>
        <p className="text-[11px] text-white/40 font-medium leading-relaxed">{description}</p>
    </div>
);

export default GastroLens;
