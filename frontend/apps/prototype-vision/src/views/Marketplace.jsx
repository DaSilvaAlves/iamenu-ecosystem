import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Building2,
    Megaphone,
    Scale,
    ClipboardList,
    Inbox,
    Contact
} from 'lucide-react';

// Importa os novos componentes
import ComparisonTab from './ComparisonTab';
import RfqTab from './RfqTab';
import RfqRequestsTab from './RfqRequestsTab';
import IncomingRfqTab from './IncomingRfqTab';
import ResponsesTab from './ResponsesTab'; // Import ResponsesTab
import ProfilesTab from './ProfilesTab';

// Placeholder para os separadores em desenvolvimento
const StandardPlaceholder = ({ title }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-10 md:p-20 rounded-[40px] text-center border border-white/5 border-dashed bg-white/[0.01] mt-8"
        style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white/5 flex items-center justify-center text-white/20 mb-6 md:mb-8">
            <div className="text-3xl md:text-4xl italic font-black">ia</div>
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-white/20 uppercase italic tracking-tighter">Módulo {title}</h3>
        <p className="text-white/10 font-bold mt-2 uppercase text-xs tracking-[0.4em]">Em Desenvolvimento</p>
    </motion.div>
);


// Conteúdo para o separador de Diretório
const DirectoryTab = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch('http://localhost:3002/api/v1/marketplace/suppliers');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setSuppliers(data.suppliers);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSuppliers();
    }, []);

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden animate-pulse">
                    <div className="p-5 space-y-4">
                        <div className="h-6 bg-white/10 rounded w-3/4"></div>
                        <div className="h-4 bg-white/10 rounded w-full"></div>
                        <div className="flex gap-2">
                            <div className="h-6 bg-white/10 rounded w-20"></div>
                            <div className="h-6 bg-white/10 rounded w-24"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-white/10 rounded w-1/2"></div>
                            <div className="h-4 bg-white/10 rounded w-2/3"></div>
                        </div>
                        <div className="h-9 bg-white/10 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
    if (error) return <div className="text-center py-12 text-red-500">Erro ao carregar fornecedores: {error}</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 mt-8">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {suppliers.length > 0 ? (
                suppliers.map((supplier, index) => (
                    <motion.div
                        key={supplier.id}
                        className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col h-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(242, 84, 45, 0.2)' }}
                    >
                        <div className="p-5 flex flex-col flex-1">
                            <div className="mb-3">
                                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                    {supplier.companyName}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2 h-10">{supplier.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {supplier.categories.map(cat => (
                                    <span key={cat} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-900/30 text-blue-300 border border-blue-900/50">{cat}</span>
                                ))}
                            </div>
                            <div className="space-y-2 mb-6 text-sm text-gray-300">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-500 text-[18px]">location_on</span>
                                    <span>{supplier.locationCity}, {supplier.locationRegion}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-500 text-[18px] filled text-yellow-500">star</span>
                                    <span>{supplier.ratingAvg || 'N/A'} ({supplier.reviewCount || 0} reviews)</span>
                                </div>
                            </div>
                            <div className="mt-auto pt-4 border-t border-border flex gap-3">
                                <Link to={`/marketplace/suppliers/${supplier.id}`} className="flex-1 h-9 bg-primary hover:bg-primary-hover text-white font-medium text-sm rounded transition-colors flex items-center justify-center">
                                    Ver Catálogo
                                </Link>
                                <button className="size-9 flex items-center justify-center rounded border border-border hover:bg-surface-highlight text-gray-400 hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">bookmark_border</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))
                ) : (
                <p>Nenhum fornecedor encontrado.</p>
                )}
            </div>
        </motion.div>
    );
};

// Conteúdo para o separador de Campanhas, adaptado do mockup HTML
const CampaignsTab = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch('http://localhost:3002/api/v1/marketplace/collective-bargains');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setCampaigns(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, []);

    // Placeholder data calculation (can be refined)
    const summaryStats = {
        potentialSavings: campaigns.reduce((sum, campaign) => {
            if (campaign.targetPrice && campaign.Product && campaign.Product.price) {
                return sum + (campaign.Product.price - campaign.targetPrice) * (campaign.totalCommittedVolume || 0);
            }
            return sum;
        }, 0),
        activeCampaigns: campaigns.filter(c => c.isActive).length,
        committedVolume: campaigns.reduce((sum, c) => sum + (c.totalCommittedVolume || 0), 0),
        networkParticipants: campaigns.reduce((sum, c) => sum + (c.currentParticipants || 0), 0),
        closedDeals: campaigns.filter(c => c.status === 'closed-achieved').length
    };

    if (loading) return <div className="text-center py-12 text-white/60">A carregar campanhas...</div>;
    if (error) return <div className="text-center py-12 text-red-500">Erro ao carregar campanhas: {error}</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-10 mt-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <p className="text-text-muted max-w-2xl text-sm md:text-base">
                        CENTRAL DE NEGOCIAÇÃO AGREGADA PARA RESTAURANTES. AUMENTE SEU PODER DE COMPRA.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-surface border border-border rounded-lg text-white text-sm font-medium hover:bg-surface-highlight transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">history</span>
                        Histórico
                    </button>
                    <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Sugerir Nova Campanha
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface border border-border p-5 rounded-xl hover:border-white/20 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="bg-white/5 p-2 rounded-lg text-text-muted group-hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">savings</span>
                        </div>
                        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">trending_up</span> 12%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">€{summaryStats.potentialSavings.toFixed(2)}</h3>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-bold mt-1">Poupança Potencial</p>
                </div>
                <div className="bg-surface border border-border p-5 rounded-xl hover:border-white/20 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="bg-white/5 p-2 rounded-lg text-text-muted group-hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">{summaryStats.activeCampaigns} Ativas</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">{summaryStats.committedVolume}L</h3>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-bold mt-1">Volume Comprometido</p>
                </div>
                <div className="bg-surface border border-border p-5 rounded-xl hover:border-white/20 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="bg-white/5 p-2 rounded-lg text-text-muted group-hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white">{summaryStats.networkParticipants}</h3>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-bold mt-1">Participantes na Rede</p>
                </div>
                <div className="bg-surface border border-border p-5 rounded-xl hover:border-white/20 transition-colors group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="bg-white/5 p-2 rounded-lg text-text-muted group-hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">verified</span>
                        </div>
                        <span className="text-xs font-bold text-text-muted bg-white/5 px-2 py-1 rounded">Aguardando</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">{summaryStats.closedDeals}</h3>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-bold mt-1">Condições Fechadas</p>
                </div>
            </div>
            
            <section className="space-y-4">
                <div className="flex justify-between items-end px-2">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary rounded-full"></span>
                        Campanhas Ativas
                    </h2>
                    <span className="text-xs text-text-muted font-medium bg-surface px-2 py-1 rounded border border-border">Atualizado agora</span>
                </div>
                <div className="flex flex-col rounded-xl border border-border bg-surface overflow-hidden">
                    <div className="hidden md:grid grid-cols-12 gap-6 bg-white/5 px-6 py-4 border-b border-border">
                        <div className="col-span-4 text-xs font-bold text-text-muted uppercase tracking-wider">Produto</div>
                        <div className="col-span-2 text-xs font-bold text-text-muted uppercase tracking-wider text-center">Prazo</div>
                        <div className="col-span-3 text-xs font-bold text-text-muted uppercase tracking-wider">Volume &amp; Meta</div>
                        <div className="col-span-3 text-right text-xs font-bold text-text-muted uppercase tracking-wider">Adesão</div>
                    </div>

                    {campaigns.filter(c => c.isActive).length > 0 ? (
                        campaigns.map(campaign => {
                            const progress = (campaign.totalCommittedVolume / campaign.targetParticipants) * 100;
                            const timeLeft = campaign.deadline ? Math.ceil((new Date(campaign.deadline) - Date.now()) / (1000 * 60 * 60 * 24)) : 0;
                            const volumeUnit = campaign.Product?.unit || 'unid';
                            return (
                                <div key={campaign.id} className="flex flex-col md:grid md:grid-cols-12 gap-6 border-b border-border p-6 items-center hover:bg-white/[0.02] transition-colors group relative">
                                    <div className="col-span-4 flex items-center gap-4 w-full">
                                        <div className="size-16 shrink-0 rounded-lg bg-[#222] border border-white/10 bg-center bg-cover" style={{ backgroundImage: `url('${campaign.Product?.imageUrl || 'https://via.placeholder.com/150'}')` }}></div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded w-fit uppercase tracking-wider">{campaign.category}</span>
                                            <h3 className="text-base font-bold text-white leading-tight group-hover:text-primary transition-colors">{campaign.productName}</h3>
                                            <p className="text-xs text-text-muted font-mono">Ref: {campaign.Product?.id}</p>
                                        </div>
                                    </div>
                                    <div className="col-span-2 w-full flex md:flex-col justify-between md:justify-center items-center gap-1">
                                        <span className="md:hidden text-xs font-bold text-text-muted uppercase">Prazo:</span>
                                        <div className="flex flex-col items-end md:items-center">
                                            <span className="text-sm font-bold text-white">{new Date(campaign.deadline).toLocaleDateString('pt-PT')}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${timeLeft <= 3 ? 'text-red-400 bg-red-900/20 border border-red-900/30' : 'text-text-muted bg-white/10 border-white/10'}`}>{timeLeft} dias restantes</span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 w-full flex flex-col gap-2">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-medium text-primary">Próx. Nível: -5% preço</span>
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-white">{campaign.totalCommittedVolume.toFixed(0)}{volumeUnit}</span>
                                                <span className="text-xs text-text-muted"> / {campaign.targetParticipants}{volumeUnit}</span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                                            <div className="h-full rounded-full bg-gradient-to-r from-primary to-orange-400 shadow-[0_0_10px_rgba(249,94,31,0.5)]" style={{ width: `${Math.min(100, progress)}%` }}></div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex -space-x-2">
                                                {/* Placeholder avatars */}
                                            </div>
                                            <span className="text-xs text-text-muted">{campaign.currentParticipants} Participantes</span>
                                        </div>
                                    </div>
                                    <div className="col-span-3 w-full flex flex-col items-end gap-3 mt-4 md:mt-0">
                                        <div className="flex items-stretch w-full max-w-[200px]">
                                            <input className="w-full rounded-l-lg border border-border bg-background px-3 py-2 text-sm text-right focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-text-muted/50" placeholder="0" type="number" />
                                            <div className="flex items-center bg-white/5 border border-l-0 border-border px-3 rounded-r-lg text-xs font-bold text-text-muted uppercase">{volumeUnit}</div>
                                        </div>
                                        <button className="w-full max-w-[200px] bg-white text-black hover:bg-primary hover:text-white py-2 px-4 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-lg shadow-white/5 hover:shadow-primary/30">Aderir</button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="p-6 text-text-muted text-center">Nenhuma campanha ativa encontrada.</p>
                    )}
                </div>
            </section>
        </motion.div>
    );
};


// Componente principal do Marketplace
function Marketplace() {
    const [activeTab, setActiveTab] = useState('directory');

    const tabs = [
        { id: 'directory', label: 'Diretório', icon: Building2 },
        { id: 'campaigns', label: 'Campanhas', icon: Megaphone },
        { id: 'comparison', label: 'Comparador', icon: Scale },

        { id: 'rfq', label: 'Pedidos (RFQ)', icon: ClipboardList },
        { id: 'my-rfqs', label: 'Meus Pedidos', icon: Inbox },
        { id: 'incoming-rfqs', label: 'Pedidos Recebidos', icon: Inbox }, // <--- NEW TAB
        { id: 'responses', label: 'Respostas', icon: Inbox },
        { id: 'profiles', label: 'Perfis', icon: Contact },
    ];

    const ActiveComponent = () => {
        switch (activeTab) {
            case 'directory':
                return <DirectoryTab />;
            case 'campaigns':
                return <CampaignsTab />;
            case 'comparison':
                return <ComparisonTab />;

            case 'rfq':
                return <RfqTab />;
            case 'my-rfqs':
                return <RfqRequestsTab />;
            case 'incoming-rfqs': // <--- NEW CASE
                return <IncomingRfqTab />;
            case 'responses':
                return <ResponsesTab rfqId="824287df-1484-40d0-a81a-45fcf485063f" />; // Temporary hardcoded RFQ ID
            case 'profiles':
                return <ProfilesTab />;
            default:
                return <DirectoryTab />;
        }
    };

    return (
        <div className="marketplace-container space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white mb-2 tracking-tight italic uppercase">Marketplace</h1>
                <p className="text-white/40 font-bold text-sm uppercase tracking-wider">O seu centro de negociação e compras.</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <div className="flex items-center gap-2 -mb-px overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                            activeTab === tab.id
                                ? 'border-primary text-white'
                                : 'border-transparent text-white/60 hover:border-white/20 hover:text-white'
                            }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Based on Active Tab */}
            <div>
                <ActiveComponent />
            </div>
        </div>
    );
}

export default Marketplace;
