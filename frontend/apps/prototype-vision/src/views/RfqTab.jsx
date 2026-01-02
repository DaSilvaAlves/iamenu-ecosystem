import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RfqTab = () => {
    const [restaurantId, setRestaurantId] = useState('user-restaurante-a'); // Placeholder
    const [supplierIds, setSupplierIds] = useState(''); // Comma-separated list of supplier IDs
    const [itemsJson, setItemsJson] = useState('[{"product_name": "Tomate Coração de Boi Biológico", "quantity": 10, "unit": "kg"}]');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const suppliersArray = supplierIds.split(',').map(s => s.trim()).filter(s => s !== '');
            const itemsArray = JSON.parse(itemsJson);

            const rfqData = {
                restaurantId,
                suppliers: suppliersArray,
                items: itemsArray,
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
            // Clear form (optional)
            setSupplierIds('');
            setItemsJson('[]');
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
                <div>
                    <label htmlFor="itemsJson" className="block text-sm font-medium text-white/70 mb-2">Itens do Pedido (JSON Array)</label>
                    <textarea
                        id="itemsJson"
                        className="w-full px-4 py-2 rounded-lg bg-surface-dark border border-border text-white focus:ring-primary focus:border-primary min-h-[120px] font-mono"
                        value={itemsJson}
                        onChange={(e) => setItemsJson(e.target.value)}
                        placeholder='[{"product_name": "Product X", "quantity": 5, "unit": "kg"}]'
                        required
                    ></textarea>
                </div>
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