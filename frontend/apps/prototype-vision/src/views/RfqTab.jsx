import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, PlusCircle, MinusCircle, X } from 'lucide-react';

const RfqTab = () => {
    const [restaurantId, setRestaurantId] = useState('user-restaurante-a'); // Placeholder
    const [supplierIds, setSupplierIds] = useState(''); // Comma-separated list of supplier IDs
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Product Search & Selection States
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [productSearchResults, setProductSearchResults] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]); // {id, name, quantity, unit}
    const [showProductSearch, setShowProductSearch] = useState(false);
    const [productSearchLoading, setProductSearchLoading] = useState(false);
    const [newProductQuantity, setNewProductQuantity] = useState(1);
    const [newProductUnit, setNewProductUnit] = useState('');

    const fetchProducts = useCallback(async (searchTerm) => {
        if (searchTerm.length < 2) {
            setProductSearchResults([]);
            return;
        }
        setProductSearchLoading(true);
        try {
            const response = await fetch(`http://localhost:3002/api/v1/marketplace/products?search=${encodeURIComponent(searchTerm)}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setProductSearchResults(data.products || []);
        } catch (e) {
            console.error('Error searching products:', e);
            setProductSearchResults([]);
        } finally {
            setProductSearchLoading(false);
        }
    }, []);

    // Debounced product search
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchProducts(productSearchTerm);
        }, 500); // 500ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [productSearchTerm, fetchProducts]);

    const handleAddSelectedProduct = (product) => {
        const existing = selectedProducts.find(item => item.id === product.id);
        if (existing) {
            setSelectedProducts(selectedProducts.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + newProductQuantity } : item
            ));
        } else {
            setSelectedProducts([...selectedProducts, {
                id: product.id,
                name: product.name,
                quantity: newProductQuantity,
                unit: newProductUnit || product.unit || 'unid', // Use product.unit if available
            }]);
        }
        setProductSearchTerm(''); // Clear search after adding
        setProductSearchResults([]);
        setShowProductSearch(false);
        setNewProductQuantity(1);
        setNewProductUnit('');
    };

    const handleUpdateItemQuantity = (id, change) => {
        setSelectedProducts(selectedProducts.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
        ));
    };

    const handleRemoveItem = (id) => {
        setSelectedProducts(selectedProducts.filter(item => item.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (selectedProducts.length === 0) {
            setMessage('Por favor, adicione pelo menos um item ao pedido.');
            setIsError(true);
            return;
        }

        try {
            const suppliersArray = supplierIds.split(',').map(s => s.trim()).filter(s => s !== '');

            const rfqData = {
                restaurantId,
                suppliers: suppliersArray,
                items: selectedProducts.map(p => ({
                    product_id: p.id,
                    product_name: p.name,
                    quantity: p.quantity,
                    unit: p.unit,
                })),
                notes,
            };

            const response = await fetch('http://localhost:3002/api/v1/marketplace/quotes/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rfqData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setMessage(`Pedido de Orçamento criado com sucesso! ID: ${data.id}`);
            // Clear form
            setSupplierIds('');
            setSelectedProducts([]);
            setNotes('');
        } catch (error) {
            setMessage(`Erro ao criar Pedido de Orçamento: ${error.message}`);
            setIsError(true);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 mt-8">
            <h2 className="text-xl font-bold text-white">Novo Pedido de Orçamento (RFQ)</h2>
            <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-xl space-y-6">
                <div>
                    <label htmlFor="restaurantId" className="block text-sm font-medium text-white/70 mb-2">ID do Restaurante (Temporário)</label>
                    <input
                        type="text"
                        id="restaurantId"
                        className="w-full px-4 py-2 rounded-lg bg-surface-dark border border-border text-white focus:ring-primary focus:border-primary"
                        value={restaurantId}
                        onChange={(e) => setRestaurantId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="supplierIds" className="block text-sm font-medium text-white/70 mb-2">IDs dos Fornecedores (separados por vírgula)</label>
                    <input
                        type="text"
                        id="supplierIds"
                        className="w-full px-4 py-2 rounded-lg bg-surface-dark border border-border text-white focus:ring-primary focus:border-primary"
                        value={supplierIds}
                        onChange={(e) => setSupplierIds(e.target.value)}
                        placeholder="ex: id1, id2, id3"
                        required
                    />
                </div>

                {/* Product Search and Selection */}
                <div className="relative">
                    <label htmlFor="productSearch" className="block text-sm font-medium text-white/70 mb-2">Adicionar Produtos ao Pedido</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            id="productSearch"
                            className="w-full px-4 py-2 rounded-lg bg-surface-dark border border-border text-white focus:ring-primary focus:border-primary"
                            value={productSearchTerm}
                            onChange={(e) => {
                                setProductSearchTerm(e.target.value);
                                setShowProductSearch(true);
                            }}
                            placeholder="Pesquisar produto ou digitar manualmente"
                            onFocus={() => setShowProductSearch(true)}
                        />
                        {productSearchTerm && (
                            <button
                                type="button"
                                onClick={() => {
                                    setProductSearchTerm('');
                                    setProductSearchResults([]);
                                    setShowProductSearch(false);
                                }}
                                className="p-2 rounded-full text-white/70 hover:bg-white/10 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {showProductSearch && productSearchTerm.length >= 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute z-10 w-full bg-surface border border-border rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto"
                        >
                            {productSearchLoading ? (
                                <div className="p-3 text-white/60 text-sm">A procurar...</div>
                            ) : productSearchResults.length > 0 ? (
                                productSearchResults.map(product => (
                                    <div key={product.id} className="flex items-center justify-between p-3 border-b border-border last:border-b-0 hover:bg-white/5 transition-colors">
                                        <div>
                                            <div className="text-sm text-white">{product.name}</div>
                                            <div className="text-xs text-white/50">{product.category} ({product.unit})</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="1"
                                                value={newProductQuantity}
                                                onChange={(e) => setNewProductQuantity(parseInt(e.target.value) || 1)}
                                                className="w-16 px-2 py-1 rounded-md bg-surface-dark border border-border text-white text-sm"
                                            />
                                            <input
                                                type="text"
                                                value={newProductUnit || product.unit || ''}
                                                onChange={(e) => setNewProductUnit(e.target.value)}
                                                placeholder={product.unit || 'unid'}
                                                className="w-20 px-2 py-1 rounded-md bg-surface-dark border border-border text-white text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleAddSelectedProduct(product)}
                                                className="p-2 rounded-full bg-primary hover:bg-primary-hover text-white transition-colors"
                                            >
                                                <PlusCircle size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 text-white/60 text-sm">Nenhum produto encontrado.</div>
                            )}
                            {/* Manual Product Input */}
                            {productSearchTerm.length >= 2 && (
                                <div className="p-3 border-t border-border mt-2">
                                    <div className="text-sm text-white/70 mb-2">Adicionar manualmente:</div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={productSearchTerm}
                                            onChange={(e) => setProductSearchTerm(e.target.value)}
                                            placeholder="Nome do produto"
                                            className="flex-1 px-2 py-1 rounded-md bg-surface-dark border border-border text-white text-sm"
                                        />
                                        <input
                                            type="number"
                                            min="1"
                                            value={newProductQuantity}
                                            onChange={(e) => setNewProductQuantity(parseInt(e.target.value) || 1)}
                                            className="w-16 px-2 py-1 rounded-md bg-surface-dark border border-border text-white text-sm"
                                        />
                                        <input
                                            type="text"
                                            value={newProductUnit}
                                            onChange={(e) => setNewProductUnit(e.target.value)}
                                            placeholder="unid"
                                            className="w-20 px-2 py-1 rounded-md bg-surface-dark border border-border text-white text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAddSelectedProduct({ id: `manual-${Date.now()}`, name: productSearchTerm, quantity: newProductQuantity, unit: newProductUnit })}
                                            className="p-2 rounded-full bg-primary hover:bg-primary-hover text-white transition-colors"
                                        >
                                            <PlusCircle size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Selected Products List */}
                {selectedProducts.length > 0 && (
                    <div className="space-y-3 p-4 bg-surface-dark rounded-lg border border-border">
                        <h3 className="text-sm font-medium text-white/70">Itens no Pedido:</h3>
                        {selectedProducts.map(item => (
                            <div key={item.id} className="flex items-center justify-between bg-surface-highlight p-3 rounded-md">
                                <div className="flex-1">
                                    <div className="text-sm text-white">{item.name}</div>
                                    <div className="text-xs text-white/50">{item.quantity} {item.unit}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateItemQuantity(item.id, -1)}
                                        className="p-1 rounded-full text-white/70 hover:bg-white/10 transition-colors"
                                    >
                                        <MinusCircle size={16} />
                                    </button>
                                    <span className="text-sm text-white">{item.quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateItemQuantity(item.id, 1)}
                                        className="p-1 rounded-full text-white/70 hover:bg-white/10 transition-colors"
                                    >
                                        <PlusCircle size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="p-1 rounded-full text-red-400 hover:bg-white/10 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-white/70 mb-2">Notas Adicionais</label>
                    <textarea
                        id="notes"
                        className="w-full px-4 py-2 rounded-lg bg-surface-dark border border-border text-white focus:ring-primary focus:border-primary min-h-[80px]"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-primary/20"
                >
                    Enviar Pedido de Orçamento
                </button>
            </form>

            {message && (
                <div className={`mt-4 p-4 rounded-lg ${isError ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                    {message}
                </div>
            )}
        </motion.div>
    );
};

export default RfqTab;