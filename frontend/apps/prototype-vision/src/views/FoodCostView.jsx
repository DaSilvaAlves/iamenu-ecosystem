import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
    CheckCircle2,
    Download,
    Image as ImageIcon
} from 'lucide-react';

const FoodCostView = () => {
    // 1. ESTADOS E PERSISTÊNCIA
    const [viewMode, setViewMode] = useState('analise'); // 'analise', 'gestor'
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategoria, setFilterCategoria] = useState('all');
    const [filterMargem, setFilterMargem] = useState('all');

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

    // 2.5. LÓGICA DE FILTRAGEM
    const fichasFiltradas = useMemo(() => {
        return fichas.filter(f => {
            const m = calcularMetricas(f);

            // Filtro de search
            const matchSearch = f.nomePrato.toLowerCase().includes(searchQuery.toLowerCase());

            // Filtro de categoria
            const matchCategoria = filterCategoria === 'all' || f.categoria === filterCategoria;

            // Filtro de margem
            let matchMargem = true;
            if (filterMargem === 'alta') matchMargem = m.margemReal >= 65;
            if (filterMargem === 'baixa') matchMargem = m.margemReal < 65;

            return matchSearch && matchCategoria && matchMargem;
        });
    }, [fichas, searchQuery, filterCategoria, filterMargem]);

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

    const handleExportPDF = (ficha) => {
        const doc = new jsPDF();
        const metricas = calcularMetricas(ficha);
        let yPos = 15;

        // Header com fundo colorido
        doc.setFillColor(247, 168, 51);
        doc.rect(0, 0, 210, 35, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text(ficha.nomePrato, 15, 20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`${ficha.categoria} • ${ficha.rendimento} doses • SKU: ${ficha.id}`, 15, 28);

        // Reset para texto preto
        doc.setTextColor(0, 0, 0);
        yPos = 45;

        // Métricas Financeiras
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('MÉTRICAS FINANCEIRAS', 15, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Custo por Porção: €${metricas.custoPorPorcao.toFixed(2)}`, 20, yPos);
        yPos += 6;
        doc.text(`Preço de Venda: €${ficha.precoVendaAtual.toFixed(2)}`, 20, yPos);
        yPos += 6;
        doc.text(`Margem Real: ${metricas.margemReal.toFixed(1)}%`, 20, yPos);
        yPos += 6;
        doc.text(`Lucro por Prato: €${metricas.lucroPorPrato.toFixed(2)}`, 20, yPos);
        yPos += 6;
        doc.text(`Preço Sugerido: €${metricas.precoSugerido.toFixed(2)}`, 20, yPos);
        yPos += 12;

        // Lista de Materiais
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('LISTA DE MATERIAIS (BOM)', 15, yPos);
        yPos += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Ingrediente', 20, yPos);
        doc.text('Qtd', 100, yPos);
        doc.text('FC', 130, yPos);
        doc.text('Custo', 160, yPos);
        yPos += 2;
        doc.setLineWidth(0.5);
        doc.line(15, yPos, 195, yPos);
        yPos += 5;

        doc.setFont('helvetica', 'normal');
        ficha.ingredientes.forEach(ing => {
            const custoLiq = ((ing.qtdBruta / ing.fatorCorrecao) * ing.precoCompra).toFixed(2);
            doc.text(ing.nome, 20, yPos);
            doc.text(`${ing.qtdBruta}${ing.unidadeCompra}`, 100, yPos);
            doc.text(ing.fatorCorrecao.toFixed(2), 130, yPos);
            doc.text(`€${custoLiq}`, 160, yPos);
            yPos += 5;
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
        });
        yPos += 10;

        // Modo de Preparo
        if (ficha.modoPreparo && yPos < 250) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('MODO DE PREPARO', 15, yPos);
            yPos += 8;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(ficha.modoPreparo, 180);
            lines.forEach(line => {
                if (yPos > 280) {
                    doc.addPage();
                    yPos = 20;
                }
                doc.text(line, 20, yPos);
                yPos += 5;
            });
            yPos += 10;
        }

        // Informações Operacionais
        if (yPos < 250) {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('INFORMAÇÕES OPERACIONAIS', 15, yPos);
            yPos += 8;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Tempo Preparo: ${ficha.tempoPreparoTotal || 0} min`, 20, yPos);
            yPos += 6;
            doc.text(`Tempo Cocção: ${ficha.tempoCoccao || 0} min`, 20, yPos);
            yPos += 6;
            doc.text(`Validade: ${ficha.validade || 'N/A'}`, 20, yPos);
            yPos += 6;
            doc.text(`Louça: ${ficha.loucaRecomendada || 'Padrão'}`, 20, yPos);
        }

        // Footer em todas as páginas
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(`Ficha Técnica • iaMenu Food Cost System • Página ${i}/${pageCount}`, 15, 290);
        }

        doc.save(`Ficha-Tecnica-${ficha.nomePrato.replace(/\s+/g, '-')}.pdf`);
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
                        <div className="lg:col-span-1 glass-panel p-4 rounded-[32px] border border-white/5 space-y-4 h-fit">
                            <p className="px-4 py-2 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">As Tuas Receitas</p>

                            {/* Search Bar */}
                            <div className="relative px-2">
                                <Search size={16} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/20" />
                                <input
                                    type="text"
                                    placeholder="Pesquisar prato..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/20 outline-none focus:border-primary/50 transition-all"
                                />
                            </div>

                            {/* Filtros */}
                            <div className="px-2 space-y-2">
                                <select
                                    value={filterCategoria}
                                    onChange={e => setFilterCategoria(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold outline-none focus:border-primary/50 transition-all"
                                >
                                    <option value="all">Todas Categorias</option>
                                    <option value="Peixe">Peixe</option>
                                    <option value="Carne">Carne</option>
                                    <option value="Entrada">Entrada</option>
                                    <option value="Sobremesa">Sobremesa</option>
                                </select>

                                <select
                                    value={filterMargem}
                                    onChange={e => setFilterMargem(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold outline-none focus:border-primary/50 transition-all"
                                >
                                    <option value="all">Todas Margens</option>
                                    <option value="alta">Alta Margem (≥65%)</option>
                                    <option value="baixa">Baixa Margem (&lt;65%)</option>
                                </select>
                            </div>

                            {/* Lista de Fichas Filtradas */}
                            <div className="space-y-2">
                                {fichasFiltradas.length > 0 ? fichasFiltradas.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setSelectedId(f.id)}
                                    className={`w-full p-4 rounded-2xl text-left transition-all group flex items-center gap-3 ${selectedId === f.id ? 'bg-primary/20 border border-primary/20' : 'hover:bg-white/5'}`}
                                >
                                    {/* Mini Preview da Foto */}
                                    {f.foto ? (
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
                                            <img src={f.foto} alt={f.nomePrato} className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                            <ChefHat size={20} className="text-white/20" />
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <p className={`font-black text-sm ${selectedId === f.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{f.nomePrato}</p>
                                        <p className="text-[10px] text-white/20 uppercase font-bold tracking-tighter">{f.categoria}</p>
                                    </div>
                                    <ChevronRight size={14} className={selectedId === f.id ? 'text-primary' : 'text-white/10'} />
                                </button>
                            )) : (
                                <div className="p-8 text-center">
                                    <Filter size={32} className="text-white/10 mx-auto mb-3" />
                                    <p className="text-white/30 text-xs font-bold">Nenhuma ficha encontrada</p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setFilterCategoria('all');
                                            setFilterMargem('all');
                                        }}
                                        className="mt-3 text-primary text-xs font-black uppercase tracking-wider hover:underline"
                                    >
                                        Limpar Filtros
                                    </button>
                                </div>
                            )}
                            </div>
                        </div>

                        {/* Detalhe da Ficha */}
                        <div className="lg:col-span-3 space-y-8">
                            {selectedFicha ? (
                                <div className="glass-panel p-10 rounded-[40px] border border-white/5 bg-white/[0.01] space-y-12">
                                    {/* Foto do Prato (se existir) */}
                                    {selectedFicha.foto && (
                                        <div className="w-full h-64 rounded-[32px] overflow-hidden border border-white/10 shadow-2xl mb-8">
                                            <img src={selectedFicha.foto} alt={selectedFicha.nomePrato} className="w-full h-full object-cover" />
                                        </div>
                                    )}

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
                                                onClick={() => handleExportPDF(selectedFicha)}
                                                className="px-6 py-4 bg-green-500/10 text-green-400 rounded-2xl border border-green-500/20 hover:bg-green-500/20 transition-all font-black uppercase text-xs tracking-tighter flex items-center gap-2"
                                                title="Exportar Ficha em PDF"
                                            >
                                                <Download size={18} /> Exportar PDF
                                            </button>
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

                                    {/* Modo de Preparo e Empratamento */}
                                    {(selectedFicha.modoPreparo || selectedFicha.instrucoesEmpratamento) && (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Modo de Preparo */}
                                            {selectedFicha.modoPreparo && (
                                                <div className="glass-panel p-8 rounded-[32px] border border-white/5 space-y-4">
                                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-2">
                                                        <ChefHat size={14} /> Modo de Preparo
                                                    </h4>
                                                    <div className="text-white/70 text-sm leading-relaxed whitespace-pre-line font-medium">
                                                        {selectedFicha.modoPreparo}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Instruções de Empratamento */}
                                            {selectedFicha.instrucoesEmpratamento && (
                                                <div className="glass-panel p-8 rounded-[32px] border border-white/5 space-y-4">
                                                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-2">
                                                        <Utensils size={14} /> Empratamento
                                                    </h4>
                                                    <div className="text-white/70 text-sm leading-relaxed font-medium">
                                                        {selectedFicha.instrucoesEmpratamento}
                                                    </div>
                                                    {selectedFicha.loucaRecomendada && (
                                                        <div className="pt-4 border-t border-white/5">
                                                            <p className="text-[9px] text-white/30 uppercase font-black mb-1">Louça Recomendada:</p>
                                                            <p className="text-white/80 text-xs font-bold">{selectedFicha.loucaRecomendada}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
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
        foto: initialData.foto || null,
        ingredientes: initialData.ingredientes || [
            { id: Date.now(), nome: '', qtdBruta: 0, fatorCorrecao: 1, precoCompra: 0, unidadeCompra: 'kg' }
        ],
        ...initialData
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({ ...form, foto: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

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

            {/* Bloco 1.5: Upload de Foto */}
            <div className="glass-panel p-8 rounded-[32px] border border-white/5 bg-white/[0.01]">
                <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.4em] mb-6">Fotografia do Prato</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="photo-upload"
                        />
                        <label
                            htmlFor="photo-upload"
                            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:border-primary/30 transition-all group"
                        >
                            {form.foto ? (
                                <div className="relative w-full">
                                    <img src={form.foto} className="w-full h-48 object-cover rounded-2xl" alt="Preview" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                        <p className="text-white font-black text-sm uppercase">Trocar Fotografia</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <ImageIcon size={40} className="text-white/20 mb-4" />
                                    <p className="text-white/60 font-bold text-sm">Clique para adicionar uma foto</p>
                                    <p className="text-white/20 text-xs mt-2">JPG, PNG, WEBP até 5MB</p>
                                </>
                            )}
                        </label>
                    </div>
                    {form.foto && (
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, foto: null })}
                                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all font-bold text-xs uppercase flex items-center gap-2"
                            >
                                <X size={14} /> Remover Foto
                            </button>
                        </div>
                    )}
                </div>
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
