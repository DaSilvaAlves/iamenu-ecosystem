import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Copy, QrCode, Edit, ExternalLink, TrendingUp, Mail, Star, Eye, CheckCircle, X, Save, Upload } from 'lucide-react';
import { API_CONFIG } from '../config/api';

const ProfilesTab = () => {
    // Placeholder: ID do fornecedor logado (futuramente virá do auth context)
    const [supplierId] = useState('b2c3d4e5-f6a7-8901-2345-67890abcdef1'); // Horta Bio Nacional
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);

    // Edit Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState(null);

    // Form Data
    const [formData, setFormData] = useState({
        companyName: '',
        description: '',
        categories: [],
        locationCity: '',
        locationRegion: '',
        nationalDelivery: false,
        contactPhone: '',
        contactEmail: '',
        contactWebsite: '',
        deliveryZones: [],
        deliveryCost: '',
        deliveryFrequency: '',
        minOrder: '',
        paymentTerms: '',
        certifications: []
    });

    // Image files (separate state for file uploads)
    const [logoFile, setLogoFile] = useState(null);
    const [headerFile, setHeaderFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [headerPreview, setHeaderPreview] = useState('');

    // Fetch supplier data
    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const response = await fetch(`${API_CONFIG.MARKETPLACE_API}/suppliers/${supplierId}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setSupplier(data);

                // Initialize form data with supplier data
                setFormData({
                    companyName: data.companyName || '',
                    description: data.description || '',
                    categories: data.categories || [],
                    locationCity: data.locationCity || '',
                    locationRegion: data.locationRegion || '',
                    nationalDelivery: data.nationalDelivery || false,
                    contactPhone: data.contactPhone || '',
                    contactEmail: data.contactEmail || '',
                    contactWebsite: data.contactWebsite || '',
                    deliveryZones: data.deliveryZones || [],
                    deliveryCost: data.deliveryCost || '',
                    deliveryFrequency: data.deliveryFrequency || '',
                    minOrder: data.minOrder || '',
                    paymentTerms: data.paymentTerms || '',
                    certifications: data.certifications || []
                });

                // Set image previews if they exist
                if (data.logoUrl) setLogoPreview(data.logoUrl);
                if (data.headerImageUrl) setHeaderPreview(data.headerImageUrl);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSupplier();
    }, [supplierId]);

    // Copy invite link
    const handleCopyInviteLink = () => {
        const inviteLink = `https://iamenu.pt/marketplace/join?ref=${supplier?.companyName.toUpperCase().replace(/\s+/g, '')}`;
        navigator.clipboard.writeText(inviteLink);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle categories change
    const handleCategoriesChange = (category) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(category)
                ? prev.categories.filter(c => c !== category)
                : [...prev.categories, category]
        }));
    };

    // Handle certifications change
    const handleCertificationsChange = (cert) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.includes(cert)
                ? prev.certifications.filter(c => c !== cert)
                : [...prev.certifications, cert]
        }));
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            // Get auth token from localStorage
            const token = localStorage.getItem('auth_token');

            // Create FormData for file upload
            const formDataToSend = new FormData();

            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== undefined && formData[key] !== null) {
                    if (Array.isArray(formData[key])) {
                        formDataToSend.append(key, JSON.stringify(formData[key]));
                    } else {
                        formDataToSend.append(key, formData[key]);
                    }
                }
            });

            // Append image files if selected
            if (logoFile) {
                formDataToSend.append('logoFile', logoFile);
            }
            if (headerFile) {
                formDataToSend.append('headerFile', headerFile);
            }

            const response = await fetch(`${API_CONFIG.MARKETPLACE_API}/suppliers/${supplierId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Don't set Content-Type - browser will set it with boundary for FormData
                },
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedSupplier = await response.json();
            setSupplier(updatedSupplier);

            // Update previews with new URLs
            if (updatedSupplier.logoUrl) setLogoPreview(updatedSupplier.logoUrl);
            if (updatedSupplier.headerImageUrl) setHeaderPreview(updatedSupplier.headerImageUrl);

            setSaveSuccess(true);

            // Close modal after 1.5 seconds
            setTimeout(() => {
                setIsEditModalOpen(false);
                setSaveSuccess(false);
                setLogoFile(null);
                setHeaderFile(null);
            }, 1500);
        } catch (e) {
            setSaveError(e.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="text-center py-12 text-white/60">A carregar perfil...</div>;
    if (error) return <div className="text-center py-12 text-red-500">Erro ao carregar perfil: {error}</div>;
    if (!supplier) return <div className="text-center py-12 text-white/60">Fornecedor não encontrado.</div>;

    // Mock stats (futuramente vêm do backend)
    const stats = {
        views: 247,
        rfqsReceived: 12,
        responseRate: 98,
        referrals: 8
    };

    // Generate invite link
    const inviteLink = `https://iamenu.pt/marketplace/join?ref=${supplier.companyName.toUpperCase().replace(/\s+/g, '')}`;

    // Available options
    const availableCategories = [
        'Frescos & Vegetais',
        'Peixe e Marisco',
        'Carnes e Charcutaria',
        'Bebidas',
        'Laticínios',
        'Padaria e Pastelaria',
        'Embalagens',
        'Limpeza',
        'Equipamento'
    ];

    const availableCertifications = [
        'HACCP',
        'ISO 9001',
        'Certificação Bio PT-BIO-03',
        'Origem DOP',
        'Comércio Justo',
        'FSC'
    ];

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto w-full space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">store</span>
                            Meu Perfil de Fornecedor
                        </h2>
                        <p className="text-sm text-text-muted mt-1">Gere o teu perfil, convida restaurantes e acompanha performance</p>
                    </div>
                    <Link
                        to={`/marketplace/suppliers/${supplierId}`}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-border rounded-lg text-white text-sm font-medium transition-colors"
                    >
                        <ExternalLink size={16} />
                        Ver como Restaurante
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-surface border border-border p-5 rounded-xl hover:border-white/20 transition-colors group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                <Eye size={20} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white">{stats.views}</h3>
                        <p className="text-xs text-text-muted uppercase tracking-wider font-bold mt-1">Views (30 dias)</p>
                    </div>

                    <div className="bg-surface border border-border p-5 rounded-xl hover:border-white/20 transition-colors group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="bg-orange-500/10 p-2 rounded-lg text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                                <Mail size={20} />
                            </div>
                            <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded">
                                {stats.rfqsReceived} novos
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white">{stats.rfqsReceived}</h3>
                        <p className="text-xs text-text-muted uppercase tracking-wider font-bold mt-1">RFQs Recebidos</p>
                    </div>

                    <div className="bg-surface border border-border p-5 rounded-xl hover:border-white/20 transition-colors group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="bg-green-500/10 p-2 rounded-lg text-green-400 group-hover:bg-green-500/20 transition-colors">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white">{stats.responseRate}%</h3>
                        <p className="text-xs text-text-muted uppercase tracking-wider font-bold mt-1">Taxa de Resposta</p>
                    </div>

                    <div className="bg-surface border border-border p-5 rounded-xl hover:border-white/20 transition-colors group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="bg-yellow-500/10 p-2 rounded-lg text-yellow-400 group-hover:bg-yellow-500/20 transition-colors">
                                <Star size={20} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white">{supplier.ratingAvg}</h3>
                        <p className="text-xs text-text-muted uppercase tracking-wider font-bold mt-1">Rating Médio ({supplier.reviewCount} reviews)</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column - Preview & Invite */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Profile Preview */}
                        <div className="bg-surface border border-border rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">preview</span>
                                    Preview do Perfil Público
                                </h3>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors text-sm"
                                >
                                    <Edit size={16} />
                                    Editar Perfil
                                </button>
                            </div>
                            <div className="bg-background-page border border-border rounded-lg p-6 space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="size-20 bg-white rounded-lg p-2 flex items-center justify-center shrink-0">
                                        <span className="text-2xl font-black text-gray-800">{supplier.companyName.substring(0, 2)}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-white mb-1">{supplier.companyName}</h4>
                                        <p className="text-sm text-text-muted line-clamp-2">{supplier.description}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="flex items-center gap-1 text-yellow-500 text-sm">
                                                <Star size={14} fill="currentColor" />
                                                <span className="font-bold">{supplier.ratingAvg}</span>
                                            </span>
                                            <span className="text-xs text-text-muted">({supplier.reviewCount} avaliações)</span>
                                            {supplier.verified && (
                                                <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-500/20 text-green-300 border border-green-500/30">
                                                    Verificado
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                                    <div>
                                        <p className="text-xs text-text-muted uppercase tracking-wide font-bold mb-1">Localização</p>
                                        <p className="text-sm text-white">{supplier.locationCity}, {supplier.locationRegion}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-muted uppercase tracking-wide font-bold mb-1">Categorias</p>
                                        <div className="flex flex-wrap gap-1">
                                            {supplier.categories.map(cat => (
                                                <span key={cat} className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-900/30 text-blue-300 border border-blue-900/50">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invite Section */}
                        <div className="bg-surface border border-border rounded-xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">share</span>
                                <h3 className="text-lg font-bold text-white">Convidar Restaurantes</h3>
                            </div>
                            <p className="text-sm text-text-muted mb-4">
                                Partilha o teu link de convite para atrair novos clientes ao marketplace.
                                Ganhas visibilidade e os restaurantes descobrem os teus produtos!
                            </p>

                            <div className="bg-background-page border border-border rounded-lg p-4 mb-4">
                                <p className="text-xs text-text-muted uppercase tracking-wide font-bold mb-2">Teu Link de Convite</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={inviteLink}
                                        readOnly
                                        className="flex-1 bg-background-card border border-border rounded px-3 py-2 text-sm text-white font-mono"
                                    />
                                    <button
                                        onClick={handleCopyInviteLink}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors text-sm"
                                    >
                                        {copySuccess ? (
                                            <>
                                                <CheckCircle size={16} />
                                                Copiado!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={16} />
                                                Copiar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-border rounded-lg text-white text-sm font-medium transition-colors">
                                    <QrCode size={16} />
                                    Gerar QR Code
                                </button>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="flex items-center justify-center size-6 bg-green-500/20 text-green-400 rounded-full">
                                        <CheckCircle size={14} />
                                    </span>
                                    <span className="text-text-muted">
                                        <span className="font-bold text-green-400">{stats.referrals} restaurantes</span> aderiram via teu convite
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Reviews */}
                        <div className="bg-surface border border-border rounded-xl p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">reviews</span>
                                    Reviews Recentes
                                </h3>
                                <Link to="#" className="text-sm text-primary hover:text-primary-hover font-medium">
                                    Ver todas ({supplier.reviewCount})
                                </Link>
                            </div>
                            {supplier.reviews && supplier.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {supplier.reviews.slice(0, 3).map((review) => (
                                        <div key={review.id} className="bg-background-page border border-border rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 text-yellow-500">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={12}
                                                                fill={i < review.ratingOverall ? 'currentColor' : 'none'}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-bold text-white">
                                                        {review.anonymous ? 'Restaurador Anónimo' : `Restaurante #${review.reviewerId.substring(0, 8)}`}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-text-muted">
                                                    {new Date(review.createdAt).toLocaleDateString('pt-PT')}
                                                </span>
                                            </div>
                                            <p className="text-sm text-text-muted">{review.comment || 'Sem comentário'}</p>
                                            {!review.supplierResponse && (
                                                <button className="mt-3 text-xs text-primary hover:text-primary-hover font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">reply</span>
                                                    Responder
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-text-muted">
                                    <p className="text-sm">Ainda não tens reviews.</p>
                                    <p className="text-xs mt-1">Encoraja os teus clientes a deixar feedback!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Quick Actions */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-surface border border-border rounded-xl p-6">
                            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Ações Rápidas</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-background-page border border-border hover:border-primary/50 transition-colors group"
                                >
                                    <div className="bg-primary/10 p-2 rounded-lg text-primary group-hover:bg-primary/20 transition-colors">
                                        <Edit size={18} />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="text-sm font-bold text-white">Editar Perfil</h4>
                                        <p className="text-xs text-text-muted">Atualizar informações</p>
                                    </div>
                                </button>

                                <Link
                                    to="#"
                                    className="flex items-center gap-3 p-3 rounded-lg bg-background-page border border-border hover:border-primary/50 transition-colors group"
                                >
                                    <div className="bg-orange-500/10 p-2 rounded-lg text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">Gerir Catálogo</h4>
                                        <p className="text-xs text-text-muted">{supplier.supplierProducts?.length || 0} produtos</p>
                                    </div>
                                </Link>

                                <Link
                                    to="#"
                                    className="flex items-center gap-3 p-3 rounded-lg bg-background-page border border-border hover:border-primary/50 transition-colors group"
                                >
                                    <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-white">Ver RFQs</h4>
                                        <p className="text-xs text-text-muted">{stats.rfqsReceived} pendentes</p>
                                    </div>
                                    {stats.rfqsReceived > 0 && (
                                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            {stats.rfqsReceived}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>

                        {/* Certifications */}
                        {supplier.certifications && supplier.certifications.length > 0 && (
                            <div className="bg-surface border border-border rounded-xl p-6">
                                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Certificações</h3>
                                <div className="space-y-2">
                                    {supplier.certifications.map((cert, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-background-page border border-border">
                                            <div className="bg-green-500/10 p-1.5 rounded text-green-400">
                                                <CheckCircle size={14} />
                                            </div>
                                            <span className="text-xs font-medium text-white">{cert}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact Info */}
                        <div className="bg-surface border border-border rounded-xl p-6">
                            <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Informação de Contacto</h3>
                            <div className="space-y-3 text-sm">
                                {supplier.contactEmail && (
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-text-muted text-[16px]">mail</span>
                                        <span className="text-white">{supplier.contactEmail}</span>
                                    </div>
                                )}
                                {supplier.contactPhone && (
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-text-muted text-[16px]">phone</span>
                                        <span className="text-white">{supplier.contactPhone}</span>
                                    </div>
                                )}
                                {supplier.contactWebsite && (
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-text-muted text-[16px]">language</span>
                                        <a href={supplier.contactWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-hover">
                                            {supplier.contactWebsite}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-surface border border-border rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <Edit size={24} className="text-primary" />
                                        Editar Perfil do Fornecedor
                                    </h2>
                                    <p className="text-sm text-text-muted mt-1">Atualiza as informações do teu perfil público</p>
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={24} className="text-text-muted" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-6">
                                    {/* Company Info Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4">Informações da Empresa</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Nome da Empresa *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-2 bg-background-input border border-border rounded-lg text-white placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary"
                                                    placeholder="Nome da tua empresa"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Descrição *
                                                </label>
                                                <textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    required
                                                    rows={4}
                                                    className="w-full px-4 py-2 bg-background-input border border-border rounded-lg text-white placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                                                    placeholder="Descreve a tua empresa e o que ofereces..."
                                                />
                                                <p className="text-xs text-text-muted mt-1">{formData.description.length} caracteres</p>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Categorias *
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {availableCategories.map((category) => (
                                                        <button
                                                            key={category}
                                                            type="button"
                                                            onClick={() => handleCategoriesChange(category)}
                                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                                formData.categories.includes(category)
                                                                    ? 'bg-primary text-white'
                                                                    : 'bg-white/5 text-text-muted hover:bg-white/10'
                                                            }`}
                                                        >
                                                            {category}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Images Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4">Imagens do Perfil</h3>
                                        <div className="grid grid-cols-1 gap-6">
                                            {/* Logo Upload */}
                                            <div>
                                                <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary">photo_camera</span>
                                                    Foto de Perfil
                                                </label>
                                                <div className="flex gap-4 items-center">
                                                    {/* Logo Preview */}
                                                    <div className="size-24 rounded-lg border-2 border-border overflow-hidden shrink-0 bg-white flex items-center justify-center">
                                                        {logoPreview ? (
                                                            <img
                                                                src={logoPreview}
                                                                alt="Logo preview"
                                                                className="w-full h-full object-contain"
                                                            />
                                                        ) : (
                                                            <span className="material-symbols-outlined text-gray-400 text-4xl">image</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-border rounded-lg text-white text-sm font-medium transition-colors">
                                                            <Upload size={18} />
                                                            Escolher ficheiro
                                                            <input
                                                                type="file"
                                                                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        setLogoFile(file);
                                                                        // Create preview
                                                                        const reader = new FileReader();
                                                                        reader.onloadend = () => {
                                                                            setLogoPreview(reader.result);
                                                                        };
                                                                        reader.readAsDataURL(file);
                                                                    }
                                                                }}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                        <p className="text-xs text-text-muted mt-2">
                                                            PNG, JPG ou SVG (máx. 2MB)
                                                        </p>
                                                        {logoPreview && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setLogoFile(null);
                                                                    setLogoPreview('');
                                                                }}
                                                                className="text-xs text-red-400 hover:text-red-300 mt-1"
                                                            >
                                                                Remover imagem
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Header Image Upload */}
                                            <div>
                                                <label className="block text-sm font-medium text-white mb-3 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary">wallpaper</span>
                                                    Foto de Capa
                                                </label>
                                                <div className="space-y-3">
                                                    {/* Header Preview */}
                                                    <div className="w-full h-40 rounded-lg border-2 border-border overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                                        {headerPreview ? (
                                                            <img
                                                                src={headerPreview}
                                                                alt="Header preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="text-center">
                                                                <span className="material-symbols-outlined text-gray-600 text-5xl">landscape</span>
                                                                <p className="text-xs text-gray-500 mt-2">1200 x 400px recomendado</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-border rounded-lg text-white text-sm font-medium transition-colors">
                                                            <Upload size={18} />
                                                            Escolher ficheiro
                                                            <input
                                                                type="file"
                                                                accept="image/png,image/jpeg,image/jpg"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        setHeaderFile(file);
                                                                        // Create preview
                                                                        const reader = new FileReader();
                                                                        reader.onloadend = () => {
                                                                            setHeaderPreview(reader.result);
                                                                        };
                                                                        reader.readAsDataURL(file);
                                                                    }
                                                                }}
                                                                className="hidden"
                                                            />
                                                        </label>
                                                        {headerPreview && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setHeaderFile(null);
                                                                    setHeaderPreview('');
                                                                }}
                                                                className="text-xs text-red-400 hover:text-red-300"
                                                            >
                                                                Remover imagem
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-text-muted">
                                                        PNG ou JPG (máx. 5MB, 1200x400px recomendado)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4">Localização</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Cidade *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="locationCity"
                                                    value={formData.locationCity}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-2 bg-background-input border border-border rounded-lg text-white placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary"
                                                    placeholder="Lisboa"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Região *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="locationRegion"
                                                    value={formData.locationRegion}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-2 bg-background-input border border-border rounded-lg text-white placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary"
                                                    placeholder="Lisboa"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        name="nationalDelivery"
                                                        checked={formData.nationalDelivery}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 rounded border-border bg-background-input text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm font-medium text-white">Entrega nacional</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4">Contacto</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    name="contactEmail"
                                                    value={formData.contactEmail}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-background-input border border-border rounded-lg text-white placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary"
                                                    placeholder="comercial@empresa.pt"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Telefone
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="contactPhone"
                                                    value={formData.contactPhone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-background-input border border-border rounded-lg text-white placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary"
                                                    placeholder="+351 XXX XXX XXX"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Website
                                                </label>
                                                <input
                                                    type="url"
                                                    name="contactWebsite"
                                                    value={formData.contactWebsite}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-background-input border border-border rounded-lg text-white placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary"
                                                    placeholder="https://www.empresa.pt"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery & Business Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4">Entrega e Negócio</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Custo de Entrega
                                                </label>
                                                <input
                                                    type="text"
                                                    name="deliveryCost"
                                                    value={formData.deliveryCost}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-background-input border border-border rounded-lg text-white placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary"
                                                    placeholder="Grátis > 300€"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Frequência de Entrega
                                                </label>
                                                <input
                                                    type="text"
                                                    name="deliveryFrequency"
                                                    value={formData.deliveryFrequency}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-background-input border border-border rounded-lg text-white placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary"
                                                    placeholder="2x/semana"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Encomenda Mínima (€)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="minOrder"
                                                    value={formData.minOrder}
                                                    onChange={handleInputChange}
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full px-4 py-2 bg-background-input border border-border rounded-lg text-white placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary"
                                                    placeholder="150"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-white mb-2">
                                                    Termos de Pagamento
                                                </label>
                                                <input
                                                    type="text"
                                                    name="paymentTerms"
                                                    value={formData.paymentTerms}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 bg-background-input border border-border rounded-lg text-white placeholder-text-muted focus:ring-2 focus:ring-primary focus:border-primary"
                                                    placeholder="30 dias"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Certifications Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4">Certificações</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {availableCertifications.map((cert) => (
                                                <button
                                                    key={cert}
                                                    type="button"
                                                    onClick={() => handleCertificationsChange(cert)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                                        formData.certifications.includes(cert)
                                                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                                            : 'bg-white/5 text-text-muted hover:bg-white/10 border border-border'
                                                    }`}
                                                >
                                                    {formData.certifications.includes(cert) && (
                                                        <CheckCircle size={14} className="inline mr-1" />
                                                    )}
                                                    {cert}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {saveError && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                            <p className="text-sm text-red-400">
                                                Erro ao guardar: {saveError}
                                            </p>
                                        </div>
                                    )}

                                    {/* Success Message */}
                                    {saveSuccess && (
                                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                            <p className="text-sm text-green-400 flex items-center gap-2">
                                                <CheckCircle size={16} />
                                                Perfil atualizado com sucesso!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </form>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-border flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-border rounded-lg text-white font-medium transition-colors disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            A Guardar...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Guardar Alterações
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProfilesTab;
