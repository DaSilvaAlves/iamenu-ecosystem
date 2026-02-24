import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
    Camera,
    Upload,
    Sparkles,
    ChefHat,
    AlertTriangle,
    CheckCircle2,
    Info,
    Brain,
    Image as ImageIcon,
    Clock
} from 'lucide-react';
// GeminiService removido - agora usamos serverless function!

// --- Interfaces ---
interface AnalysisSuggestion {
    icon: string;
    title: string;
    description: string;
}

interface AnalysisResult {
    description?: string;
    hasGluten?: boolean;
    hasLactose?: boolean;
    hasNuts?: boolean;
    hasFish?: boolean;
    hasShellfish?: boolean;
    hasEggs?: boolean;
    hasSoy?: boolean;
    hasSesame?: boolean;
    hasSulfites?: boolean;
    hasCelery?: boolean;
    suggestions?: AnalysisSuggestion[];
}

interface SavedScan {
    id: string;
    dishName: string;
    originalImage: string;
    enhancedImage: string | null;
    analysis: AnalysisResult | null;
    timestamp: string;
}

interface AllergenIndicatorProps {
    label: string;
    active?: boolean;
    severity: 'RED' | 'BLUE';
    description: string;
}

type StatusType = 'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

const GastroLens = () => {
    // 1. ESTADOS
    const [status, setStatus] = useState<StatusType>('IDLE');
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dishName, setDishName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [savedScans, setSavedScans] = useState<SavedScan[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Carregar scans salvos ao montar
    useEffect(() => {
        const scans: SavedScan[] = JSON.parse(localStorage.getItem('iaMenu_gastrolens_scans') || '[]');
        setSavedScans(scans);
    }, []);

    // 2. HANDLERS
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
                setEnhancedImage(null);
                setAnalysis(null);
                setStatus('IDLE');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProcess = async () => {
        if (!originalImage || !dishName) return;

        setStatus('PROCESSING');
        setError(null);

        try {
            // Chamar a serverless function (API key segura no servidor!)
            const response = await fetch('/api/analyze-dish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: originalImage,
                    dishName,
                    ingredients
                })
            });

            if (!response.ok) {
                const errorData = await response.json() as { error?: string };
                throw new Error(errorData.error || 'Falha ao processar imagem');
            }

            const data = await response.json() as { analysis: AnalysisResult };

            // Simular enhancement de imagem (por agora)
            // TODO: Implementar enhancement real no backend
            setEnhancedImage(originalImage);
            setAnalysis(data.analysis);
            setStatus('SUCCESS');

            toast.success('Analise concluida com sucesso!', {
                duration: 3000
            });

        } catch (err: unknown) {
            console.error('Erro ao processar:', err);
            setError(err instanceof Error ? err.message : 'Falha ao processar a imagem. Tenta novamente.');
            setStatus('ERROR');

            toast.error('Erro ao processar imagem', {
                duration: 4000
            });
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

    const handleCopyDescription = () => {
        if (analysis?.description) {
            navigator.clipboard.writeText(analysis.description).then(() => {
                toast.success('Descricao copiada para a area de transferencia!', {
                    duration: 3000,
                });
            }).catch(() => {
                toast.error('Erro ao copiar descricao');
            });
        }
    };

    const handleAddToMenu = () => {
        // Guardar scan no localStorage para integracao com Food Cost
        const currentScans: SavedScan[] = JSON.parse(localStorage.getItem('iaMenu_gastrolens_scans') || '[]');
        const newScan: SavedScan = {
            id: `scan-${Date.now()}`,
            dishName,
            originalImage: originalImage!,
            enhancedImage,
            analysis,
            timestamp: new Date().toISOString()
        };
        const updatedScans = [newScan, ...currentScans].slice(0, 10); // Manter apenas ultimos 10
        localStorage.setItem('iaMenu_gastrolens_scans', JSON.stringify(updatedScans));
        setSavedScans(updatedScans);

        toast.success('Scan guardado! Agora podes adicionar ao Food Cost.', {
            duration: 4000,
        });
    };

    const loadPreviousScan = (scan: SavedScan) => {
        setDishName(scan.dishName);
        setOriginalImage(scan.originalImage);
        setEnhancedImage(scan.enhancedImage);
        setAnalysis(scan.analysis);
        setStatus('SUCCESS');
        toast.success('Scan anterior carregado!');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <Toaster position="top-right" />
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
                    <p className="text-white/40 font-bold text-sm tracking-wide">Transforma fotos brutas em obras de arte e descricoes tecnicas.</p>
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
                        {/* Formulario */}
                        <div className="glass-panel p-8 rounded-[40px] border border-white/5 space-y-6">
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                                <Brain className="text-primary" size={20} /> Briefing do Prato
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-2">Nome do Prato (Obrigatorio)</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Polvo a Lagareiro iaMenu"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/10 outline-none focus:border-primary/50 transition-all font-bold"
                                        value={dishName}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDishName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-2">Ingredientes Principais (Opcional)</label>
                                    <textarea
                                        placeholder="Ex: Polvo, batata a murro, azeite extra virgem, alho, louro..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/10 outline-none focus:border-primary/50 transition-all min-h-[120px] font-medium text-sm leading-relaxed"
                                        value={ingredients}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setIngredients(e.target.value)}
                                    />
                                </div>

                                {/* API Key removida - agora e serverless! */}
                                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-3">
                                    <Sparkles className="text-primary shrink-0 mt-1" size={16} />
                                    <div>
                                        <p className="text-xs text-white/80 font-bold leading-relaxed">
                                            <strong className="text-primary">100% Pronto a usar!</strong>
                                        </p>
                                        <p className="text-[10px] text-white/40 font-medium mt-1">
                                            Nao precisas de API key. A IA esta sempre disponivel para toda a comunidade iaMenu!
                                        </p>
                                    </div>
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
                            onClick={() => fileInputRef.current?.click()}
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

                        {/* Galeria de Scans Anteriores */}
                        {savedScans.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-panel p-8 rounded-[40px] border border-white/5"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                                        <Clock className="text-primary" size={20} /> Scans Recentes
                                    </h3>
                                    <span className="text-white/40 text-xs font-bold">{savedScans.length} scans salvos</span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {savedScans.map((scan) => (
                                        <button
                                            key={scan.id}
                                            onClick={() => loadPreviousScan(scan)}
                                            className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 hover:border-primary/30 transition-all"
                                        >
                                            <img
                                                src={scan.enhancedImage || scan.originalImage}
                                                alt={scan.dishName}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                                    <p className="text-white font-black text-xs truncate">{scan.dishName}</p>
                                                    <p className="text-white/60 text-[9px] font-bold">
                                                        {new Date(scan.timestamp).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
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
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">O Chef esta a trabalhar...</h2>
                            <p className="text-white/40 font-bold max-w-md mx-auto leading-relaxed">
                                Estamos a analisar cada pixel, a melhorar a iluminacao e a redigir a descricao perfeita para o teu menu.
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
                        {/* Comparacao de Imagem */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[500px]">
                            <div className="relative group rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
                                <img src={originalImage!} className="w-full h-full object-cover grayscale opacity-50" alt="Original" />
                                <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl border border-white/10">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Foto Original</p>
                                </div>
                            </div>
                            <div className="relative rounded-[40px] overflow-hidden border border-primary/30 shadow-2xl shadow-primary/10">
                                <img src={enhancedImage || originalImage!} className="w-full h-full object-cover" alt="Enhanced" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 px-4 py-2 bg-primary/20 backdrop-blur-md rounded-xl border border-primary/30 flex items-center gap-2">
                                    <Sparkles className="text-primary" size={14} />
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest italic">IA Visual Upgrade</p>
                                </div>
                            </div>
                        </div>

                        {/* Detalhes Tecnicos e Copy */}
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
                                    &quot;{analysis?.description}&quot;
                                </p>
                                <div className="pt-6 flex gap-4 border-t border-white/5">
                                    <button
                                        onClick={handleCopyDescription}
                                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                    >
                                        <span>Copiar Descricao</span>
                                    </button>
                                    <button
                                        onClick={handleAddToMenu}
                                        className="px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                                    >
                                        <span>Adicionar ao Menu Digital</span>
                                    </button>
                                </div>
                            </div>

                            {/* Alergenios */}
                            <div className="glass-panel p-10 rounded-[40px] border border-white/5 space-y-6 bg-primary/[0.02]">
                                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Checkpoint Nutricional</h4>

                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    <AllergenIndicator
                                        label="Gluten"
                                        active={analysis?.hasGluten}
                                        severity="RED"
                                        description={analysis?.hasGluten ? "Cereais identificados" : "Livre de cereais"}
                                    />
                                    <div className="w-full h-px bg-white/5" />
                                    <AllergenIndicator
                                        label="Lactose"
                                        active={analysis?.hasLactose}
                                        severity="BLUE"
                                        description={analysis?.hasLactose ? "Derivados de leite" : "Sem laticinios"}
                                    />
                                    <div className="w-full h-px bg-white/5" />
                                    <AllergenIndicator
                                        label="Frutos Secos"
                                        active={analysis?.hasNuts}
                                        severity="RED"
                                        description={analysis?.hasNuts ? "Tracos de frutos secos" : "Sem frutos secos"}
                                    />
                                    <div className="w-full h-px bg-white/5" />
                                    <AllergenIndicator
                                        label="Peixe"
                                        active={analysis?.hasFish}
                                        severity="BLUE"
                                        description={analysis?.hasFish ? "Contem peixe" : "Sem peixe"}
                                    />
                                    <div className="w-full h-px bg-white/5" />
                                    <AllergenIndicator
                                        label="Marisco"
                                        active={analysis?.hasShellfish}
                                        severity="RED"
                                        description={analysis?.hasShellfish ? "Contem marisco" : "Sem marisco"}
                                    />
                                    <div className="w-full h-px bg-white/5" />
                                    <AllergenIndicator
                                        label="Ovos"
                                        active={analysis?.hasEggs}
                                        severity="BLUE"
                                        description={analysis?.hasEggs ? "Contem ovos" : "Sem ovos"}
                                    />
                                    <div className="w-full h-px bg-white/5" />
                                    <AllergenIndicator
                                        label="Soja"
                                        active={analysis?.hasSoy}
                                        severity="BLUE"
                                        description={analysis?.hasSoy ? "Contem soja" : "Sem soja"}
                                    />
                                    <div className="w-full h-px bg-white/5" />
                                    <AllergenIndicator
                                        label="Sesamo"
                                        active={analysis?.hasSesame}
                                        severity="RED"
                                        description={analysis?.hasSesame ? "Contem sesamo" : "Sem sesamo"}
                                    />
                                    <div className="w-full h-px bg-white/5" />
                                    <AllergenIndicator
                                        label="Sulfitos"
                                        active={analysis?.hasSulfites}
                                        severity="BLUE"
                                        description={analysis?.hasSulfites ? "Contem sulfitos" : "Sem sulfitos"}
                                    />
                                    <div className="w-full h-px bg-white/5" />
                                    <AllergenIndicator
                                        label="Aipo"
                                        active={analysis?.hasCelery}
                                        severity="BLUE"
                                        description={analysis?.hasCelery ? "Contem aipo" : "Sem aipo"}
                                    />
                                </div>

                                <div className="p-4 bg-white/5 rounded-2xl flex items-start gap-3 mt-4">
                                    <Info className="text-white/20 shrink-0" size={16} />
                                    <p className="text-[9px] text-white/30 uppercase font-black leading-relaxed tracking-wider">
                                        Analise baseada em visao computacional. Recomenda-se validacao tecnica presencial.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sugestoes de Melhoria da IA */}
                        {analysis?.suggestions && analysis.suggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="glass-panel p-10 rounded-[40px] border border-white/5 space-y-6"
                            >
                                <div className="flex items-center gap-3">
                                    <Sparkles className="text-primary" size={24} />
                                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Sugestoes de Melhoria</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {analysis.suggestions.map((suggestion, idx) => (
                                        <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-primary/20 transition-all group">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all">
                                                    <span className="text-lg">{suggestion.icon}</span>
                                                </div>
                                                <div>
                                                    <h5 className="font-black text-white text-sm mb-2">{suggestion.title}</h5>
                                                    <p className="text-white/60 text-xs leading-relaxed">{suggestion.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AllergenIndicator = ({ label, active, severity, description }: AllergenIndicatorProps) => (
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

// CSS personalizado para scrollbar
const styles = `
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(247, 168, 51, 0.3);
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(247, 168, 51, 0.5);
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    if (!document.head.querySelector('style[data-gastrolens]')) {
        styleSheet.setAttribute('data-gastrolens', 'true');
        document.head.appendChild(styleSheet);
    }
}

export default GastroLens;
