import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// A simple spinner component for loading states
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
    </div>
);

// Component for individual supplier offer cards
const SupplierCard = ({ offer, product, isBestOffer }) => {
    const formatPrice = (price) => {
        if (!price || isNaN(parseFloat(price))) return 'N/A';
        return `€${parseFloat(price).toFixed(2)}`;
    };

    return (
        <div className={`bg-surface-card rounded-xl border ${isBestOffer ? 'border-brand-orange shadow-lg shadow-brand-orange/5' : 'border-border-dark'} overflow-hidden flex flex-col relative transform hover:-translate-y-1 transition-transform duration-300`}>
            {isBestOffer && (
                <div className="bg-brand-orange text-white text-[10px] font-bold py-1 px-3 absolute top-0 right-0 rounded-bl-lg uppercase tracking-wider z-10">
                    Melhor Opção
                </div>
            )}
            <div className={`p-6 border-b border-border-dark ${isBestOffer ? 'bg-[#1A1A1A]' : ''}`}>
                <div className="flex items-center gap-4 mb-5">
                    <div className="size-12 rounded-lg bg-[#2A2A2A] flex items-center justify-center p-2 border border-border-dark">
                        {offer.supplierLogo ? (
                            <img src={offer.supplierLogo} alt={offer.supplierName} className="object-contain w-full h-full" />
                        ) : (
                            <span className="material-symbols-outlined text-text-secondary">storefront</span>
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg leading-tight text-white">{offer.supplierName}</h4>
                        {/* Rating can be added later if available in API */}
                    </div>
                </div>
                <div className="flex flex-col gap-1 mb-2">
                    <span className="text-xs text-text-secondary font-bold uppercase tracking-wider">Preço Normalizado</span>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-black ${isBestOffer ? 'text-brand-orange' : 'text-white'} tracking-tight`}>{formatPrice(offer.price)}</span>
                        <span className="text-sm font-medium text-text-secondary">/ {offer.unit || product.unit}</span>
                    </div>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col gap-5 bg-surface-card">
                 {/* Details like MOQ, payment, etc. can be added here if available */}
                <button className={`w-full mt-auto py-3 ${isBestOffer ? 'bg-brand-orange hover:bg-orange-600 shadow-lg shadow-brand-orange/20' : 'bg-[#2A2A2A] hover:bg-[#333] border border-border-dark'} text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2`}>
                    <span>Adicionar</span>
                    <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                </button>
            </div>
        </div>
    );
};


const ComparisonTab = () => {
    const [searchTerm, setSearchTerm] = useState('Bife da Vazia');
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ avgPrice: 0, bestPrice: 0, potentialSaving: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!searchTerm || searchTerm.trim().length < 3) {
            setError('O termo de pesquisa deve ter pelo menos 3 caracteres.');
            setProducts([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // NOTE: Using the temporarily modified endpoint that ignores the search term.
            // When the backend is reverted, this will work as a normal search.
            const response = await fetch(`http://localhost:3002/api/v1/marketplace/products/compare?search=${encodeURIComponent(searchTerm.trim())}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // We'll focus on the first product found for this simplified example
            const mainProduct = data.length > 0 ? data[0] : null;

            if (mainProduct && mainProduct.offers.length > 0) {
                const validOffers = mainProduct.offers.filter(o => o.price && parseFloat(o.price) > 0);
                
                const prices = validOffers.map(o => parseFloat(o.price));
                const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
                const bestPrice = Math.min(...prices);
                
                setProducts([mainProduct]); // Displaying offers for the first product
                setStats({
                    avgPrice,
                    bestPrice,
                    potentialSaving: avgPrice - bestPrice,
                });

            } else {
                setProducts([]);
                setStats({ avgPrice: 0, bestPrice: 0, potentialSaving: 0 });
            }

        } catch (e) {
            console.error("Failed to fetch products:", e);
            setError('Falha ao buscar produtos. Verifique a consola para mais detalhes.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };
    
    // Initial search on component load
    useEffect(() => {
        handleSearch();
    }, []);

    const mainProduct = products.length > 0 ? products[0] : null;
    const bestOffer = mainProduct ? mainProduct.offers.reduce((best, current) => (parseFloat(current.price) < parseFloat(best.price) ? current : best), mainProduct.offers[0]) : null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto flex flex-col gap-8 pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-white text-3xl md:text-4xl font-bold uppercase italic tracking-wide">
                        COMPARADOR <span className="text-brand-orange">DE PREÇOS</span>
                    </h1>
                    <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">Analise e compare ofertas para o seu inventário.</p>
                </div>
                 <button onClick={handleSearch} disabled={loading} className="flex items-center justify-center rounded-md h-9 px-4 bg-[#1E1E1E] border border-border-dark text-white text-sm font-medium hover:bg-[#2a2a2a] transition-colors disabled:opacity-50">
                    <span className={`material-symbols-outlined mr-2 text-lg ${loading ? 'animate-spin' : ''}`}>
                        {loading ? 'autorenew' : 'refresh'}
                    </span>
                    {loading ? 'A Atualizar...' : 'Atualizar'}
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-surface-card rounded-xl border border-border-dark p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative flex-1 w-full">
                    <div className="flex w-full items-center rounded-lg bg-[#0E0E0E] border border-border-dark h-12 px-4 focus-within:ring-1 focus-within:ring-brand-orange transition-shadow">
                        <span className="material-symbols-outlined text-text-secondary text-2xl">search</span>
                        <input 
                            className="w-full bg-transparent border-none text-white placeholder:text-text-secondary focus:ring-0 text-base font-medium ml-2" 
                            placeholder="Buscar produto..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="text-text-secondary hover:text-brand-orange transition-colors">
                                <span className="material-symbols-outlined text-xl">cancel</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-card rounded-xl p-6 border border-border-dark">
                    <p className="text-white text-3xl font-bold mb-1">{stats.avgPrice > 0 ? `€${stats.avgPrice.toFixed(2)}` : 'N/A'}</p>
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">Média de Mercado (/kg)</p>
                </div>
                <div className="bg-surface-card rounded-xl p-6 border border-border-dark">
                    <p className="text-white text-3xl font-bold mb-1">{stats.bestPrice > 0 ? `€${stats.bestPrice.toFixed(2)}` : 'N/A'}</p>
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">Melhor Preço (/kg)</p>
                </div>
                <div className="bg-surface-card rounded-xl p-6 border border-border-dark">
                    <p className="text-white text-3xl font-bold mb-1">{stats.potentialSaving > 0 ? `€${stats.potentialSaving.toFixed(2)}` : 'N/A'}</p>
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">Poupança Potencial (/kg)</p>
                </div>
            </div>

            {/* Content Area */}
            {loading && <LoadingSpinner />}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!loading && !error && mainProduct && (
                 <>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            <span className="size-2 rounded-full bg-brand-orange"></span>
                            <h3 className="text-xl font-bold text-white uppercase tracking-wide">Comparação de Fornecedores para: {mainProduct.name}</h3>
                        </div>
                        <span className="bg-[#2A2A2A] text-text-secondary text-xs font-bold px-3 py-1 rounded-full border border-border-dark">{mainProduct.offers.length} Opções Encontradas</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                       {mainProduct.offers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).map(offer => (
                           <SupplierCard key={offer.supplierId} offer={offer} product={mainProduct} isBestOffer={offer.supplierId === bestOffer?.supplierId} />
                       ))}
                    </div>
                </>
            )}
             {!loading && !error && !mainProduct && (
                <div className="text-center p-8 bg-surface-card rounded-xl border border-border-dark">
                    <p className="text-text-secondary">Nenhum produto encontrado. Tente um termo de pesquisa diferente.</p>
                </div>
            )}
        </motion.div>
    );
};

export default ComparisonTab;
