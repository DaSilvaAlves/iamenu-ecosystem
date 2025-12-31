import React, { useState, useEffect } from 'react';

// Note: The parent component is expected to provide framer-motion's Motion component if animations are desired.
// This component will be static as per the mockup's structure.

// A simple spinner component for loading states, styled to fit the design
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
    </div>
);

// Updated SupplierCard to match the detailed mockup design
const SupplierCard = ({ offer, product, isBest }) => {
    const formatPrice = (price) => {
        if (!price || isNaN(parseFloat(price))) return 'N/A';
        return parseFloat(price).toFixed(2).replace('.', ',');
    };

    const price = formatPrice(offer.price);
    const [integerPart, decimalPart] = price.split(',');

    return (
        <div className={`bg-surface-card rounded-xl border ${isBest ? 'border-brand-orange shadow-lg shadow-brand-orange/5' : 'border-border-dark'} overflow-hidden flex flex-col relative transform hover:-translate-y-1 transition-transform duration-300`}>
            {isBest && (
                <div className="bg-brand-orange text-white text-[10px] font-bold py-1 px-3 absolute top-0 right-0 rounded-bl-lg uppercase tracking-wider z-10">
                    Melhor Opção #1
                </div>
            )}
            <div className={`p-6 border-b border-border-dark ${isBest ? 'bg-[#1A1A1A]' : ''}`}>
                <div className="flex items-center gap-4 mb-5">
                    <div className="size-12 rounded-lg bg-[#2A2A2A] flex items-center justify-center p-2 border border-border-dark">
                        {offer.supplierLogo ?
                            <img src={offer.supplierLogo} alt={offer.supplierName} className="object-contain max-h-full max-w-full"/>
                            : <span className="material-symbols-outlined text-text-secondary">storefront</span>
                        }
                    </div>
                    <div>
                        <h4 className="font-bold text-lg leading-tight text-white">{offer.supplierName}</h4>
                        {/* Rating can be added from API if available */}
                        <div className="flex items-center gap-1 mt-1">
                            <div className="h-1.5 w-16 bg-[#333] rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 w-[90%]"></div>
                            </div>
                            <span className="text-xs text-text-secondary ml-1">4.5</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1 mb-2">
                    <span className="text-xs text-text-secondary font-bold uppercase tracking-wider">Preço Normalizado</span>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-black ${isBest ? 'text-brand-orange' : 'text-white'} tracking-tight`}>€{integerPart},{decimalPart}</span>
                        <span className="text-sm font-medium text-text-secondary">/ {offer.unit || product.unit}</span>
                    </div>
                </div>
                 {/* This part can be made dynamic if API provides packaging info */}
                <p className="text-xs text-text-secondary">Emb. {offer.minQuantity}kg • Total: €{formatPrice(offer.price * offer.minQuantity)}</p>
            </div>
            <div className="p-6 flex-1 flex flex-col gap-5 bg-surface-card">
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-text-secondary flex items-center gap-1"><span className="material-symbols-outlined text-sm">inventory_2</span> MOQ</span>
                        <span className="text-sm font-semibold text-white">{offer.minQuantity} {offer.unit || product.unit}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-text-secondary flex items-center gap-1"><span className="material-symbols-outlined text-sm">payments</span> Pagamento</span>
                         {/* Static for now, can be from API */}
                        <span className="text-sm font-semibold text-white">Pronto</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-text-secondary flex items-center gap-1"><span className="material-symbols-outlined text-sm">local_shipping</span> Entrega</span>
                        <span className={`text-sm font-bold ${offer.deliveryIncluded ? 'text-green-500' : 'text-white'}`}>{offer.deliveryIncluded ? 'Grátis' : 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-text-secondary flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_clock</span> Prazo</span>
                         {/* Static for now, can be from API */}
                        <span className="text-sm font-semibold text-white">24h-48h</span>
                    </div>
                </div>
                <div className="mt-2 pt-4 border-t border-border-dark">
                     {/* History chart can be implemented later */}
                </div>
                <button className={`w-full mt-auto py-3 ${isBest ? 'bg-brand-orange hover:bg-orange-600' : 'bg-[#2A2A2A] hover:bg-[#333] border border-border-dark'} text-white font-bold rounded-lg shadow-lg ${isBest ? 'shadow-brand-orange/20' : ''} transition-all flex items-center justify-center gap-2`}>
                    <span>Adicionar</span>
                    <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                </button>
            </div>
        </div>
    );
};


const ComparisonTab = () => {
    const [searchTerm, setSearchTerm] = useState('Peito de Frango');
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
            const response = await fetch(`http://localhost:3002/api/v1/marketplace/products/compare?search=${encodeURIComponent(searchTerm.trim())}`);
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            const mainProduct = data.length > 0 ? data[0] : null;

            if (mainProduct && mainProduct.offers.length > 0) {
                const validOffers = mainProduct.offers.filter(o => o.price && parseFloat(o.price) > 0);
                
                const prices = validOffers.map(o => parseFloat(o.price));
                const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
                const bestPrice = prices.length > 0 ? Math.min(...prices) : 0;
                
                setProducts([mainProduct]);
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
            setError(e.message || 'Falha ao buscar produtos. Verifique a consola.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        handleSearch();
    }, []);

    const mainProduct = products.length > 0 ? products[0] : null;
    const bestOffer = mainProduct ? mainProduct.offers.reduce((best, current) => (parseFloat(current.price) < parseFloat(best.price) ? current : best), mainProduct.offers[0]) : null;

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-white text-3xl md:text-4xl font-bold uppercase italic tracking-wide">
                        COMPARADOR <span className="text-brand-orange">DE PREÇOS</span>
                    </h1>
                    <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">Analise e compare ofertas para o seu inventário.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleSearch} disabled={loading} className="flex items-center justify-center rounded-md h-9 px-4 bg-[#1E1E1E] border border-border-dark text-white text-sm font-medium hover:bg-[#2a2a2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <span className={`material-symbols-outlined mr-2 text-lg ${loading ? 'animate-spin' : ''}`}>{loading ? 'autorenew' : 'refresh'}</span>
                        {loading ? 'A Pesquisar...' : 'Atualizar'}
                    </button>
                    <button className="flex items-center justify-center rounded-md h-9 px-4 bg-brand-orange text-white text-sm font-bold shadow-lg shadow-brand-orange/20 hover:bg-orange-600 transition-colors">
                        <span className="material-symbols-outlined mr-2 text-lg">history</span>
                        Histórico
                    </button>
                </div>
            </div>
            
            <div className="bg-surface-card rounded-b-xl rounded-tr-xl border border-border-dark p-5 flex flex-col md:flex-row gap-4 items-start md:items-center -mt-2">
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

            {loading && <LoadingSpinner />}
            
            {error && <div className="text-center p-8 bg-surface-card rounded-xl border border-red-500/50"><p className="text-red-400">{error}</p></div>}

            {!loading && !error && !mainProduct && (
                <div className="text-center p-8 bg-surface-card rounded-xl border border-border-dark">
                    <p className="text-text-secondary">Nenhum produto encontrado para "{searchTerm}".</p>
                    <p className="text-text-secondary text-xs mt-1">Tente um termo de pesquisa diferente.</p>
                </div>
            )}
            
            {!loading && !error && mainProduct && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-surface-card rounded-xl p-6 border border-border-dark">
                            <div className="flex justify-between items-start mb-4">
                                <div className="size-10 rounded-lg bg-[#2A2A2A] flex items-center justify-center text-text-secondary"><span className="material-symbols-outlined text-2xl">analytics</span></div>
                            </div>
                            <p className="text-white text-3xl font-bold mb-1">{stats.avgPrice > 0 ? `€${stats.avgPrice.toFixed(2)}` : 'N/A'}</p>
                            <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">Média de Mercado ({mainProduct.unit})</p>
                        </div>
                        <div className="bg-surface-card rounded-xl p-6 border border-border-dark">
                            <div className="flex justify-between items-start mb-4">
                                <div className="size-10 rounded-lg bg-[#2A2A2A] flex items-center justify-center text-brand-orange"><span className="material-symbols-outlined text-2xl">savings</span></div>
                            </div>
                            <p className="text-white text-3xl font-bold mb-1">{stats.bestPrice > 0 ? `€${stats.bestPrice.toFixed(2)}` : 'N/A'}</p>
                            <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">Melhor Preço ({mainProduct.unit})</p>
                        </div>
                        <div className="bg-surface-card rounded-xl p-6 border border-border-dark">
                            <div className="flex justify-between items-start mb-4">
                                <div className="size-10 rounded-lg bg-[#2A2A2A] flex items-center justify-center text-text-secondary"><span className="material-symbols-outlined text-2xl">trending_down</span></div>
                            </div>
                            <p className="text-white text-3xl font-bold mb-1">{stats.potentialSaving > 0 ? `€${stats.potentialSaving.toFixed(2)}` : 'N/A'}</p>
                            <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">Poupança Potencial ({mainProduct.unit})</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            <span className="size-2 rounded-full bg-brand-orange"></span>
                            <h3 className="text-xl font-bold text-white uppercase tracking-wide">Comparação de Fornecedores</h3>
                        </div>
                        <span className="bg-[#2A2A2A] text-text-secondary text-xs font-bold px-3 py-1 rounded-full border border-border-dark">{mainProduct.offers.length} Opções Encontradas</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {mainProduct.offers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).map(offer => (
                            <SupplierCard key={offer.supplierId} offer={offer} product={mainProduct} isBest={offer.supplierId === bestOffer?.supplierId} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ComparisonTab;
