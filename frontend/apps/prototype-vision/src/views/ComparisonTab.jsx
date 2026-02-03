import React, { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';

// A simple spinner component for loading states, styled to fit the design
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
    </div>
);

const StatsCard = ({ icon, label, value, trend, trend_label }) => (
    <div className="bg-surface-card rounded-xl p-6 border border-border relative overflow-hidden group hover:border-brand-orange/30 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className={`size-10 rounded-lg bg-[#2A2A2A] flex items-center justify-center ${icon === 'savings' ? 'text-brand-orange' : 'text-text-muted'}`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            {trend && (
                 <span className={`${trend > 0 ? 'text-green-500 bg-green-500/10' : 'text-brand-orange bg-brand-orange/10'} px-2 py-1 rounded text-xs font-bold flex items-center`}>
                    {trend_label || (trend > 0 && <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>)}
                    {trend < 0 && <span className="material-symbols-outlined text-xs mr-0.5">trending_down</span>}
                    {trend}%
                </span>
            )}
        </div>
        <p className="text-white text-3xl font-bold mb-1">{value}</p>
        <p className="text-text-muted text-xs font-bold uppercase tracking-wider">{label}</p>
    </div>
);

const SupplierCard = ({ offer, product, isBest, isSelected, onToggleOfferSelection }) => {
    const formatPrice = (price) => {
        if (!price || isNaN(parseFloat(price))) return 'N/A';
        return parseFloat(price).toFixed(2).replace('.', ',');
    };

    const price = formatPrice(offer.price);
    const [integerPart, decimalPart] = price.split(','); // Use this for split price display

    // History chart - now dynamic
    const renderHistoryChart = (priceHistory) => {
        if (!priceHistory || priceHistory.length === 0) {
            return (
                <div className="text-text-muted text-xs text-center py-2">
                    Sem histórico de preços
                </div>
            );
        }

        const prices = priceHistory.map(entry => entry.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        // Avoid division by zero if all prices are the same
        const priceRange = maxPrice - minPrice === 0 ? 1 : maxPrice - minPrice;

        return (
            <div className="h-8 w-full flex items-end justify-between gap-1 opacity-80">
                {priceHistory.map((entry, index) => {
                    const normalizedHeight = ((entry.price - minPrice) / priceRange) * 90 + 10; // Scale to 10-100%
                    const barColor = index === priceHistory.length - 1 ? 'bg-brand-orange' : 'bg-brand-orange/20'; // Highlight latest price

                    return (
                        <div
                            key={index}
                            className={`w-1/6 rounded-sm ${barColor} transition-all duration-300`}
                            style={{ height: `${normalizedHeight}%` }}
                            title={`Data: ${new Date(entry.date).toLocaleDateString()}, Preço: €${entry.price.toFixed(2)}`}
                        ></div>
                    );
                })}
            </div>
        );
    };


    return (
        <div className={`bg-surface-card rounded-xl border ${isBest ? 'border-brand-orange shadow-lg shadow-brand-orange/5' : 'border-border'} overflow-hidden flex flex-col relative transform hover:-translate-y-1 transition-transform duration-300`}>
            {isBest && (
                <div className="bg-brand-orange text-white text-[10px] font-bold py-1 px-3 absolute top-0 right-0 rounded-bl-lg uppercase tracking-wider z-10">
                    Melhor Opção #1
                </div>
            )}
            {/* Selection Checkbox */}
            <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleOfferSelection}
                className="absolute top-3 left-3 size-5 appearance-none rounded-md border border-border-dark checked:bg-brand-orange checked:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-surface-card cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`, backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
                title="Selecionar para comparação"
            />
            <div className={`p-6 border-b border-border ${isBest ? 'bg-[#1A1A1A]' : ''}`}>
                <div className="flex items-center gap-4 mb-5">
                    <div className="size-12 rounded-lg bg-[#2A2A2A] flex items-center justify-center p-2 border border-border">
                        {offer.supplierLogo ?
                            <img src={offer.supplierLogo} alt={offer.supplierName} className="object-contain max-h-full max-w-full"/>
                            : <span className="material-symbols-outlined text-text-muted">storefront</span>
                        }
                    </div>
                    <div>
                        <h4 className="font-bold text-lg leading-tight text-white">{offer.supplierName}</h4>
                        <div className="flex items-center gap-1 mt-1">
                            <div className="h-1.5 w-16 bg-[#333] rounded-full overflow-hidden">
                                {offer.Supplier?.ratingAvg !== undefined ? ( // Check if ratingAvg exists
                                    <div className="h-full bg-yellow-500" style={{ width: `${(offer.Supplier.ratingAvg / 5) * 100}%` }}></div>
                                ) : (
                                    <div className="h-full bg-gray-500" style={{ width: `0%` }}></div> // Fallback or empty state
                                )}
                            </div>
                            <span className="text-xs text-text-muted ml-1" title={`${offer.Supplier?.reviewCount || 0} avaliações`}>
                                {offer.Supplier?.ratingAvg !== undefined ? offer.Supplier.ratingAvg.toFixed(1) : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-1 mb-2">
                    <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Preço Normalizado</span>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-black ${isBest ? 'text-brand-orange' : 'text-white'} tracking-tight`}>€{integerPart},{decimalPart}</span>
                        <span className="text-sm font-medium text-text-muted">/ {offer.unit || product.unit}</span>
                    </div>
                </div>
                <p className="text-xs text-text-muted">Emb. {offer.minQuantity}{offer.unit || product.unit} • Total: €{formatPrice(offer.price * offer.minQuantity)}</p>
            </div>
            <div className="p-6 flex-1 flex flex-col gap-5 bg-surface-card">
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-text-muted flex items-center gap-1"><span className="material-symbols-outlined text-sm">inventory_2</span> MOQ</span>
                        <span className="text-sm font-semibold text-white">{offer.minQuantity} {offer.unit || product.unit}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-text-muted flex items-center gap-1"><span className="material-symbols-outlined text-sm">payments</span> Pagamento</span>
                        <span className="text-sm font-semibold text-white">{offer.Supplier?.paymentTerms || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-text-muted flex items-center gap-1"><span className="material-symbols-outlined text-sm">local_shipping</span> Entrega</span>
                        <span className={`text-sm font-bold ${offer.deliveryIncluded ? 'text-green-500' : 'text-white'}`}>{offer.deliveryIncluded ? 'Grátis' : 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-text-muted flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_clock</span> Prazo</span>
                        <span className="text-sm font-semibold text-white">{offer.Supplier?.deliveryFrequency || (offer.deliveryIncluded ? 'Incluída' : 'A combinar')}</span>
                    </div>
                </div>
                 <div className="mt-2 pt-4 border-t border-border">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-text-muted uppercase">Histórico 30D</span>
                        <span className={`text-xs font-bold ${offer.priceTrend === 'Increasing' ? 'text-red-500' : offer.priceTrend === 'Decreasing' ? 'text-green-500' : 'text-text-muted'}`}>
                            {offer.priceTrend}
                        </span>
                    </div>
                    {renderHistoryChart(offer.priceHistory)} {/* Render the dynamic history chart */}
                </div>
                <button className={`w-full mt-auto py-3 ${isBest ? 'bg-brand-orange hover:bg-orange-600' : 'bg-[#2A2A2A] hover:bg-[#333] border border-border'} text-white font-bold rounded-lg shadow-lg ${isBest ? 'shadow-brand-orange/20' : ''} transition-all flex items-center justify-center gap-2`}>
                    <span>Adicionar</span>
                    <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                </button>
            </div>
        </div>
    );
};


const ComparisonTab = () => {
    const [searchTerm, setSearchTerm] = useState('Peito de Frango'); // Initial search term from mockup
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ avgPrice: 0, bestPrice: 0, potentialSaving: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [availableFilters, setAvailableFilters] = useState([]); // New state for available filters
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [selectedOffers, setSelectedOffers] = useState([]);
    const [activeTab, setActiveTab] = useState('pesquisa'); // New state for active tab, default to 'pesquisa'
    
    // New states for advanced filters
    const [minPriceFilter, setMinPriceFilter] = useState('');
    const [maxPriceFilter, setMaxPriceFilter] = useState('');
    const [minMOQFilter, setMinMOQFilter] = useState('');
    const [deliveryIncludedFilter, setDeliveryIncludedFilter] = useState(false);
    const [paymentTermsFilter, setPaymentTermsFilter] = useState('');

    const handleSearch = async (advancedFilters = {}) => { // Accept advanced filters as an object
        if (!searchTerm || searchTerm.trim().length < 3) {
            setError('O termo de pesquisa deve ter pelo menos 3 caracteres.');
            setProducts([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const filtersQueryParam = selectedFilters.length > 0 ? `&filters=${selectedFilters.map(f => encodeURIComponent(f)).join(',')}` : '';
            
            // Add advanced filters to query parameters
            let advancedFiltersQuery = '';
            if (advancedFilters.minPrice) advancedFiltersQuery += `&minPrice=${advancedFilters.minPrice}`;
            if (advancedFilters.maxPrice) advancedFiltersQuery += `&maxPrice=${advancedFilters.maxPrice}`;
            if (advancedFilters.minMOQ) advancedFiltersQuery += `&minMOQ=${advancedFilters.minMOQ}`;
            if (advancedFilters.deliveryIncluded) advancedFiltersQuery += `&deliveryIncluded=true`;
            if (advancedFilters.paymentTerms) advancedFiltersQuery += `&paymentTerms=${encodeURIComponent(advancedFilters.paymentTerms)}`;

            const response = await fetch(`${API_CONFIG.MARKETPLACE_API}/products/compare?search=${encodeURIComponent(searchTerm.trim())}${filtersQueryParam}${advancedFiltersQuery}`);
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
                    potentialSaving: avgPrice > 0 && bestPrice > 0 ? avgPrice - bestPrice : 0,
                });

                // Extract unique filters from all products
                const uniqueCategories = new Set(data.map(p => p.category).filter(Boolean));
                const uniqueSubcategories = new Set(data.map(p => p.subcategory).filter(Boolean));
                const allUniqueFilters = [...uniqueCategories, ...uniqueSubcategories];
                setAvailableFilters(Array.from(new Set(allUniqueFilters))); // Ensure unique and convert to array

            } else {
                setProducts([]);
                setStats({ avgPrice: 0, bestPrice: 0, potentialSaving: 0 });
                setAvailableFilters([]); // Clear filters if no products
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
    }, [selectedFilters]); // Re-run search when selected filters change

    const mainProduct = products.length > 0 ? products[0] : null;
    const bestOffer = mainProduct ? mainProduct.offers.reduce((best, current) => (parseFloat(current.price) < parseFloat(best.price) ? current : best), mainProduct.offers[0]) : null;

    const handleToggleOfferSelection = (offerToToggle, productForOffer) => {
        // Create a unique identifier for the offer (supplierId + productId)
        const offerUniqueId = `${offerToToggle.supplierId}-${productForOffer.id}`;

        setSelectedOffers(prevSelectedOffers => {
            const isAlreadySelected = prevSelectedOffers.some(
                o => `${o.supplierId}-${o.productId}` === offerUniqueId
            );

            if (isAlreadySelected) {
                // Remove from selection
                return prevSelectedOffers.filter(
                    o => `${o.supplierId}-${o.productId}` !== offerUniqueId
                );
            } else {
                // Add to selection
                // Store the full offer object or just necessary parts
                return [...prevSelectedOffers, {
                    ...offerToToggle,
                    productId: productForOffer.id, // Ensure productId is on the offer object
                    productName: productForOffer.name // Add product name for context
                }];
            }
        });
    };

    const handleApplyAdvancedFilters = () => {
        const filtersToApply = {
            minPrice: minPriceFilter,
            maxPrice: maxPriceFilter,
            minMOQ: minMOQFilter,
            deliveryIncluded: deliveryIncludedFilter,
            paymentTerms: paymentTermsFilter,
        };
        handleSearch(filtersToApply);
        setActiveTab('pesquisa'); // Switch back to search tab after applying filters
    };


    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-20">
            {/* Header section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-white text-3xl md:text-4xl font-bold uppercase italic tracking-wide">
                        COMPARADOR <span className="text-brand-orange">DE PREÇOS</span>
                    </h1>
                    <p className="text-text-muted text-sm font-medium uppercase tracking-wider">Analise e compare ofertas para o seu inventário.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative inline-block text-left">
                        <button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#1E1E1E] border border-border rounded-md hover:bg-[#2a2a2a] focus:outline-none">
                            Esta Semana
                            <span className="material-symbols-outlined ml-2 -mr-1 text-lg">expand_more</span>
                        </button>
                    </div>
                    <button onClick={handleSearch} disabled={loading} className="flex items-center justify-center rounded-md h-9 px-4 bg-[#1E1E1E] border border-border text-white text-sm font-medium hover:bg-[#2a2a2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <span className={`material-symbols-outlined mr-2 text-lg ${loading ? 'animate-spin' : ''}`}>{loading ? 'autorenew' : 'refresh'}</span>
                        {loading ? 'A Atualizar...' : 'Atualizar'}
                    </button>
                    <button className="flex items-center justify-center rounded-md h-9 px-4 bg-brand-orange text-white text-sm font-bold shadow-lg shadow-brand-orange/20 hover:bg-orange-600 transition-colors">
                        <span className="material-symbols-outlined mr-2 text-lg">history</span>
                        Histórico
                    </button>
                </div>
            </div>
            
            <div className="border-b border-border"> {/* Use border-b on this container */}
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar -mb-px"> {/* remove pb-2, add -mb-px to overlap border */}
                    <button
                        onClick={() => setActiveTab('pesquisa')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-t-lg border-b-2 transition-colors ${activeTab === 'pesquisa' ? 'bg-brand-orange text-white border-brand-orange' : 'text-text-muted hover:text-white hover:bg-white/5 border-transparent hover:border-white/20'}`}
                    >
                        <span className="material-symbols-outlined text-lg">search</span>
                        Pesquisa
                    </button>
                    <button
                        onClick={() => setActiveTab('filtrosAvancados')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === 'filtrosAvancados' ? 'bg-brand-orange text-white border-brand-orange' : 'text-text-muted hover:text-white hover:bg-white/5 border-transparent hover:border-white/20'}`}
                    >
                        <span className="material-symbols-outlined text-lg">tune</span>
                        Filtros Avançados
                    </button>
                    <button
                        onClick={() => setActiveTab('favoritos')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === 'favoritos' ? 'bg-brand-orange text-white border-brand-orange' : 'text-text-muted hover:text-white hover:bg-white/5 border-transparent hover:border-white/20'}`}
                    >
                        <span className="material-symbols-outlined text-lg">favorite</span>
                        Favoritos
                    </button>
                </div>
            </div>
            {activeTab === 'pesquisa' && (
                <div className="bg-surface-card rounded-b-xl rounded-tr-xl border border-border p-5 flex flex-col gap-4 -mt-px">
                    <div className="relative flex-1 w-full">
                        <div className="flex w-full items-center rounded-lg bg-[#0E0E0E] border border-border h-12 px-4 focus-within:ring-1 focus-within:ring-brand-orange transition-shadow">
                            <span className="material-symbols-outlined text-text-muted text-2xl">search</span>
                            <input
                                className="flex-1 bg-transparent border-none text-white placeholder:text-text-muted focus:ring-0 text-base font-medium ml-2 min-w-[100px]"
                                placeholder="Buscar produto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="flex-shrink-0 text-text-muted hover:text-brand-orange transition-colors">
                                    <span className="material-symbols-outlined text-xl">cancel</span>
                                </button>
                            )}
                            {/* Dynamic filter tags */}
                            {availableFilters.length > 0 && (
                                <div className="flex flex-shrink-0 items-center gap-2 ml-2 max-w-full overflow-x-auto hide-scrollbar">
                                    {availableFilters.map(filter => {
                                        const isSelected = selectedFilters.includes(filter);
                                        const bgColor = isSelected ? 'bg-brand-orange' : 'bg-[#2A2A2A]';
                                        const textColor = isSelected ? 'text-white' : 'text-text-muted';
                                        const borderColor = isSelected ? 'border-brand-orange' : 'border-border';

                                        const handleTagClick = () => {
                                            setSelectedFilters(prev =>
                                                isSelected ? prev.filter(f => f !== filter) : [...prev, filter]
                                            );
                                        };

                                        return (
                                            <button
                                                key={filter}
                                                onClick={handleTagClick}
                                                className={`flex-shrink-0 flex h-7 items-center justify-center gap-x-1 rounded-full ${bgColor} border ${borderColor} ${textColor} pl-2 pr-1 text-xs font-medium transition-colors whitespace-nowrap`}
                                            >
                                                {filter}
                                                {isSelected && (
                                                    <span className="material-symbols-outlined text-base">close</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'filtrosAvancados' && (
                <div className="bg-surface-card rounded-b-xl rounded-tr-xl border border-border p-5 flex flex-col gap-4 -mt-px">
                    <h3 className="text-lg font-bold text-white">Filtros de Preço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="minPrice" className="text-text-muted text-sm">Preço Mínimo (€)</label>
                            <input
                                type="number"
                                id="minPrice"
                                className="w-full bg-[#0E0E0E] border border-border rounded-lg h-10 px-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                                value={minPriceFilter}
                                onChange={(e) => setMinPriceFilter(e.target.value)}
                                placeholder="Ex: 5.00"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="maxPrice" className="text-text-muted text-sm">Preço Máximo (€)</label>
                            <input
                                type="number"
                                id="maxPrice"
                                className="w-full bg-[#0E0E0E] border border-border rounded-lg h-10 px-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                                value={maxPriceFilter}
                                onChange={(e) => setMaxPriceFilter(e.target.value)}
                                placeholder="Ex: 50.00"
                            />
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-white mt-4">Outros Filtros</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="minMOQ" className="text-text-muted text-sm">Quantidade Mínima (MOQ)</label>
                            <input
                                type="number"
                                id="minMOQ"
                                className="w-full bg-[#0E0E0E] border border-border rounded-lg h-10 px-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                                value={minMOQFilter}
                                onChange={(e) => setMinMOQFilter(e.target.value)}
                                placeholder="Ex: 10"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="paymentTerms" className="text-text-muted text-sm">Termos de Pagamento</label>
                            <input
                                type="text"
                                id="paymentTerms"
                                className="w-full bg-[#0E0E0E] border border-border rounded-lg h-10 px-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-orange"
                                value={paymentTermsFilter}
                                onChange={(e) => setPaymentTermsFilter(e.target.value)}
                                placeholder="Ex: 30 dias"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                        <input
                            type="checkbox"
                            id="deliveryIncluded"
                            className="size-4 rounded border-border bg-[#0E0E0E] text-brand-orange focus:ring-brand-orange"
                            checked={deliveryIncludedFilter}
                            onChange={(e) => setDeliveryIncludedFilter(e.target.checked)}
                        />
                        <label htmlFor="deliveryIncluded" className="text-white text-sm">Entrega Incluída</label>
                    </div>

                    <button
                        onClick={handleApplyAdvancedFilters} // Will implement this function next
                        className="mt-6 w-full py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg shadow-brand-orange/20 transition-colors"
                    >
                        Aplicar Filtros Avançados
                    </button>
                </div>
            )}

            {activeTab === 'favoritos' && (
                <div className="bg-surface-card rounded-b-xl rounded-tr-xl border border-border p-5 flex flex-col gap-4 -mt-px text-text-muted text-center">
                    <p className="text-white text-lg font-bold">Funcionalidade de Favoritos</p>
                    <p>Para aceder aos seus produtos favoritos, é necessário iniciar sessão.</p>
                    <p className="text-sm">Esta funcionalidade será implementada juntamente com o sistema de autenticação de utilizadores.</p>
                    <button className="mt-4 py-2 px-4 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg shadow-brand-orange/20 transition-colors">
                        Iniciar Sessão
                    </button>
                    {/* Implement favorites listing here */}
                </div>
            )}
            
            {loading && <LoadingSpinner />}
            
            {error && <div className="text-center p-8 bg-surface-card rounded-xl border border-red-500/50"><p className="text-red-400">{error}</p></div>}

            {!loading && !error && !mainProduct && activeTab === 'pesquisa' && ( // Only show if on 'pesquisa' tab
                <div className="text-center p-8 bg-surface-card rounded-xl border border-border">
                    <p className="text-text-muted">Nenhum produto encontrado para "{searchTerm}".</p>
                    <p className="text-text-muted text-xs mt-1">Tente um termo de pesquisa diferente.</p>
                </div>
            )}
            
            {!loading && !error && mainProduct && activeTab === 'pesquisa' && ( // Only show if on 'pesquisa' tab
                <>
                    {/* Stats Cards section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatsCard icon="analytics" label={`Média de Mercado (${mainProduct.unit})`} value={stats.avgPrice > 0 ? `€${stats.avgPrice.toFixed(2)}` : 'N/A'} />
                        <StatsCard icon="savings" label={`Melhor Preço (${mainProduct.unit})`} value={stats.bestPrice > 0 ? `€${stats.bestPrice.toFixed(2)}` : 'N/A'} />
                        <StatsCard icon="trending_down" label={`Poupança Potencial (${mainProduct.unit})`} value={stats.potentialSaving > 0 ? `€${stats.potentialSaving.toFixed(2)}` : 'N/A'} />
                    </div>
                    
                    {/* Supplier Comparison Header */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                            <span className="size-2 rounded-full bg-brand-orange"></span>
                            <h3 className="text-xl font-bold text-white uppercase tracking-wide">Comparação de Fornecedores</h3>
                        </div>
                        <span className="bg-[#2A2A2A] text-text-muted text-xs font-bold px-3 py-1 rounded-full border border-border">{mainProduct.offers.length} Opções Encontradas</span>
                    </div>

                    {/* Dynamic Supplier Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {mainProduct.offers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).map(offer => (
                            <SupplierCard
                                key={offer.supplierId}
                                offer={offer}
                                product={mainProduct}
                                isBest={offer.supplierId === bestOffer?.supplierId}
                                isSelected={selectedOffers.some(o => o.supplierId === offer.supplierId && o.productId === mainProduct.id)}
                                onToggleOfferSelection={() => handleToggleOfferSelection(offer, mainProduct)}
                            />
                        ))}
                    </div>
                </>
            )}
            {/* Floating button for detailed comparison */}
            {selectedOffers.length > 0 && ( // Only show button if offers are selected
                <div className="fixed bottom-6 left-1/2 md:left-[calc(50%+8rem)] -translate-x-1/2 bg-[#1E1E1E] border border-brand-orange text-white px-6 py-3 rounded-xl shadow-2xl z-40 flex items-center gap-4">
                    <span className="font-medium text-sm text-brand-orange">{selectedOffers.length} {selectedOffers.length === 1 ? 'item' : 'itens'} selecionado{selectedOffers.length === 1 ? '' : 's'}</span>
                    <div className="h-4 w-px bg-gray-700"></div>
                    <button
                        onClick={() => console.log('Comparar Detalhado para:', selectedOffers)} // Log selected offers for now
                        className="text-sm font-bold text-white hover:text-brand-orange transition-colors"
                    >
                        Comparar Detalhado
                    </button>
                </div>
            )}
        </div>
    );
};

export default ComparisonTab;
