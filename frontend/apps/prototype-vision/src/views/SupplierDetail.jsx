import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  BookOpen,
  MessageSquare,
  Star,
  MapPin,
  Package,
  Truck,
  RotateCcw,
  CheckCircle,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

function SupplierDetail() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch(`http://localhost:3005/api/v1/marketplace/suppliers/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSupplier(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">A carregar detalhes do fornecedor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erro ao carregar fornecedor: {error}</p>
          <Link to="/marketplace" className="text-primary hover:text-primary-hover">
            Voltar ao Marketplace
          </Link>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-white/60 mb-4">Fornecedor não encontrado.</p>
          <Link to="/marketplace" className="text-primary hover:text-primary-hover">
            Voltar ao Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Mock data for demonstration (in production, these would come from API)
  const mockBrands = [
    { name: 'Compal', color: '#ff6b35' },
    { name: 'Delta', color: '#004e89' },
    { name: 'Mimosa', color: '#f77f00' },
    { name: 'Danone', color: '#0077b6' },
  ];

  const mockFeaturedProducts = supplier.SupplierProducts?.slice(0, 4) || [];

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'catalog', label: 'Catálogo', badge: supplier.SupplierProducts?.length || 0 },
    { id: 'reviews', label: 'Avaliações' },
    { id: 'policies', label: 'Políticas' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="supplier-detail-page pb-12"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6 text-sm">
        <Link to="/marketplace" className="text-text-muted hover:text-primary transition-colors">
          Mercado
        </Link>
        <span className="text-text-muted">/</span>
        <Link to="/marketplace" className="text-text-muted hover:text-primary transition-colors">
          {supplier.categories[0] || 'Frescos'}
        </Link>
        <span className="text-text-muted">/</span>
        <span className="text-primary font-medium">{supplier.companyName}</span>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Main Content */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          {/* Hero Section */}
          <section className="bg-surface rounded-xl border border-border overflow-hidden relative group">
            {/* Header Image with Gradient Overlay */}
            <div
              className="h-56 bg-cover bg-center relative"
              style={{
                backgroundImage: supplier.headerImageUrl
                  ? `url(${supplier.headerImageUrl})`
                  : 'linear-gradient(135deg, #1a4d2e 0%, #2d5a3d 100%)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>

              {/* Logo and Title */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-end sm:items-end gap-6">
                <div className="size-28 rounded-xl bg-surface p-3 shadow-2xl border border-border flex items-center justify-center shrink-0">
                  {supplier.logoUrl ? (
                    <img
                      src={supplier.logoUrl}
                      alt={supplier.companyName}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/10 rounded-lg">
                      <span className="text-3xl font-black text-white">
                        {supplier.companyName.substring(0, 2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-1 flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {supplier.verified && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-primary/20 text-primary border border-primary/30">
                        Fornecedor Premium
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-yellow-500 text-sm">
                      <Star size={16} fill="currentColor" />
                      <span className="font-bold">{supplier.ratingAvg || '4.8'}</span>
                      <span className="text-text-muted font-normal">({supplier.reviewCount || 0} avaliações)</span>
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                    {supplier.companyName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={18} />
                      {supplier.locationCity}, {supplier.locationRegion}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-text-muted/30"></span>
                    <span className="flex items-center gap-1.5">
                      <Package size={18} />
                      {supplier.categories.join(' & ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border border-t border-border bg-white/5 backdrop-blur-sm">
              <div className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1">Mínimo Enc.</span>
                <span className="text-xl font-bold text-white">
                  {supplier.minOrder ? `${parseFloat(supplier.minOrder).toFixed(2)} €` : '150,00 €'}
                </span>
              </div>
              <div className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1">Lead Time</span>
                <span className="text-xl font-bold text-white">24h</span>
              </div>
              <div className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1">Entrega</span>
                <span className="text-xl font-bold text-primary">
                  {supplier.deliveryCost || 'Grátis > 300€'}
                </span>
              </div>
              <div className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider mb-1">Taxa de Resposta</span>
                <span className="text-xl font-bold text-primary">98%</span>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-text-muted hover:text-white'
                  }`}
                >
                  {tab.label}
                  {tab.badge !== undefined && (
                    <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded ml-1">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* About the Supplier */}
                <div className="bg-surface p-6 rounded-xl border border-border">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">info</span>
                    Sobre o Fornecedor
                  </h3>
                  <p className="text-text-muted leading-relaxed text-sm">
                    {supplier.description || 'Líder na distribuição de produtos frescos e laticínios na região da Grande Lisboa há mais de 15 anos. Somos o parceiro de confiança para mais de 500 restaurantes, hotéis e cafés.'}
                  </p>
                </div>

                {/* Brands in Distribution */}
                <div className="bg-surface p-6 rounded-xl border border-border">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">loyalty</span>
                    Marcas em Distribuição
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {mockBrands.map((brand, index) => (
                      <div
                        key={index}
                        className="h-14 w-20 bg-white/5 border border-border rounded-lg flex items-center justify-center p-2 hover:bg-white/10 transition-all group cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <div
                            className="w-8 h-8 rounded-full mb-1 opacity-70 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: brand.color }}
                          ></div>
                          <span className="text-[9px] font-bold text-text-muted group-hover:text-white transition-colors">
                            {brand.name}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="h-14 w-20 bg-white/5 border border-border rounded-lg flex items-center justify-center p-2 hover:bg-white/10 transition-colors cursor-pointer group">
                      <span className="text-[10px] text-center font-bold text-text-muted group-hover:text-white transition-colors">
                        + 25 Marcas
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery and Returns Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Delivery & Logistics */}
                  <div className="bg-surface p-6 rounded-xl border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-500/10 text-blue-500 p-2 rounded-lg border border-blue-500/20">
                        <Truck size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-white">Entrega e Logística</h3>
                    </div>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3 text-text-muted">
                        <CheckCircle className="text-primary mt-0.5 shrink-0" size={18} />
                        <span>Entregas de Seg a Sáb (06:00 - 14:00)</span>
                      </li>
                      <li className="flex items-start gap-3 text-text-muted">
                        <CheckCircle className="text-primary mt-0.5 shrink-0" size={18} />
                        <span>Cut-off para dia seguinte: 16:00</span>
                      </li>
                      <li className="flex items-start gap-3 text-text-muted">
                        <CheckCircle className="text-primary mt-0.5 shrink-0" size={18} />
                        <span>Área: {supplier.deliveryZones?.join(', ') || 'Grande Lisboa, Sintra, Cascais'}</span>
                      </li>
                      <li className="flex items-start gap-3 text-text-muted">
                        <CheckCircle className="text-primary mt-0.5 shrink-0" size={18} />
                        <span>Custo fixo de 15€ para encomendas &lt; 300€</span>
                      </li>
                    </ul>
                  </div>

                  {/* Returns & Quality */}
                  <div className="bg-surface p-6 rounded-xl border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-orange-500/10 text-orange-500 p-2 rounded-lg border border-orange-500/20">
                        <RotateCcw size={20} />
                      </div>
                      <h3 className="text-lg font-bold text-white">Devoluções e Qualidade</h3>
                    </div>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3 text-text-muted">
                        <CheckCircle className="text-primary mt-0.5 shrink-0" size={18} />
                        <span>Devolução no ato da entrega aceite</span>
                      </li>
                      <li className="flex items-start gap-3 text-text-muted">
                        <CheckCircle className="text-primary mt-0.5 shrink-0" size={18} />
                        <span>Reclamações até 24h para perecíveis</span>
                      </li>
                      <li className="flex items-start gap-3 text-text-muted">
                        <CheckCircle className="text-primary mt-0.5 shrink-0" size={18} />
                        <span>Certificação HACCP em toda a frota</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Featured Products */}
                {mockFeaturedProducts.length > 0 && (
                  <section className="bg-surface rounded-xl border border-border p-6">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-white">Destaques da Semana</h3>
                        <p className="text-sm text-text-muted">Produtos com maior procura nesta época</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('catalog')}
                        className="px-4 py-1.5 rounded bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-border transition-colors"
                      >
                        Ver Todos
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {mockFeaturedProducts.map((supplierProduct) => (
                        <div
                          key={supplierProduct.Product.id}
                          className="group cursor-pointer bg-background-page rounded-lg p-3 border border-border hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]"
                        >
                          <div className="aspect-square bg-background-input rounded-md mb-3 relative overflow-hidden">
                            <div
                              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                              style={{
                                backgroundImage: `url(${supplierProduct.Product.imageUrl || 'https://via.placeholder.com/150'})`
                              }}
                            ></div>
                          </div>
                          <h4 className="font-bold text-sm text-white line-clamp-2 group-hover:text-primary transition-colors">
                            {supplierProduct.Product.name}
                          </h4>
                          <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wide">
                            Ref: {supplierProduct.Product.id.substring(0, 8)}
                          </p>
                          <div className="mt-2 flex items-baseline justify-between">
                            <p className="font-bold text-white">
                              {supplierProduct.price.toFixed(2)} €
                              <span className="text-xs font-normal text-text-muted"> / {supplierProduct.unit}</span>
                            </p>
                            <button className="size-6 rounded bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined text-[16px]">add</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {activeTab === 'catalog' && (
              <div className="bg-surface p-6 rounded-xl border border-border">
                <h2 className="text-2xl font-bold text-white mb-6">Catálogo de Produtos</h2>
                {supplier.SupplierProducts && supplier.SupplierProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {supplier.SupplierProducts.map((supplierProduct) => (
                      <div
                        key={supplierProduct.Product.id}
                        className="bg-background-page border border-border rounded-lg p-4 hover:border-primary/50 transition-all group"
                      >
                        <img
                          src={supplierProduct.Product.imageUrl || 'https://via.placeholder.com/150'}
                          alt={supplierProduct.Product.name}
                          className="h-40 w-full object-cover rounded-md mb-4"
                        />
                        <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors">
                          {supplierProduct.Product.name}
                        </h3>
                        <p className="text-sm text-text-muted line-clamp-2 mt-1">
                          {supplierProduct.Product.description}
                        </p>
                        <p className="mt-3 font-bold text-xl text-white">
                          {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(supplierProduct.price)}
                          <span className="text-sm text-text-muted font-normal"> / {supplierProduct.unit || supplierProduct.Product.unit}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-text-muted">Este fornecedor ainda não tem produtos no catálogo.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-surface p-6 rounded-xl border border-border">
                <h2 className="text-2xl font-bold text-white mb-6">Avaliações</h2>
                <div className="text-center py-12">
                  <p className="text-text-muted">Funcionalidade de avaliações em desenvolvimento.</p>
                </div>
              </div>
            )}

            {activeTab === 'policies' && (
              <div className="bg-surface p-6 rounded-xl border border-border">
                <h2 className="text-2xl font-bold text-white mb-6">Políticas</h2>
                <div className="space-y-4 text-text-muted text-sm leading-relaxed">
                  <div>
                    <h3 className="text-white font-bold mb-2">Termos de Pagamento</h3>
                    <p>{supplier.paymentTerms || '30 dias após entrega'}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Política de Devolução</h3>
                    <p>Aceitamos devoluções no ato da entrega para produtos com problemas de qualidade.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Cancelamento de Encomendas</h3>
                    <p>Encomendas podem ser canceladas até às 16h do dia anterior à entrega.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-24">
          {/* CTA Card */}
          <div className="bg-surface p-6 rounded-xl border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[150px] text-white">store</span>
            </div>

            <div className="flex items-center justify-between mb-6 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                <span className="block size-2 rounded-full bg-green-500 animate-pulse"></span>
                Aberto Agora
              </span>
              <span className="text-xs text-text-muted font-medium bg-white/5 px-2 py-1 rounded">
                Fecha às 18:00
              </span>
            </div>

            <div className="space-y-3 mb-6 relative z-10">
              <button
                onClick={() => setActiveTab('catalog')}
                className="w-full flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]"
              >
                <BookOpen size={20} />
                Ver Catálogo
              </button>
              <button className="w-full flex items-center justify-center gap-2 h-12 bg-transparent hover:bg-white/5 border border-primary text-primary font-bold rounded-lg transition-colors">
                <MessageSquare size={20} />
                Enviar RFQ
              </button>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-center relative z-10">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex items-center gap-2 text-sm font-medium group transition-colors ${
                  isFavorite ? 'text-red-500' : 'text-text-muted hover:text-red-500'
                }`}
              >
                <Heart
                  size={18}
                  className={`transition-all ${isFavorite ? 'fill-current' : ''}`}
                />
                {isFavorite ? 'Nos Meus Fornecedores' : 'Adicionar aos Meus Fornecedores'}
              </button>
            </div>
          </div>

          {/* Certifications */}
          {supplier.certifications && supplier.certifications.length > 0 && (
            <div className="bg-surface p-6 rounded-xl border border-border">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
                Certificações & Selos
              </h3>
              <div className="flex flex-col gap-3">
                {supplier.certifications.map((cert, index) => {
                  const certConfig = {
                    bio: { icon: 'eco', color: 'green', label: 'Fornecedor Verificado' },
                    haccp: { icon: 'safety_check', color: 'blue', label: 'HACCP Certificado' },
                    local: { icon: 'eco', color: 'emerald', label: 'Produtor Local' },
                  };
                  const config = certConfig[cert.toLowerCase()] || { icon: 'verified', color: 'green', label: cert };

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background-page border border-border hover:border-primary/30 transition-colors group"
                    >
                      <div className={`size-10 rounded bg-${config.color}-900/30 text-${config.color}-400 flex items-center justify-center border border-${config.color}-800/50 group-hover:text-${config.color}-300 transition-colors`}>
                        <span className="material-symbols-outlined">{config.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{config.label}</h4>
                        <p className="text-xs text-text-muted">
                          {config.color === 'green' && 'Validado pela iaMenu em 2023'}
                          {config.color === 'blue' && 'Segurança alimentar garantida'}
                          {config.color === 'emerald' && 'Apoio à economia regional'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Commercial Contact */}
          <div className="bg-surface p-6 rounded-xl border border-border">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
              Contacto Comercial
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold text-lg border-2 border-border">
                CS
              </div>
              <div>
                <p className="text-sm font-bold text-white">Carlos Silva</p>
                <p className="text-xs text-text-muted">Gestor de Conta</p>
                <p className="text-xs text-primary mt-0.5">Disponível</p>
              </div>
            </div>
            <button className="w-full text-sm text-text-muted hover:text-white border border-border rounded-lg py-2 hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
              <Mail size={16} />
              Enviar Mensagem
            </button>
          </div>

          {/* Contact Information */}
          {(supplier.contactEmail || supplier.contactPhone || supplier.contactWebsite) && (
            <div className="bg-surface p-6 rounded-xl border border-border">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">
                Informação de Contacto
              </h3>
              <div className="space-y-3 text-sm">
                {supplier.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-text-muted" />
                    <span className="text-white">{supplier.contactEmail}</span>
                  </div>
                )}
                {supplier.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-text-muted" />
                    <span className="text-white">{supplier.contactPhone}</span>
                  </div>
                )}
                {supplier.contactWebsite && (
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-text-muted" />
                    <a
                      href={supplier.contactWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-hover transition-colors"
                    >
                      {supplier.contactWebsite}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default SupplierDetail;
