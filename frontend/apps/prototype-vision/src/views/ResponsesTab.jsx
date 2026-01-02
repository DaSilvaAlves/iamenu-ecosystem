import React from 'react';
import { motion } from 'framer-motion';

const ResponsesTab = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary tracking-widest uppercase">RFQ MARKETPLACE</span>
                        <div className="h-px w-8 bg-border-dark"></div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white italic tracking-tight uppercase" style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic" }}>
                        Respostas: RFQ #3920
                    </h1>
                    <p className="text-text-muted mt-2 max-w-2xl">
                        Análise detalhada das propostas recebidas para <span className="text-white font-medium">Carne de Novilho (50kg)</span>.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center px-4 py-2 bg-background-input rounded-lg border border-border-dark text-sm text-text-muted">
                        <span className="size-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        Status: Aberto
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-background-card border border-border-dark hover:border-primary text-white text-sm font-medium rounded-lg transition-all shadow-lg hover:shadow-primary/20 group">
                        <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">refresh</span>
                        <span>Atualizar</span>
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        <span>Exportar Relatório</span>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background-card border border-border-dark rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="size-10 rounded-lg bg-background-input flex items-center justify-center text-text-muted group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">assignment</span>
                        </div>
                        <span className="px-2 py-0.5 bg-green-900/30 text-green-400 text-xs font-medium rounded border border-green-900/50 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">arrow_outward</span> +2
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-4xl font-bold text-white">5</span>
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Propostas</span>
                    </div>
                    <div className="mt-4 text-xs text-text-muted">
                        2 fornecedores responderam hoje
                    </div>
                </div>
                <div className="bg-background-card border border-border-dark rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-primary">savings</span>
                    </div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="size-10 rounded-lg bg-background-input flex items-center justify-center text-text-muted group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded border border-primary/30 flex items-center gap-1">
                            Melhor Oferta
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-4xl font-bold text-white">€450.00</span>
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Melhor Preço Total</span>
                    </div>
                    <div className="mt-4 text-xs text-text-muted">
                        €12.50 abaixo da média do mercado
                    </div>
                </div>
                <div className="bg-background-card border border-border-dark rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="size-10 rounded-lg bg-background-input flex items-center justify-center text-text-muted group-hover:text-white transition-colors">
                            <span className="material-symbols-outlined">local_shipping</span>
                        </div>
                        <span className="px-2 py-0.5 bg-background-input text-text-muted text-xs font-medium rounded border border-border-dark">
                            Rápido
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-4xl font-bold text-white">24h</span>
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Entrega Recorde</span>
                    </div>
                    <div className="mt-4 text-xs text-text-muted">
                        Fornecedor: Distribuidora Lisboa
                    </div>
                </div>
            </div>
            <div className="bg-gradient-to-r from-[#1f1a18] to-background-card border border-border-dark rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
                <div className="flex items-start gap-4 z-10">
                    <div className="size-12 md:size-14 rounded-xl bg-gradient-to-br from-yellow-600/20 to-yellow-900/20 border border-yellow-700/30 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-yellow-500 text-3xl">emoji_events</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl md:text-2xl font-bold text-white">MELHOR PROPOSTA</h2>
                            <span className="bg-yellow-900/30 text-yellow-500 text-[10px] font-bold px-2 py-1 rounded border border-yellow-700/30 uppercase">Recomendado pela IA</span>
                        </div>
                        <p className="text-text-muted text-sm max-w-xl">
                            A <span className="text-white font-medium">Distribuidora Lisboa</span> oferece o melhor equilíbrio entre preço e prazo de entrega.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4 z-10 w-full md:w-auto">
                    <div className="flex flex-col items-end mr-4">
                        <span className="text-xs text-text-secondary uppercase">Poupança Estimada</span>
                        <span className="text-xl font-bold text-green-500">€20.00</span>
                    </div>
                    <button className="w-full md:w-auto px-5 py-3 bg-white text-black hover:bg-gray-200 font-bold text-sm rounded-lg transition-colors shadow-lg">
                        Aceitar Recomendação
                    </button>
                </div>
            </div>
            <div className="bg-background-card border border-border-dark rounded-xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-border-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-primary rounded-full"></div>
                        <h3 className="font-bold text-lg text-white">Tabela Comparativa</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-3 py-1.5 text-xs font-medium text-text-muted bg-background-input border border-border-dark rounded hover:bg-white/5 transition-colors">
                            Filtrar por Preço
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium text-text-muted bg-background-input border border-border-dark rounded hover:bg-white/5 transition-colors">
                            Status
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-input/50 border-b border-border-dark text-text-secondary text-xs uppercase tracking-wider font-semibold">
                                <th className="px-6 py-4 min-w-[220px]">Fornecedor</th>
                                <th className="px-6 py-4">Preço Total</th>
                                <th className="px-6 py-4">Preço / Kg</th>
                                <th className="px-6 py-4 min-w-[180px]">Condições</th>
                                <th className="px-6 py-4 min-w-[200px]">Observações</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right min-w-[180px]">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark">
                            <tr className="bg-primary/5 hover:bg-primary/10 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden shrink-0">
                                            <img alt="Distribuidora Lisboa Logo" className="w-full h-full object-cover rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfQKBaCWCwz_Cuzx-Y1_F9tg1r34xs5H203IeNmlnWpOggRlffEZAwd8DWbPm4T5TLIFX6cuqb4pv2gmlaDtaTVStSfS74rZGCvE5tGaLdJaZKTCsYaDTofH-vV-9t3BfW7rTmrRoRXsvnwr_VytcANtT-CFxyinpLStmKEHgmdSEgTc7EXboW1lowLz-rbQBDRwIa6WIv2iVszrqZta6p1HFuOm3A"/>
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">Distribuidora Lisboa</p>
                                            <div className="flex items-center gap-1 text-xs text-yellow-500 mt-0.5">
                                                <span className="material-symbols-outlined text-[14px] icon-filled">star</span>
                                                <span className="font-medium text-text-secondary">4.8</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="text-base font-bold text-green-400">€450.00</p>
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-primary mt-1 inline-block">Melhor Preço</span>
                                </td>
                                <td className="px-6 py-5 text-sm text-text-muted font-mono">€9.00 /kg</td>
                                <td className="px-6 py-5 text-xs text-text-muted">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-text-secondary">calendar_today</span> Net 30 dias</span>
                                        <span className="flex items-center gap-1.5 text-white"><span className="material-symbols-outlined text-[14px] text-primary">bolt</span> Entrega 24h</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-xs text-text-muted">
                                    <p className="line-clamp-2 leading-relaxed">Carne fresca certificada. Origem nacional (Alentejo).</p>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="inline-flex items-center gap-1.5 rounded bg-yellow-900/20 border border-yellow-700/30 px-2 py-1 text-xs font-bold text-yellow-500 uppercase tracking-wide">
                                        Pendente
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex justify-end gap-2">
                                        <button className="px-3 py-1.5 rounded-md border border-border-dark text-text-muted hover:text-white text-xs font-bold hover:bg-white/5 transition-colors">
                                            Negociar
                                        </button>
                                        <button className="px-3 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors shadow-lg shadow-primary/10">
                                            Aceitar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-background-input/30 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-purple-400 font-bold text-sm shrink-0 border border-border-dark">
                                            FB
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">Fresco &amp; Bom</p>
                                            <div className="flex items-center gap-1 text-xs text-yellow-500 mt-0.5">
                                                <span className="material-symbols-outlined text-[14px] icon-filled">star</span>
                                                <span className="font-medium text-text-secondary">4.5</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="text-base font-bold text-white">€470.00</p>
                                </td>
                                <td className="px-6 py-5 text-sm text-text-muted font-mono">€9.40 /kg</td>
                                <td className="px-6 py-5 text-xs text-text-muted">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-text-secondary">payments</span> Pronto Pgto.</span>
                                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-text-secondary">schedule</span> Entrega 48h</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-xs text-text-muted">
                                    <p className="line-clamp-2 leading-relaxed">Inclui corte personalizado gratuito.</p>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="inline-flex items-center gap-1.5 rounded bg-blue-900/20 border border-blue-700/30 px-2 py-1 text-xs font-bold text-blue-400 uppercase tracking-wide">
                                        Negociação
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button className="px-3 py-1.5 rounded-md border border-border-dark text-text-muted hover:text-white text-xs font-bold hover:bg-white/5 transition-colors">
                                            Continuar
                                        </button>
                                        <button className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors border border-border-dark">
                                            Aceitar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-background-input/30 transition-colors group relative">
                                <td className="px-6 py-5 relative">
                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-primary font-bold text-sm shrink-0 border border-border-dark">
                                            CS
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm flex items-center gap-2">
                                                Carnes do Sul
                                                <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded font-bold uppercase">Novo</span>
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-yellow-500 mt-0.5">
                                                <span className="material-symbols-outlined text-[14px] icon-filled">star</span>
                                                <span className="font-medium text-text-secondary">4.2</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="text-base font-bold text-white">€460.00</p>
                                </td>
                                <td className="px-6 py-5 text-sm text-text-muted font-mono">€9.20 /kg</td>
                                <td className="px-6 py-5 text-xs text-text-muted">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-text-secondary">percent</span> 50% Adiant.</span>
                                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-text-secondary">schedule</span> 3 dias</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-xs text-text-muted">
                                    <p className="line-clamp-2 leading-relaxed">Stock limitado. Confirmar até amanhã.</p>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="inline-flex items-center gap-1.5 rounded bg-yellow-900/20 border border-yellow-700/30 px-2 py-1 text-xs font-bold text-yellow-500 uppercase tracking-wide">
                                        Pendente
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button className="px-3 py-1.5 rounded-md border border-border-dark text-text-muted hover:text-white text-xs font-bold hover:bg-white/5 transition-colors">
                                            Negociar
                                        </button>
                                        <button className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors border border-border-dark">
                                            Aceitar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr className="hover:bg-background-input/30 transition-colors group">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-gray-400 font-bold text-sm shrink-0 border border-border-dark">
                                            M
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-sm">Makro Food Service</p>
                                            <div className="flex items-center gap-1 text-xs text-yellow-500 mt-0.5">
                                                <span className="material-symbols-outlined text-[14px] icon-filled">star</span>
                                                <span className="font-medium text-text-secondary">4.9</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <p className="text-base font-bold text-white">€485.00</p>
                                </td>
                                <td className="px-6 py-5 text-sm text-text-muted font-mono">€9.70 /kg</td>
                                <td className="px-6 py-5 text-xs text-text-muted">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-text-secondary">calendar_today</span> Net 60 dias</span>
                                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-text-secondary">event</span> Agendada</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-xs text-text-muted">
                                    <p className="line-clamp-2 leading-relaxed">Produto standard. Embalagem a vácuo industrial.</p>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="inline-flex items-center gap-1.5 rounded bg-gray-800 border border-gray-700 px-2 py-1 text-xs font-bold text-gray-400 uppercase tracking-wide">
                                        Lida
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button className="px-3 py-1.5 rounded-md border border-border-dark text-text-muted hover:text-white text-xs font-bold hover:bg-white/5 transition-colors">
                                            Negociar
                                        </button>
                                        <button className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors border border-border-dark">
                                            Aceitar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default ResponsesTab;
