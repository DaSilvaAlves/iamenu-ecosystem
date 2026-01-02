import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, MoreVertical, LayoutGrid, List as ListIcon, Trash2, Edit3, Package } from 'lucide-react';
import DataManager from '../utils/DataManager';

const ProductsView = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('Todas');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    useEffect(() => {
        const data = DataManager.getProducts();
        if (data.length === 0) {
            // Mock data for demonstration if empty
            setProducts([
                { nome: 'Hambúrguer Gourmet', categoria: 'Main Course', preco: 12.99, custo: 4.50, stock: 50, status: 'Ativo' },
                { nome: 'Pizza Margherita', categoria: 'Main Course', preco: 14.50, custo: 5.20, stock: 30, status: 'Ativo' },
                { nome: 'Salada Caesar', categoria: 'Salads', preco: 9.99, custo: 2.80, stock: 25, status: 'Ativo' },
                { nome: 'Salmão Grelhado', categoria: 'Main Course', preco: 18.00, custo: 7.50, stock: 15, status: 'Baixo Stock' }
            ]);
        } else {
            setProducts(data);
        }
    }, []);

    const categories = ['Todas', ...new Set(products.map(p => p.categoria))];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'Todas' || p.categoria === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 space-y-8 max-w-7xl mx-auto"
        >
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-8 rounded-[32px] border border-white/10">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">Gestão de Produtos</h2>
                    <p className="text-white/40 text-sm font-medium">Controla o teu menu e inventário com precisão.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-black rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    <Plus size={20} strokeWidth={3} />
                    ADICIONAR PRODUTO
                </button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 gap-4 w-full md:w-auto">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Pesquisar no menu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
                        />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-primary/50 transition-all cursor-pointer"
                    >
                        {categories.map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
                    </select>
                </div>

                <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                    <button
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white/10 text-primary' : 'text-white/40 hover:text-white'}`}
                    >
                        <ListIcon size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white/10 text-primary' : 'text-white/40 hover:text-white'}`}
                    >
                        <LayoutGrid size={20} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {viewMode === 'table' ? (
                <div className="glass-panel overflow-hidden border border-white/10 rounded-[32px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-white/40 font-black">
                                    <th className="px-8 py-6">Produto</th>
                                    <th className="px-6 py-6">Categoria</th>
                                    <th className="px-6 py-6 text-right">Preço / Custo</th>
                                    <th className="px-6 py-6 text-center">Margem</th>
                                    <th className="px-6 py-6">Stock</th>
                                    <th className="px-8 py-6 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredProducts.map((p, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
                                                    <Package size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">{p.nome}</p>
                                                    <p className="text-[10px] font-black text-white/20">SKU-{1000 + i}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-xs font-bold text-white/50 bg-white/5 px-2 py-1 rounded-md">{p.categoria}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right font-mono">
                                            <p className="text-sm font-black text-white">€{p.preco.toFixed(2)}</p>
                                            <p className="text-[10px] text-white/30">C: €{p.custo.toFixed(2)}</p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="inline-flex items-center gap-1 text-xs font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">
                                                {(((p.preco - p.custo) / p.preco) * 100).toFixed(0)}%
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1 w-24">
                                                <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter text-white/30">
                                                    <span>Nível</span>
                                                    <span>{p.stock}un</span>
                                                </div>
                                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${p.stock < 20 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]'}`}
                                                        style={{ width: `${Math.min(p.stock, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-all border border-white/10">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500/60 hover:text-red-500 transition-all border border-red-500/10">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((p, i) => (
                        <motion.div
                            key={i}
                            layout
                            className="glass-panel p-6 border border-white/10 rounded-[32px] hover:scale-[1.02] transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-2xl text-primary">
                                    <Package size={24} />
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-white">€{p.preco.toFixed(2)}</p>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">{p.categoria}</p>
                                </div>
                            </div>
                            <h4 className="text-lg font-bold text-white mb-6 leading-tight">{p.nome}</h4>
                            <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                <div>
                                    <p className="text-[10px] font-black text-white/30 uppercase">Stock</p>
                                    <p className={`text-sm font-black ${p.stock < 20 ? 'text-red-500' : 'text-primary'}`}>{p.stock} unidades</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-white/30 uppercase">Margem</p>
                                    <p className="text-sm font-black text-green-500">{(((p.preco - p.custo) / p.preco) * 100).toFixed(0)}%</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default ProductsView;
