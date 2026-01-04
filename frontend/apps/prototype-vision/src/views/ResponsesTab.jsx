import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast'; // Import react-hot-toast

const ResponsesTab = ({ rfqId: propRfqId }) => { // Accept rfqId as a prop
    const { rfqId: paramRfqId } = useParams(); // Get rfqId from URL params
    const currentRfqId = propRfqId || paramRfqId; // Prioritize prop, then URL param

    const [responses, setResponses] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all'); // State for status filter
    const [sortBy, setSortBy] = useState('priceAsc'); // State for sorting, default to price ascending
    const [isAcceptingProposal, setIsAcceptingProposal] = useState(false); // State for loading during acceptance

    // Placeholder for getting the auth token - assuming it's available globally or via a context/utility
    const getAuthToken = () => {
        // This is a placeholder. Replace with actual token retrieval logic.
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = user.token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMDAxIiwiZW1haWwiOiJldXJpY29AaWFtZW51LnB0Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY3NDE1NTczLCJleHAiOjE3Njc1MDE5NzN9.dRzJwIHOL13HNRLBO2Y1Iiniq5ueWSVSV_Dif0QFinw'; // Default test token
        return token;
    };

    const calculateTotalPrice = (items) => items.reduce((acc, item) => acc + (item.total || 0), 0);

    // Apply filtering and sorting
    const filteredAndSortedResponses = useMemo(() => {
        if (!responses) return [];

        let result = [...responses];

        // Filter by status
        if (filterStatus !== 'all') {
            result = result.filter(quote => quote.status === filterStatus);
        }

        // Sort
        result.sort((a, b) => {
            const priceA = calculateTotalPrice(a.items);
            const priceB = calculateTotalPrice(b.items);

            if (sortBy === 'priceAsc') {
                return priceA - priceB;
            } else if (sortBy === 'priceDesc') {
                return priceB - priceA;
            }
            return 0;
        });

        return result;
    }, [responses, filterStatus, sortBy]);

    // Calculate summary statistics and best proposal based on filteredAndSortedResponses
    const totalProposals = filteredAndSortedResponses.length;

    let bestProposal = null;
    let minTotalPrice = Infinity;
    let fastestDelivery = null;

    if (filteredAndSortedResponses.length > 0) {
        filteredAndSortedResponses.forEach(quote => {
            const currentTotalPrice = calculateTotalPrice(quote.items)
            if (currentTotalPrice < minTotalPrice) {
                minTotalPrice = currentTotalPrice;
                bestProposal = { ...quote, calculatedTotalPrice: currentTotalPrice };
            }
            if (quote.deliveryTerms && quote.deliveryTerms.includes('24h') && !fastestDelivery) {
                fastestDelivery = { ...quote, calculatedTotalPrice: currentTotalPrice };
            }
        });
    }

    const bestPriceValue = bestProposal ? bestProposal.calculatedTotalPrice : 0;
    const bestDeliverySupplier = fastestDelivery ? fastestDelivery.supplier?.companyName : 'N/A';
    const bestDeliveryTerm = fastestDelivery ? fastestDelivery.deliveryTerms : 'N/A';

    const fetchResponses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:3005/api/v1/marketplace/quotes/requests/${currentRfqId}/responses`);
            if (!response.ok) {
                const errorBody = await response.text();
                console.error('API Error Response:', response.status, errorBody);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody}`);
            }
            const data = await response.json();
            setResponses(data);
        } catch (e) {
            console.error('Fetch error:', e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, [currentRfqId]);

    useEffect(() => {
        if (currentRfqId) {
            fetchResponses();
        }
    }, [currentRfqId, fetchResponses]);

    const handleAcceptProposal = async (quoteId) => {
        if (!bestProposal || !quoteId) {
            toast.error('Nenhuma proposta para aceitar.');
            return;
        }

        setIsAcceptingProposal(true);
        toast.loading('A aceitar proposta...');

        try {
            const token = getAuthToken();
            if (!token) {
                toast.error('Autenticação necessária para aceitar propostas.');
                setIsAcceptingProposal(false);
                return;
            }

            const response = await fetch(`http://localhost:3005/api/v1/marketplace/quotes/${quoteId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: 'accepted' }),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message || `Erro HTTP! status: ${response.status}`);
            }

            const acceptedQuote = await response.json();
            toast.dismiss();
            toast.success('Proposta aceite com sucesso!');
            console.log('Proposta aceite:', acceptedQuote);
            fetchResponses(); // Re-fetch to show updated status
        } catch (err) {
            toast.dismiss();
            toast.error(`Falha ao aceitar proposta: ${err.message}`);
            console.error('Erro ao aceitar proposta:', err);
        } finally {
            setIsAcceptingProposal(false);
        }
    };

    const handleAcceptIndividualQuote = async (quoteId) => {
        if (!quoteId) {
            toast.error('ID da proposta inválido.');
            return;
        }

        setIsAcceptingProposal(true); // Reusing this state for any acceptance
        toast.loading('A aceitar proposta individual...');

        try {
            const token = getAuthToken();
            if (!token) {
                toast.error('Autenticação necessária para aceitar propostas.');
                setIsAcceptingProposal(false);
                return;
            }

            const response = await fetch(`http://localhost:3005/api/v1/marketplace/quotes/${quoteId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: 'accepted' }),
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message || `Erro HTTP! status: ${response.status}`);
            }

            const acceptedQuote = await response.json();
            toast.dismiss();
            toast.success('Proposta individual aceite com sucesso!');
            console.log('Proposta individual aceite:', acceptedQuote);
            fetchResponses(); // Re-fetch to show updated status
        } catch (err) {
            toast.dismiss();
            toast.error(`Falha ao aceitar proposta individual: ${err.message}`);
            console.error('Erro ao aceitar proposta individual:', err);
        } finally {
            setIsAcceptingProposal(false);
        }
    };


    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-10 md:p-20 rounded-[40px] text-center border border-white/5 border-dashed bg-white/[0.01] mt-8"
                style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
                <h3 className="text-2xl md:text-3xl font-black text-white/20 uppercase italic tracking-tighter">A Carregar Respostas ...</h3>
                <p className="text-white/10 font-bold mt-2 uppercase text-xs tracking-[0.4em]">Por favor aguarde</p>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-10 md:p-20 rounded-[40px] text-center border border-white/5 border-5 border-dashed bg-white/[0.01] mt-8"
                style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
                <h3 className="text-2xl md:text-3xl font-black text-red-500 uppercase italic tracking-tighter">Erro: {error}</h3>
                <p className="text-white/10 font-bold mt-2 uppercase text-xs tracking-[0.4em]">Não foi possível carregar as respostas</p>
            </motion.div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1: Total de Propostas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-6 rounded-[20px] border border-white/5 bg-white/[0.01] flex items-center justify-between"
                >
                    <div>
                        <p className="text-sm text-text-secondary">Total de Propostas</p>
                        <p className="text-3xl font-bold text-white">{totalProposals}</p>
                    </div>
                    <span className="material-symbols-outlined text-4xl text-primary opacity-50">description</span>
                </motion.div>

                {/* Card 2: Melhor Proposta (Preço) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-6 rounded-[20px] border border-white/5 bg-white/[0.01] flex items-center justify-between"
                >
                    <div>
                        <p className="text-sm text-text-secondary">Melhor Proposta (Preço)</p>
                        <p className="text-3xl font-bold text-green-400">{bestPriceValue.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
                    </div>
                    <span className="material-symbols-outlined text-4xl text-green-400 opacity-50">payments</span>
                </motion.div>

                {/* Card 3: Entrega Mais Rápida */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel p-6 rounded-[20px] border border-white/5 bg-white/[0.01] flex items-center justify-between"
                >
                    <div>
                        <p className="text-sm text-text-secondary">Entrega Mais Rápida</p>
                        <p className="text-3xl font-bold text-blue-400">{bestDeliveryTerm}</p>
                        <p className="text-xs text-text-muted">{bestDeliverySupplier}</p>
                    </div>
                    <span className="material-symbols-outlined text-4xl text-blue-400 opacity-50">local_shipping</span>
                </motion.div>
            </div>

            {/* Secção "MELHOR PROPOSTA" */}
            {bestProposal && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-panel p-6 rounded-[20px] border border-primary/50 bg-primary/[0.05] mb-8"
                >
                    <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-2xl">star</span> MELHOR PROPOSTA
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-text-secondary">
                        <div>
                            <p>Fornecedor: <span className="text-white font-semibold">{bestProposal.supplier?.companyName || 'Desconhecido'}</span></p>
                            <p>Preço Total: <span className="text-green-400 font-semibold">
                                {bestProposal.calculatedTotalPrice.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</span></p>
                        </div>
                        <div>
                            <p>Condições de Entrega: <span className="text-white font-semibold">{bestProposal.deliveryTerms}</span></p>
                            <p>Condições de Pagamento: <span className="text-white font-semibold">{bestProposal.paymentTerms}</span></p>
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-6 mb-2">Itens da Proposta:</h3>
                    <ul className="list-disc list-inside text-text-muted">
                        {bestProposal.items.map((item, index) => (
                            <li key={index}>{item.product_name}: {item.quantity} {item.unit} - {item.total.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</li>
                        ))}
                    </ul>
                    <div className="flex justify-end mt-6 gap-3">
                        <button
                            onClick={() => console.log('Ver Detalhes da Melhor Proposta:', bestProposal)}
                            className="px-4 py-2 rounded-md border border-border-dark text-text-muted hover:text-white font-bold hover:bg-white/5 transition-colors"
                        >Ver Detalhes</button>
                        <button
                            onClick={() => handleAcceptProposal(bestProposal.id)}
                            disabled={isAcceptingProposal}
                            className="px-4 py-2 rounded-md bg-primary hover:bg-primary-hover text-white font-bold transition-colors shadow-lg shadow-primary/10"
                        >Aceitar Proposta</button>
                    </div>
                </motion.div>
            )}

            {/* Header com filtros e botões de ação */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h3 className="font-bold text-lg text-white">Tabela Comparativa</h3>
                </div>
                <div className="flex items-center gap-3 relative">
                    {/* Filter by Price Button */}
                    <button
                        onClick={() => setSortBy(sortBy === 'priceAsc' ? 'priceDesc' : 'priceAsc')}
                        className="px-3 py-1.5 text-xs font-medium text-text-muted bg-background-input border border-border-dark rounded hover:bg-white/5 transition-colors flex items-center gap-1"
                    >
                        Filtrar por Preço {sortBy === 'priceAsc' ? '↑' : '↓'}
                    </button>
                    {/* Status Filter Dropdown */}
                    <div className="relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-1.5 text-xs font-medium text-text-muted bg-background-input border border-border-dark rounded hover:bg-white/5 transition-colors appearance-none pr-8"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="sent">Enviado</option>
                            <option value="negotiation">Em Negociação</option>
                            <option value="read">Lida</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-text-muted text-[16px] pointer-events-none">arrow_drop_down</span>
                    </div>
                </div>
            </div>

            {/* Tabela Comparativa de Propostas */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-text-secondary text-xs uppercase font-bold tracking-wider">
                            <th className="px-6 py-3 border-b border-border-dark">Fornecedor</th>
                            <th className="px-6 py-3 border-b border-border-dark text-center">Proposta</th>
                            <th className="px-6 py-3 border-b border-border-dark text-center">Preço Total</th>
                            <th className="px-6 py-3 border-b border-border-dark text-center">Condições</th>
                            <th className="px-6 py-3 border-b border-border-dark">Notas</th>
                            <th className="px-6 py-3 border-b border-border-dark text-center">Status</th>
                            <th className="px-6 py-3 border-b border-border-dark text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-dark">
                        {filteredAndSortedResponses.length > 0 ? (
                            filteredAndSortedResponses.map((quote) => {
                                const totalPrice = calculateTotalPrice(quote.items); // Use the helper function
                                const totalQuantity = quote.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
                                const pricePerKg = totalQuantity > 0 ? totalPrice / totalQuantity : 0;
                                return (
                                    <tr key={quote.id} className="group hover:bg-background-light transition-colors">
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-white">{quote.supplier?.companyName || 'Fornecedor Desconhecido'}</p>
                                            <p className="text-xs text-text-muted">{quote.supplier?.contactEmail || 'N/A'}</p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col gap-1.5 items-center">
                                                {quote.items.slice(0, 2).map((item, index) => (
                                                    <span key={index} className="text-xs text-text-muted">{item.product_name} ({item.quantity} {item.unit})</span>
                                                ))}
                                                {quote.items.length > 2 && <span className="text-xs text-text-secondary">+{quote.items.length - 2} itens</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <p className="font-bold text-lg text-primary">{totalPrice.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</p>
                                            {pricePerKg > 0 && <p className="text-xs text-text-muted">({pricePerKg.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}/kg)</p>}
                                        </td>
                                        <td className="px-6 py-5 text-xs text-text-muted">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-text-secondary">calendar_today</span> {quote.paymentTerms}</span>
                                                <span className="flex items-center gap-1.5 text-white"><span className="material-symbols-outlined text-[14px] text-primary">bolt</span> {quote.deliveryTerms}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-xs text-text-muted">
                                            <p className="line-clamp-2 leading-relaxed">{quote.notes}</p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-bold uppercase tracking-wide
                                                        ${quote.status === 'sent' ? 'bg-yellow-900/20 border border-yellow-700/30 text-yellow-500' :
                                                            quote.status === 'negotiation' ? 'bg-blue-900/20 border border-blue-700/30 text-blue-400' :
                                                                'bg-gray-800 border border-gray-700 text-gray-400'}`}>
                                                {quote.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button className="px-3 py-1.5 rounded-md border border-border-dark text-text-muted hover:text-white text-xs font-bold hover:bg-white/5 transition-colors">
                                                    Negociar
                                                </button>
                                                <button
                                                    onClick={() => handleAcceptIndividualQuote(quote.id)}
                                                    disabled={isAcceptingProposal}
                                                    className="px-3 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors shadow-lg shadow-primary/10">
                                                    Aceitar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-5 text-center text-text-muted">Nenhuma resposta encontrada para os filtros aplicados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer Section */}
            <footer className="mt-8 pt-6 border-t border-border-dark flex justify-between items-center text-xs text-text-secondary">
                <p>© 2024 iaMenu Ecosystem. Todos os direitos reservados.</p>
                <div className="flex gap-4">
                    <a className="hover:text-white transition-colors" href="#">Privacidade</a>
                    <a className="hover:text-white transition-colors" href="#">Termos</a>
                    <a className="hover:text-white transition-colors" href="#">Ajuda</a>
                </div>
            </footer>
        </div>
    );
};

export default ResponsesTab;