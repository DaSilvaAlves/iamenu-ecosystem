import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { API_CONFIG } from '../config/api';

const RfqRequestsTab = () => {
    const [rfqRequests, setRfqRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [restaurantId] = useState('user-restaurante-a'); // Placeholder, will come from auth

    useEffect(() => {
        const fetchRfqRequests = async () => {
            try {
                // Ensure restaurantId is available (e.g., from auth context)
                if (!restaurantId) {
                    setError('Restaurant ID not available. Cannot fetch RFQ requests.');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${API_CONFIG.MARKETPLACE_API}/quotes/requests?restaurantId=${restaurantId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRfqRequests(data || []); // API returns an array directly
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRfqRequests();
    }, [restaurantId]);

    if (loading) return <div className="text-center py-12 text-white/60">A carregar pedidos de orçamento...</div>;
    if (error) return <div className="text-center py-12 text-red-500">Erro ao carregar pedidos: {error}</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 mt-8">
            <h2 className="text-xl font-bold text-white">Meus Pedidos de Orçamento Enviados</h2>

            {rfqRequests.length === 0 ? (
                <div className="glass-panel p-10 text-center border border-white/5 border-dashed bg-white/[0.01] mt-8">
                    <p className="text-white/60">Nenhum pedido de orçamento enviado ainda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {rfqRequests.map((request) => (
                        <div key={request.id} className="bg-surface border border-border rounded-xl p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg text-white">Pedido #{request.id.substring(0, 8)}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                    request.status === 'quoted' ? 'bg-green-500/20 text-green-300' :
                                    'bg-gray-500/20 text-gray-300'
                                }`}>
                                    {request.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-sm text-white/70">
                                Enviado a: {format(new Date(request.createdAt), 'PPP HH:mm', { locale: pt })}
                            </p>
                            <div className="space-y-2">
                                <h4 className="text-md font-medium text-white/80">Itens Solicitados:</h4>
                                <ul className="list-disc list-inside text-sm text-white/60 space-y-1">
                                    {request.items.map((item, index) => (
                                        <li key={index}>{item.product_name} - {item.quantity} {item.unit}</li>
                                    ))}
                                </ul>
                            </div>
                            {request.notes && (
                                <div>
                                    <h4 className="text-md font-medium text-white/80">Notas:</h4>
                                    <p className="text-sm text-white/60">{request.notes}</p>
                                </div>
                            )}

                            {request.quotes && request.quotes.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-border mt-4">
                                    <h4 className="text-md font-medium text-white/80">Cotações Recebidas ({request.quotes.length}):</h4>
                                    {request.quotes.map((quote) => (
                                        <div key={quote.id} className="bg-surface-dark border border-border rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-sm text-primary">Fornecedor: {quote.supplierId}</span> {/* Placeholder */}
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                    quote.status === 'sent' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'
                                                }`}>
                                                    {quote.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <ul className="list-disc list-inside text-sm text-white/60 space-y-1">
                                                {quote.items.map((item, index) => (
                                                    <li key={index}>{item.product_name} - {item.quantity} {item.unit} @ €{item.price_per_unit.toFixed(2)} = €{item.total.toFixed(2)}</li>
                                                ))}
                                            </ul>
                                            {quote.deliveryTerms && <p className="text-xs text-white/60">Entrega: {quote.deliveryTerms}</p>}
                                            {quote.paymentTerms && <p className="text-xs text-white/60">Pagamento: {quote.paymentTerms}</p>}
                                            {quote.validUntil && <p className="text-xs text-white/60">Válida até: {format(new Date(quote.validUntil), 'PPP', { locale: pt })}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default RfqRequestsTab;
