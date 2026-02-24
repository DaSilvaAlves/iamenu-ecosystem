import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { X, Send } from 'lucide-react';
import { API_CONFIG } from '../config/api';

// --- Interfaces ---
interface RfqItem {
    product_name: string;
    quantity: number;
    unit: string;
    price_per_unit: number;
    total: number;
}

interface RfqQuote {
    id: string;
    supplierId: string;
    status: string;
    items: RfqItem[];
    deliveryTerms?: string;
    paymentTerms?: string;
    validUntil?: string;
    createdAt: string;
}

interface IncomingRequest {
    id: string;
    restaurantId: string;
    status: string;
    items: RfqItem[];
    notes?: string;
    quotes?: RfqQuote[];
    createdAt: string;
}

const IncomingRfqTab = () => {
    const [incomingRfq, setIncomingRfq] = useState<IncomingRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [supplierId] = useState('b2c3d4e5-f6a7-8901-2345-67890abcdef1'); // Placeholder: Horta Bio Nacional
    const [responseFormVisible, setResponseFormVisible] = useState<string | null>(null); // Stores quoteRequestId being responded to
    const [quoteItems, setQuoteItems] = useState<RfqItem[]>([]);
    const [deliveryTerms, setDeliveryTerms] = useState('');
    const [paymentTerms, setPaymentTerms] = useState('');
    const [validUntil, setValidUntil] = useState('');
    const [responseNotes, setResponseNotes] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [isResponseError, setIsResponseError] = useState(false);


    const fetchIncomingRfq = async () => {
        try {
            if (!supplierId) {
                setError('Supplier ID not available. Cannot fetch incoming RFQ.');
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_CONFIG.MARKETPLACE_API}/quotes/incoming?supplierId=${supplierId}`);
            if (!response.ok) {
                const errorData = await response.json() as { message?: string };
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            const data: IncomingRequest[] = await response.json();
            setIncomingRfq(data || []);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomingRfq();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supplierId]);

    const handleRespondClick = (request: IncomingRequest) => {
        setResponseFormVisible(request.id);
        // Pre-fill quote items with requested items, add price fields
        setQuoteItems(request.items.map(item => ({
            ...item,
            price_per_unit: 0.00, // Default price
            total: 0.00,
        })));
        setDeliveryTerms('');
        setPaymentTerms('');
        setValidUntil('');
        setResponseNotes('');
        setResponseMessage('');
        setIsResponseError(false);
    };

    const handleQuoteItemChange = (index: number, field: string, value: number) => {
        const updatedItems = [...quoteItems];
        (updatedItems[index] as unknown as Record<string, unknown>)[field] = value;
        if (field === 'price_per_unit' || field === 'quantity') {
            updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price_per_unit;
        }
        setQuoteItems(updatedItems);
    };

    const handleSendQuote = async (quoteRequestId: string) => {
        setResponseMessage('');
        setIsResponseError(false);

        try {
            const responseData = {
                supplierId,
                items: quoteItems,
                deliveryTerms,
                paymentTerms,
                validUntil: validUntil ? new Date(validUntil).toISOString() : undefined,
                notes: responseNotes,
            };

            const response = await fetch(`${API_CONFIG.MARKETPLACE_API}/quotes/${quoteRequestId}/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responseData),
            });

            if (!response.ok) {
                const errorData = await response.json() as { message?: string };
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json() as { id: string };
            setResponseMessage(`Cotacao enviada com sucesso! ID: ${data.id}`);
            setResponseFormVisible(null);
            fetchIncomingRfq(); // Refresh list
        } catch (err: unknown) {
            setResponseMessage(`Erro ao enviar cotacao: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setIsResponseError(true);
        }
    };


    if (loading) return <div className="text-center py-12 text-white/60">A carregar pedidos de orcamento...</div>;
    if (error) return <div className="text-center py-12 text-red-500">Erro ao carregar pedidos: {error}</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 mt-8">
            <h2 className="text-xl font-bold text-white">Meus Pedidos de Orcamento Recebidos</h2>

            {incomingRfq.length === 0 ? (
                <div className="glass-panel p-10 text-center border border-white/5 border-dashed bg-white/[0.01] mt-8">
                    <p className="text-white/60">Nenhum pedido de orcamento recebido ainda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {incomingRfq.map((request) => (
                        <div key={request.id} className="bg-surface border border-border rounded-xl p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-lg text-white">Pedido #{request.id.substring(0, 8)} de Restaurante {request.restaurantId.substring(0, 8)}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                    request.status === 'quoted' ? 'bg-green-500/20 text-green-300' :
                                    'bg-gray-500/20 text-gray-300'
                                }`}>
                                    {request.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-sm text-white/70">
                                Recebido em: {format(new Date(request.createdAt), 'PPP HH:mm', { locale: pt })}
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
                                    <h4 className="text-md font-medium text-white/80">Notas do Restaurante:</h4>
                                    <p className="text-sm text-white/60">{request.notes}</p>
                                </div>
                            )}

                            {request.quotes && request.quotes.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-border mt-4">
                                    <h4 className="text-md font-medium text-white/80">Minha Cotacao:</h4>
                                    {request.quotes.filter(q => q.supplierId === supplierId).map((quote) => ( // Show only my quote
                                        <div key={quote.id} className="bg-surface-dark border border-border rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-sm text-primary">Status: {quote.status.toUpperCase()}</span>
                                                <span className="text-xs text-white/60">Enviada em: {format(new Date(quote.createdAt), 'PPP HH:mm', { locale: pt })}</span>
                                            </div>
                                            <ul className="list-disc list-inside text-sm text-white/60 space-y-1">
                                                {quote.items.map((item, index) => (
                                                    <li key={index}>{item.product_name} - {item.quantity} {item.unit} @ &euro;{item.price_per_unit.toFixed(2)} = &euro;{item.total.toFixed(2)}</li>
                                                ))}
                                            </ul>
                                            {quote.deliveryTerms && <p className="text-xs text-white/60">Entrega: {quote.deliveryTerms}</p>}
                                            {quote.paymentTerms && <p className="text-xs text-white/60">Pagamento: {quote.paymentTerms}</p>}
                                            {quote.validUntil && <p className="text-xs text-white/60">Valida ate: {format(new Date(quote.validUntil), 'PPP', { locale: pt })}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {request.status === 'pending' && !responseFormVisible && (
                                <div className="pt-4 border-t border-border mt-4">
                                    <button
                                        onClick={() => handleRespondClick(request)}
                                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Responder a Pedido
                                    </button>
                                </div>
                            )}

                            {responseFormVisible === request.id && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-surface-dark p-4 rounded-lg space-y-4 mt-4">
                                    <h4 className="text-md font-medium text-white/80">Enviar Cotacao:</h4>
                                    {quoteItems.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <span className="text-sm text-white flex-1">{item.product_name} ({item.quantity} {item.unit})</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.price_per_unit}
                                                onChange={(e) => handleQuoteItemChange(index, 'price_per_unit', parseFloat(e.target.value) || 0)}
                                                placeholder="Preco/unid"
                                                className="w-24 px-2 py-1 rounded-md bg-surface border border-border text-white text-sm"
                                            />
                                            <span className="text-sm text-white">&euro;{item.total.toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div>
                                        <label htmlFor={`deliveryTerms-${request.id}`} className="block text-sm font-medium text-white/70 mb-1">Termos de Entrega</label>
                                        <input
                                            type="text"
                                            id={`deliveryTerms-${request.id}`}
                                            value={deliveryTerms}
                                            onChange={(e) => setDeliveryTerms(e.target.value)}
                                            className="w-full px-2 py-1 rounded-md bg-surface border border-border text-white text-sm"
                                            placeholder="Ex: Entrega gratis >100 EUR"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`paymentTerms-${request.id}`} className="block text-sm font-medium text-white/70 mb-1">Termos de Pagamento</label>
                                        <input
                                            type="text"
                                            id={`paymentTerms-${request.id}`}
                                            value={paymentTerms}
                                            onChange={(e) => setPaymentTerms(e.target.value)}
                                            className="w-full px-2 py-1 rounded-md bg-surface border border-border text-white text-sm"
                                            placeholder="Ex: 30 dias liquidos"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`validUntil-${request.id}`} className="block text-sm font-medium text-white/70 mb-1">Valida ate</label>
                                        <input
                                            type="date"
                                            id={`validUntil-${request.id}`}
                                            value={validUntil}
                                            onChange={(e) => setValidUntil(e.target.value)}
                                            className="w-full px-2 py-1 rounded-md bg-surface border border-border text-white text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`responseNotes-${request.id}`} className="block text-sm font-medium text-white/70 mb-1">Notas da Cotacao</label>
                                        <textarea
                                            id={`responseNotes-${request.id}`}
                                            value={responseNotes}
                                            onChange={(e) => setResponseNotes(e.target.value)}
                                            className="w-full px-2 py-1 rounded-md bg-surface border border-border text-white text-sm min-h-[60px]"
                                            placeholder="Observacoes adicionais para o restaurante..."
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setResponseFormVisible(null)}
                                            className="px-4 py-2 rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                                        >
                                            <X size={16} className="inline-block mr-1" /> Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSendQuote(request.id)}
                                            className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                        >
                                            <Send size={16} className="inline-block mr-1" /> Enviar Cotacao
                                        </button>
                                    </div>
                                    {responseMessage && (
                                        <div className={`mt-2 p-3 rounded-lg text-sm ${isResponseError ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                            {responseMessage}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default IncomingRfqTab;
