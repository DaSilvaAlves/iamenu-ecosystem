import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    ChefHat,
    DollarSign,
    Percent,
    Plus,
    Info,
    ChevronRight,
    Target,
    ArrowRight,
    BarChart3,
    FileText,
    Search,
    Filter,
    Brain,
    X,
    Save,
    PlusCircle,
    Trash2,
    Clock,
    Utensils,
    Box,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

const FoodCostView = () => {
    // 1. ESTADOS E PERSISTÊNCIA
    const [viewMode, setViewMode] = useState('analise'); // 'analise', 'gestor'
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Dados iniciais (O Conselho do Eurico)
    const dadosIniciais = [
        {
            id: 'ft-001',
            nomePrato: 'Bacalhau à Brás',
            categoria: 'Peixe',
            rendimento: 4,
            pesoPorPorcao: 350,
            tempoPreparoTotal: 45,
            tempoCoccao: 20,
            modoPreparo: '1. Desfiar o bacalhau...\n2. Cortar batatas em palha...\n3. Refogar cebola em azeite...',
            instrucoesEmpratamento: 'Servir num prato fundo com azeitonas pretas e salsa.',
            loucaRecomendada: 'Prato fundo Vista Alegre',
            validade: '48h refrigerado',
            outrosCustosPercentagem: 10,
            margemLucroDesejada: 70,
            precoVendaAtual: 14.50,
            ingredientes: [
                { id: 1, nome: 'Bacalhau Especial', precoCompra: 15.00, qtdBruta: 0.8, fatorCorrecao: 1.2, unidadeCompra: 'kg' },
                { id: 2, nome: 'Batata Palha Premium', precoCompra: 3.50, qtdBruta: 0.5, fatorCorrecao: 1.0, unidadeCompra: 'kg' },
                { id: 3, nome: 'Ovos Caseiros', precoCompra: 2.80, qtdBruta: 0.5, fatorCorrecao: 1.0, unidadeCompra: 'dz' },
                { id: 4, nome: 'Cebola Roxa', precoCompra: 1.40, qtdBruta: 0.3, fatorCorrecao: 1.1, unidadeCompra: 'kg' },
                { id: 5, nome: 'Azeite Extra Virgem', precoCompra: 9.50, qtdBruta: 0.1, fatorCorrecao: 1.0, unidadeCompra: 'L' },
            ],
            alergenios: 'Peixe, Ovos',
            tags: 'Clássico, Signature'
        },
        {
            id: 'ft-002',
            nomePrato: 'Bacalhau à Lagareiro',
            categoria: 'Peixe',
            rendimento: 1,
            pesoPorPorcao: 400,
            tempoPreparoTotal: 60,
            tempoCoccao: 35,
            modoPreparo: '1. Assar o bacalhau...\n2. Esmagar as batatas...',
            outrosCustosPercentagem: 12,
            margemLucroDesejada: 65,
            precoVendaAtual: 18.50,
            ingredientes: [
                { id: 6, nome: 'Posta de Bacalhau', precoCompra: 22.00, qtdBruta: 0.3, fatorCorrecao: 1.0, unidadeCompra: 'kg' },
                { id: 7, nome: 'Batata para Assar', precoCompra: 1.20, qtdBruta: 0.250, fatorCorrecao: 1.1, unidadeCompra: 'kg' },
                { id: 8, nome: 'Azeite Extra', precoCompra: 10.50, qtdBruta: 0.08, fatorCorrecao: 1.0, unidadeCompra: 'L' },
            ]
        }
    ];

    const [fichas, setFichas] = useState(() => {
        const saved = localStorage.getItem('iaMenu_fichasTecnicas');
        return saved ? JSON.parse(saved) : dadosIniciais;
    });

    useEffect(() => {
        localStorage.setItem('iaMenu_fichasTecnicas', JSON.stringify(fichas));
    }, [fichas]);

    // 2. LÓGICA DE CÁLCULO (O MOTOR)
    const calcularMetricas = (ficha) => {
        if (!ficha || !ficha.ingredientes) return null;

        const custoIngredientes = ficha.ingredientes.reduce((acc, ing) => {
            const qtdLiquida = (ing.qtdBruta || 0) / (ing.fatorCorrecao || 1);
            return acc + (qtdLiquida * (ing.precoCompra || 0));
        }, 0);

        const custoTotalComOverhead = custoIngredientes * (1 + (ficha.outrosCustosPercentagem || 0) / 100);
        const custoPorPorcao = custoTotalComOverhead / (ficha.rendimento || 1);
        const precoSugerido = custoPorPorcao / (1 - (ficha.margemLucroDesejada || 70) / 100);
        const precoReal = ficha.precoVendaAtual || 0;
        const margemReal = precoReal > 0 ? ((precoReal - custoPorPorcao) / precoReal) * 100 : 0;
        const lucroPorPrato = precoReal - custoPorPorcao;

        return {
            custoIngredientes,
            custoPorPorcao,
            precoSugerido,
            margemReal,
            lucroPorPrato,
            isLowMargin: margemReal < 65
        };
    };

    const selectedFicha = useMemo(() => fichas.find(f => f.id === selectedId) || fichas[0], [fichas, selectedId]);
    const metricasSelect = useMemo(() => calcularMetricas(selectedFicha), [selectedFicha]);

    // 3. HANDLERS CRUD
    const handleSaveFicha = (novaFicha) => {
        if (novaFicha.id) {
            setFichas(fichas.map(f => f.id === novaFicha.id ? novaFicha : f));
        } else {
            const id = `ft-${Date.now()}`;
            setFichas([...fichas, { ...novaFicha, id }]);
            setSelectedId(id);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Tem certeza que deseja eliminar esta ficha técnica?")) {
            const filtered = fichas.filter(f => f.id !== id);
            setFichas(filtered);
            if (selectedId === id) setSelectedId(filtered[0]?.id || null);
        }
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 glass-effect rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[120px] -z-10" />
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/20 rounded-xl">
                            <Calculator className="text-primary w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">Food Cost & Profit Center</h1>
                    </div>
                    <p className="text-white/40 font-bold text-sm tracking-wide">Gestão Inteligente de Margens e Engenharia de Menu.</p>
                </div>

                <button
                    onClick={() => {
                        setSelectedId(null);
                        setShowModal(true);
                    }}
                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3 uppercase italic text-sm tracking-tighter"
                >
                    <PlusCircle size={20} /> Nova Ficha Técnica
                </button>
            </div>

            {/* Tabs de Navegação */}
            <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 w-fit">
                <button
                    onClick={() => setViewMode('analise')}
                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'analise' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                >
                    <BarChart3 size={16} /> Análise de Menu
                </button>
                <button
                    onClick={() => setViewMode('gestor')}
                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'gestor' ? 'bg-white/10 text-white shadow-lg' : 'text-white/30 hover:text-white/60'}`}
                >
                    <FileText size={16} /> Gestor de Fichas
                </button>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'analise' ? (
                    <motion.div
                        key="analise"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    >
                        {/* Ranking de Rentabilidade */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="p-8 glass-effect rounded-[40px] border border-white/5 bg-white/[0.01]">
                                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase italic tracking-tighter">
                                    <TrendingUp className="text-primary" size={24} /> Performance de Margem Bruta
                                </h3>
                                <div className="space-y-4">
                                    {fichas.map(f => {
                                        const m = calcularMetricas(f);
                                        return (
                                            <div key={f.id} className="group p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all flex items-center justify-between">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm border ${m.isLowMargin ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                                                        {m.margemReal.toFixed(0)}%
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-white text-lg tracking-tight group-hover:text-primary transition-colors">{f.nomePrato}</h4>
                                                        <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">{f.categoria} • {f.rendimento} doses</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-black text-xl italic">{f.precoVendaAtual.toFixed(2)}€</p>
                                                    <p className={`text-[10px] font-black uppercase tracking-tighter ${m.isLowMargin ? 'text-red-400' : 'text-primary'}`}>
                                                        {m.isLowMargin ? 'Ladrão de Lucro' : 'Margem Excelente'}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Insights Inteligentes */}
                        <div className="space-y-8">
                            <div className="p-8 glass-effect rounded-[40px] border border-white/5 bg-primary/5">
                                <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase italic tracking-tighter">
                                    <Brain className="text-primary" size={24} /> iaMenu Insights
                                </h3>
                                <div className="space-y-6">
                                    <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 group cursor-help hover:bg-red-500/10 transition-all">
                                        <div className="flex items-center gap-3 mb-3">
                                            <AlertTriangle className="text-red-400" size={20} />
                                            <h4 className="font-black text-white text-xs uppercase tracking-widest">Alerta de Custo</h4>
                                        </div>
                                        <p className="text-[11px] text-white/60 leading-relaxed">O custo do <strong>Bacalhau Especial</strong> subiu 15% nos últimos 30 dias. A margem do prato está agora em níveis críticos (58%). Recomendamos reajuste imediato.</p>
                                    </div>

                                    <div className="p-6 rounded-3xl bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-all">
                                        <div className="flex items-center gap-3 mb-3">
                                            <TrendingUp className="text-green-400" size={20} />
                                            <h4 className="font-black text-white text-xs uppercase tracking-widest">Oportunidade</h4>
                                        </div>
                                        <p className="text-[11px] text-white/60 leading-relaxed">Prato <strong>Bacalhau à Brás</strong> tem alta demanda e gordura na margem. Criar uma oferta "Combo Familiar" pode aumentar o volume em 22% sem degradar o lucro.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="gestor"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-4 gap-8"
                    >
                        {/* Navegação de Fichas */}
                        <div className="lg:col-span-1 glass-panel p-4 rounded-[32px] border border-white/5 space-y-2 h-fit">
                            <p className="px-4 py-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">As Tuas Receitas</p>
                            {fichas.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setSelectedId(f.id)}
                                    className={`w-full p-4 rounded-2xl text-left transition-all group flex items-center justify-between ${selectedId === f.id ? 'bg-primary/20 border border-primary/20' : 'hover:bg-white/5'}`}
                                >
                                    <div>
                                        <p className={`font-black text-sm ${selectedId === f.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{f.nomePrato}</p>
                                        <p className="text-[10px] text-white/20 uppercase font-bold tracking-tighter">{f.categoria}</p>
                                    </div>
                                    <ChevronRight size={14} className={selectedId === f.id ? 'text-primary' : 'text-white/10'} />
                                </button>
                            ))}
                        </div>

                        {/* Detalhe da Ficha */}
                        <div className="lg:col-span-3 space-y-8">
                            {selectedFicha ? (
                                <div className="glass-panel p-10 rounded-[40px] border border-white/5 bg-white/[0.01] space-y-12">
                                    {/* Header da Ficha */}
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">{selectedFicha.nomePrato}</h2>
                                                <button
                                                    onClick={() => setShowModal(true)}
                                                    className="p-2 bg-white/5 rounded-lg text-white/20 hover:text-primary transition-colors"
                                                >
                                                    <FileText size={16} />
                                                </button>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-3 py-1 bg-primary/10 rounded-full border border-primary/20">{selectedFicha.categoria}</span>
                                                <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">SKU: {selectedFicha.id}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleDelete(selectedFicha.id)}
                                                className="p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500/20 transition-all"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                            <div className="p-4 bg-primary text-black rounded-2xl font-black italic uppercase text-xs tracking-tighter flex items-center gap-2 shadow-lg shadow-primary/20">
                                                <CheckCircle2 size={16} /> Ficha Ativa
                                            </div>
                                        </div>
                                    </div>

                                    {/* Métricas Principais */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <MétricaCard label="Custo Produção" value={`${metricasSelect.custoPorPorcao.toFixed(2)}€`} icon={Utensils} />
                                        <MétricaCard label="Preço Praticado" value={`${selectedFicha.precoVendaAtual.toFixed(2)}€`} icon={DollarSign} />
                                        <MétricaCard
                                            label="Margem Real"
                                            value={`${metricasSelect.margemReal.toFixed(0)}%`}
                                            icon={Percent}
                                            highlight={metricasSelect.isLowMargin ? "text-red-400" : "text-primary"}
                                        />
                                        <MétricaCard
                                            label="Markup Sugerido"
                                            value={`${(selectedFicha.precoVendaAtual / metricasSelect.custoPorPorcao).toFixed(2)}x`}
                                            icon={TrendingUp}
                                        />
                                    </div>

                                    {/* Composição Técnica */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                                        {/* Ingredientes */}
                                        <div className="space-y-6">
                                            <h3 className="text-sm font-black text-white uppercase italic tracking-[0.3em] flex items-center gap-2 px-2">
                                                <Box className="text-primary" size={16} /> Lista de Materiais (BOM)
                                            </h3>
                                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
                                                <table className="w-full text-left text-xs">
                                                    <thead>
                                                        <tr className="bg-white/5 text-white/30 font-black uppercase tracking-widest border-b border-white/5">
                                                            <th className="p-4">Item</th>
                                                            <th className="p-4">Qtd. Bruta</th>
                                                            <th className="p-4">FC</th>
                                                            <th className="p-4 text-right">Custo Líq.</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-white/[0.03] text-white/70">
                                                        {selectedFicha.ingredientes.map(ing => (
                                                            <tr key={ing.id} className="hover:bg-white/[0.03] transition-colors">
                                                                <td className="p-4 font-bold">{ing.nome}</td>
                                                                <td className="p-4">{ing.qtdBruta}{ing.unidadeCompra}</td>
                                                                <td className="p-4 font-mono text-white/30">{ing.fatorCorrecao}</td>
                                                                <td className="p-4 text-right font-black text-white">
                                                                    {((ing.qtdBruta / ing.fatorCorrecao) * ing.precoCompra).toFixed(2)}€
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Operacional & Cozinha */}
                                        <div className="space-y-8">
                                            <div className="glass-panel p-8 rounded-[32px] border border-white/5 space-y-6">
                                                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Checkpoint Operacional</h4>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] text-white/20 uppercase font-black uppercase">Tempo Médio Prepara</p>
                                                        <p className="text-lg font-black text-white italic">{selectedFicha.tempoPreparoTotal || 0} min</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] text-white/20 uppercase font-black uppercase">Tempo de Fogo</p>
                                                        <p className="text-lg font-black text-white italic">{selectedFicha.tempoCoccao || 0} min</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] text-white/20 uppercase font-black uppercase">Validade</p>
                                                        <p className="text-lg font-black text-white italic">{selectedFicha.validade || 'N/A'}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] text-white/20 uppercase font-black uppercase">Louça</p>
                                                        <p className="text-[11px] font-bold text-white/60">{selectedFicha.loucaRecomendada || 'Padrão'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-8 rounded-[32px] bg-white/[0.01] border border-white/5 space-y-4">
                                                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Marketing & Alergénios</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedFicha.alergenios?.split(',').map(a => (
                                                        <span key={a} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/10 rounded-lg text-[9px] font-black uppercase">{a.trim()}</span>
                                                    ))}
                                                    {selectedFicha.tags?.split(',').map(t => (
                                                        <span key={t} className="px-3 py-1 bg-white/5 text-white/40 border border-white/10 rounded-lg text-[9px] font-black uppercase">{t.trim()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-24 glass-panel rounded-[40px] border border-white/5 text-center space-y-6">
                                    <ChefHat size={48} className="text-white/10 mx-auto" />
                                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Cria ou seleciona uma ficha técnica para começar.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL EDITOR AVANÇADO */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-neutral-900 w-full max-w-5xl h-[90vh] rounded-[40px] border border-white/10 shadow-2xl relative flex flex-col overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                        {selectedId ? 'Editar Ficha Técnica' : 'Construir Nova Receita'}
                                    </h2>
                                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Motor de Cálculo iaMenu Profit</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 text-white transition-all"><X /></button>
                            </div>

                            {/* Modal Body (Scrollable) */}
                            <div className="flex-1 overflow-y-auto p-10 space-y-12">
                                <EditorForm
                                    initialData={selectedFicha || {}}
                                    onSave={handleSaveFicha}
                                    onCancel={() => setShowModal(false)}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// COMPONENTES AUXILIARES
const MétricaCard = ({ label, value, icon: Icon, highlight = "text-white" }) => (
    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all space-y-3">
        <div className="flex items-center gap-2 text-white/20 uppercase font-black text-[9px] tracking-widest">
            <Icon size={14} /> {label}
        </div>
        <p className={`text-2xl font-black italic ${highlight}`}>{value}</p>
    </div>
);

const EditorForm = ({ initialData, onSave, onCancel }) => {
    const [form, setForm] = useState({
        nomePrato: initialData.nomePrato || '',
        categoria: initialData.categoria || 'Geral',
        rendimento: initialData.rendimento || 1,
        outrosCustosPercentagem: initialData.outrosCustosPercentagem || 10,
        margemLucroDesejada: initialData.margemLucroDesejada || 70,
        precoVendaAtual: initialData.precoVendaAtual || 0,
        tempoPreparoTotal: initialData.tempoPreparoTotal || 15,
        tempoCoccao: initialData.tempoCoccao || 10,
        ingredientes: initialData.ingredientes || [
            { id: Date.now(), nome: '', qtdBruta: 0, fatorCorrecao: 1, precoCompra: 0, unidadeCompra: 'kg' }
        ],
        ...initialData
    });

    const addIngrediente = () => {
        setForm({
            ...form,
            ingredientes: [...form.ingredientes, { id: Date.now(), nome: '', qtdBruta: 0, fatorCorrecao: 1, precoCompra: 0, unidadeCompra: 'kg' }]
        });
    };

    const removeIngrediente = (id) => {
        setForm({
            ...form,
            ingredientes: form.ingredientes.filter(i => i.id !== id)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 pb-10">
            {/* Bloco 1: Identidade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InputGroup label="Nome do Prato" placeholder="Ex: Arroz de Polvo Malandro">
                    <input
                        type="text"
                        value={form.nomePrato}
                        onChange={e => setForm({ ...form, nomePrato: e.target.value })}
                        className="editor-input"
                        required
                    />
                </InputGroup>
                <InputGroup label="Categoria">
                    <select
                        value={form.categoria}
                        onChange={e => setForm({ ...form, categoria: e.target.value })}
                        className="editor-input"
                    >
                        <option value="Entrada">Entrada</option>
                        <option value="Peixe">Peixe</option>
                        <option value="Carne">Carne</option>
                        <option value="Sobr">Sobremesa</option>
                    </select>
                </InputGroup>
                <InputGroup label="Doses (Rendimento)">
                    <input
                        type="number"
                        value={form.rendimento}
                        onChange={e => setForm({ ...form, rendimento: parseInt(e.target.value) })}
                        className="editor-input"
                    />
                </InputGroup>
            </div>

            {/* Bloco 2: Ingredientes */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em]">Engenharia de Materiais</h3>
                    <button type="button" onClick={addIngrediente} className="text-[10px] font-black text-primary uppercase border border-primary/20 bg-primary/10 px-4 py-2 rounded-xl hover:bg-primary transition-all hover:text-black">
                        + Item
                    </button>
                </div>
                <div className="space-y-3">
                    {form.ingredientes.map((ing, idx) => (
                        <div key={ing.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-white/5 rounded-2xl items-end relative group">
                            <div className="md:col-span-2">
                                <label className="text-[9px] font-black text-white/20 uppercase mb-2 block">Ingrediente</label>
                                <input
                                    type="text"
                                    className="editor-input text-xs"
                                    value={ing.nome}
                                    onChange={e => {
                                        const n = [...form.ingredientes];
                                        n[idx].nome = e.target.value;
                                        setForm({ ...form, ingredientes: n });
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-white/20 uppercase mb-2 block">Preço Ref (€)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="editor-input text-xs"
                                    value={ing.precoCompra}
                                    onChange={e => {
                                        const n = [...form.ingredientes];
                                        n[idx].precoCompra = parseFloat(e.target.value);
                                        setForm({ ...form, ingredientes: n });
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-white/20 uppercase mb-2 block">Qtd. Bruta</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        step="0.001"
                                        className="editor-input text-xs"
                                        value={ing.qtdBruta}
                                        onChange={e => {
                                            const n = [...form.ingredientes];
                                            n[idx].qtdBruta = parseFloat(e.target.value);
                                            setForm({ ...form, ingredientes: n });
                                        }}
                                    />
                                    <input
                                        type="text"
                                        className="editor-input text-[10px] w-12 text-center"
                                        value={ing.unidadeCompra}
                                        placeholder="kg"
                                        onChange={e => {
                                            const n = [...form.ingredientes];
                                            n[idx].unidadeCompra = e.target.value;
                                            setForm({ ...form, ingredientes: n });
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-white/20 uppercase mb-2 block">FC (Desp.)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="editor-input text-xs"
                                    value={ing.fatorCorrecao}
                                    onChange={e => {
                                        const n = [...form.ingredientes];
                                        n[idx].fatorCorrecao = parseFloat(e.target.value);
                                        setForm({ ...form, ingredientes: n });
                                    }}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={() => removeIngrediente(ing.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 transition-all hover:text-white opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bloco 3: Financeiro e Estratégico */}
            <div className="p-8 rounded-[40px] bg-primary/5 border border-primary/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <InputGroup label="Margem Bruta Desejada (%)">
                        <input
                            type="number"
                            className="editor-input text-primary font-black"
                            value={form.margemLucroDesejada}
                            onChange={e => setForm({ ...form, margemLucroDesejada: parseInt(e.target.value) })}
                        />
                    </InputGroup>
                    <InputGroup label="Overhead / Custos Fixos (%)">
                        <input
                            type="number"
                            className="editor-input"
                            value={form.outrosCustosPercentagem}
                            onChange={e => setForm({ ...form, outrosCustosPercentagem: parseInt(e.target.value) })}
                        />
                    </InputGroup>
                    <InputGroup label="Preço de Venda Real (€)">
                        <input
                            type="number"
                            step="0.05"
                            className="editor-input text-xl text-white font-black"
                            value={form.precoVendaAtual}
                            onChange={e => setForm({ ...form, precoVendaAtual: parseFloat(e.target.value) })}
                        />
                    </InputGroup>
                </div>
            </div>

            {/* Ações */}
            <div className="flex gap-4 pt-10 border-t border-white/5">
                <button type="button" onClick={onCancel} className="flex-1 py-5 text-white/40 font-black uppercase tracking-widest text-xs hover:text-white transition-all">Cancelar</button>
                <button type="submit" className="flex-[2] py-5 bg-primary text-black font-black uppercase italic tracking-tighter flex items-center justify-center gap-3 rounded-[24px] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all">
                    <Save size={20} /> Guardar Configuração Inteligente
                </button>
            </div>
        </form>
    );
};

const InputGroup = ({ label, children }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-2">{label}</label>
        {children}
    </div>
);

// Injected Styles
const styles = `
.editor-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px border rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 1rem 1.5rem;
    color: white;
    outline: none;
    transition: all 0.3s ease;
}
.editor-input:focus {
    border-color: #f7a833;
    background: rgba(247,168,51,0.05);
}
.glass-panel {
    background: rgba(255, 255, 255, 0.01);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
}
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

export default FoodCostView;
