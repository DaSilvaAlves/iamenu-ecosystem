import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  TrendingDown,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles
} from 'lucide-react';
import { DashboardAPI } from '../services/businessAPI';
import SalesTrendChart from '../components/SalesTrendChart';
import DemandForecastChart from '../components/DemandForecastChart';
import PeakHoursHeatmap from '../components/PeakHoursHeatmap';
import BenchmarkChart from '../components/BenchmarkChart';
import MenuEngineeringMatrix from '../components/MenuEngineeringMatrix';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast, { Toaster } from 'react-hot-toast';

const DashboardBI = ({ setView }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('semana');
  const [trendPeriod, setTrendPeriod] = useState('hoje');
  const [stats, setStats] = useState(null);
  const [salesTrends, setSalesTrends] = useState([]);
  const [aiPrediction, setAIPrediction] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [menuEngineering, setMenuEngineering] = useState(null);
  const [demandForecast, setDemandForecast] = useState(null);
  const [peakHoursHeatmap, setPeakHoursHeatmap] = useState(null);
  const [benchmark, setBenchmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  // Carregar todos os dados da API
  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod, trendPeriod, activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'menu') {
        // Carregar apenas Menu Engineering
        const menuRes = await DashboardAPI.getMenuEngineering();
        setMenuEngineering(menuRes.data);
      } else if (activeTab === 'forecast') {
        // Carregar apenas AI Forecast
        const [forecastRes, heatmapRes] = await Promise.all([
          DashboardAPI.getDemandForecast(),
          DashboardAPI.getPeakHoursHeatmap()
        ]);

        setDemandForecast(forecastRes.data);
        setPeakHoursHeatmap(heatmapRes.data);
      } else if (activeTab === 'benchmark') {
        // Carregar apenas Benchmark
        const benchmarkRes = await DashboardAPI.getBenchmark();
        setBenchmark(benchmarkRes.data);
      } else {
        // Buscar dados do overview em paralelo
        const [statsRes, trendsRes, predictionRes, productsRes, alertsRes] = await Promise.all([
          DashboardAPI.getStats(selectedPeriod),
          DashboardAPI.getSalesTrends(trendPeriod),
          DashboardAPI.getAIPrediction(),
          DashboardAPI.getTopProducts(5),
          DashboardAPI.getAlerts()
        ]);

        setStats(statsRes.data);
        setSalesTrends(trendsRes.data?.data || []);
        setAIPrediction(predictionRes.data);
        setTopProducts(productsRes.data || []);
        setAlerts(alertsRes.data || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback para dados mock
      if (activeTab !== 'menu') {
        setStats({
          receita: { formatted: '€0', trend: '0%', isUp: true, vs: 'Sem dados' },
          clientes: { value: 0, trend: '0%', isUp: false, vs: 'Sem dados' },
          ticketMedio: { formatted: '€0', trend: '0%', isUp: true, vs: 'Sem dados' },
          foodCost: { formatted: '0%', trend: 'Sem dados', isUp: true, vs: 'Sem dados' }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar/refresh dos dados
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setLastUpdated(new Date());
    setRefreshing(false);
  };

  // Função para remover alerta (dismiss)
  const handleDismissAlert = (alertId) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId && alert.title !== alertId));
  };

  // Funções de navegação
  const handleNavigateToFoodCost = () => {
    if (setView) {
      setView('foodcost');
    } else {
      toast.error('Navegação não disponível');
    }
  };

  // Funções de toast para funcionalidades em desenvolvimento
  const showComingSoon = (featureName) => {
    toast('🚧 ' + featureName + ' disponível em breve!', {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #374151',
      },
    });
  };

  // Handler para ações dos alertas
  const handleAlertAction = (alert) => {
    // Mapear ações específicas
    if (alert.action === 'Rever Produto' || alert.action === 'Ver Detalhes') {
      handleNavigateToFoodCost();
    } else if (alert.action === 'Ver Estratégias' || alert.action === 'Ver Sugestões') {
      showComingSoon('Estratégias de Precificação');
    } else {
      // Ação genérica
      showComingSoon(alert.action);
    }
  };

  // Função para exportar relatório em PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('iaMenu Business Intelligence', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Relatório de Performance', 105, 28, { align: 'center' });

    doc.setFontSize(10);
    const now = new Date();
    doc.text(`Gerado em: ${now.toLocaleDateString('pt-PT')} às ${now.toLocaleTimeString('pt-PT')}`, 105, 35, { align: 'center' });

    // Linha separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 40, 190, 40);

    let yPos = 50;

    // Estatísticas Principais
    if (stats) {
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('Estatísticas Principais', 20, yPos);
      yPos += 10;

      const statsData = [
        ['Métrica', 'Valor', 'Tendência'],
        ['Receita Bruta', stats.receita.formatted, stats.receita.trend],
        ['Clientes (Covers)', stats.clientes.value.toString(), stats.clientes.trend],
        ['Ticket Médio', stats.ticketMedio.formatted, stats.ticketMedio.trend],
        ['Food Cost %', stats.foodCost.formatted, stats.foodCost.trend]
      ];

      autoTable(doc, {
        startY: yPos,
        head: [statsData[0]],
        body: statsData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [255, 107, 53], textColor: 255 },
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
      });

      yPos = doc.lastAutoTable.finalY + 15;
    }

    // Top 5 Produtos
    if (topProducts && topProducts.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('Top 5 Produtos', 20, yPos);
      yPos += 10;

      const productsData = [
        ['Produto', 'Vendas', 'Revenue', 'Margem'],
        ...topProducts.slice(0, 5).map(p => [
          p.name,
          p.sales.toString(),
          `€${p.revenue.toFixed(2)}`,
          p.margin
        ])
      ];

      autoTable(doc, {
        startY: yPos,
        head: [productsData[0]],
        body: productsData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [255, 107, 53], textColor: 255 },
        styles: { fontSize: 9 },
        margin: { left: 20, right: 20 }
      });

      yPos = doc.lastAutoTable.finalY + 15;
    }

    // Menu Engineering Summary
    if (menuEngineering && yPos < 250) {
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('Menu Engineering - Resumo', 20, yPos);
      yPos += 10;

      const menuData = [
        ['Categoria', 'Produtos', 'Descrição'],
        ['Stars ⭐', menuEngineering.stars?.length || 0, 'Alta margem + Alto volume'],
        ['Gems 💎', menuEngineering.gems?.length || 0, 'Alta margem + Baixo volume'],
        ['Populars 🐴', menuEngineering.populars?.length || 0, 'Baixa margem + Alto volume'],
        ['Dogs 🐕', menuEngineering.dogs?.length || 0, 'Baixa margem + Baixo volume']
      ];

      autoTable(doc, {
        startY: yPos,
        head: [menuData[0]],
        body: menuData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [255, 107, 53], textColor: 255 },
        styles: { fontSize: 9 },
        margin: { left: 20, right: 20 }
      });

      yPos = doc.lastAutoTable.finalY + 15;
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
      doc.text(
        'Gerado com iaMenu Business Intelligence',
        105,
        doc.internal.pageSize.height - 5,
        { align: 'center' }
      );
    }

    // Download
    const fileName = `iamenu-relatorio-${now.toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notifications */}
      <Toaster />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-white mb-2 tracking-tight italic"
          >
            BUSINESS INTELLIGENCE
          </motion.h1>
          <p className="text-white/40 font-bold text-sm uppercase tracking-wider">
            Análise detalhada de vendas e tendências do seu restaurante.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white font-semibold text-sm focus:outline-none focus:border-primary transition-all"
          >
            <option value="hoje">Hoje</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="ano">Este Ano</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </button>
          <button
            onClick={handleExportPDF}
            disabled={loading || !stats}
            className="px-6 py-2 bg-primary hover:bg-primary-hover rounded-xl text-white font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Exportar Relatório
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'overview', label: 'Visão Geral', icon: '📊' },
          { id: 'menu', label: 'Menu Engineering', icon: '🍽️' },
          { id: 'forecast', label: 'AI Forecast', icon: '🤖' },
          { id: 'benchmark', label: 'Benchmark', icon: '📈' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Based on Active Tab */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-white/60">Carregando...</p>
        </div>
      ) : activeTab === 'menu' && menuEngineering ? (
        /* MENU ENGINEERING */
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl">⭐</span>
                <span className="text-3xl font-black text-yellow-400">{menuEngineering.stars.length}</span>
              </div>
              <h3 className="text-white font-bold text-sm">STARS</h3>
              <p className="text-white/60 text-xs mt-1">Alta margem + Alto volume</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl">💎</span>
                <span className="text-3xl font-black text-green-400">{menuEngineering.gems.length}</span>
              </div>
              <h3 className="text-white font-bold text-sm">GEMS</h3>
              <p className="text-white/60 text-xs mt-1">Alta margem + Baixo volume</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl">🐴</span>
                <span className="text-3xl font-black text-blue-400">{menuEngineering.populars.length}</span>
              </div>
              <h3 className="text-white font-bold text-sm">POPULARS</h3>
              <p className="text-white/60 text-xs mt-1">Baixa margem + Alto volume</p>
            </div>
            <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl">🐕</span>
                <span className="text-3xl font-black text-red-400">{menuEngineering.dogs.length}</span>
              </div>
              <h3 className="text-white font-bold text-sm">DOGS</h3>
              <p className="text-white/60 text-xs mt-1">Baixa margem + Baixo volume</p>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {menuEngineering.opportunities.gems.count > 0 && (
              <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-xl p-4">
                <h4 className="text-green-400 font-bold text-sm mb-2">💎 Oportunidade - Gems</h4>
                <p className="text-white/80 text-sm mb-3">{menuEngineering.opportunities.gems.suggestion}</p>
                <p className="text-green-400 font-bold text-xs">Potencial: +€{menuEngineering.opportunities.gems.potential.toFixed(0)}</p>
              </div>
            )}
            {menuEngineering.opportunities.populars.count > 0 && (
              <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-4">
                <h4 className="text-blue-400 font-bold text-sm mb-2">🐴 Otimização - Populars</h4>
                <p className="text-white/80 text-sm mb-3">{menuEngineering.opportunities.populars.suggestion}</p>
                <p className="text-blue-400 font-bold text-xs">Potencial: +€{menuEngineering.opportunities.populars.potential.toFixed(0)}</p>
              </div>
            )}
            {menuEngineering.opportunities.dogs.count > 0 && (
              <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-xl p-4">
                <h4 className="text-red-400 font-bold text-sm mb-2">🐕 Ação - Dogs</h4>
                <p className="text-white/80 text-sm">{menuEngineering.opportunities.dogs.suggestion}</p>
              </div>
            )}
          </div>

          {/* Matriz de Popularidade vs. Lucratividade */}
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                📊 Matriz de Popularidade vs. Lucratividade
              </h3>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-bold text-xs">
                Menu Engineering
              </span>
            </div>
            <MenuEngineeringMatrix data={menuEngineering} />
          </div>

          {/* Detalhes dos Items - Tabela Completa */}
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                📋 Detalhes dos Items
              </h3>
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pesquisar item..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-primary transition-all w-64"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {/* Gerar Novas Análises */}
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover rounded-lg text-white font-bold text-sm transition-all flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  Gerar novas análises
                </button>
              </div>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/60 font-bold text-xs uppercase">Item</th>
                    <th className="text-left py-3 px-4 text-white/60 font-bold text-xs uppercase">Categoria</th>
                    <th className="text-right py-3 px-4 text-white/60 font-bold text-xs uppercase">Custo (€)</th>
                    <th className="text-right py-3 px-4 text-white/60 font-bold text-xs uppercase">Preço Venda (€)</th>
                    <th className="text-right py-3 px-4 text-white/60 font-bold text-xs uppercase">Margem (%)</th>
                    <th className="text-right py-3 px-4 text-white/60 font-bold text-xs uppercase">Vendas (QTD)</th>
                    <th className="text-center py-3 px-4 text-white/60 font-bold text-xs uppercase">Classificação</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ...(menuEngineering.stars || []).map(p => ({ ...p, category: 'Star' })),
                    ...(menuEngineering.gems || []).map(p => ({ ...p, category: 'Gem' })),
                    ...(menuEngineering.populars || []).map(p => ({ ...p, category: 'Popular' })),
                    ...(menuEngineering.dogs || []).map(p => ({ ...p, category: 'Dog' }))
                  ]
                    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((product, index) => {
                      const cost = product.revenue / product.sales * (1 - parseFloat(product.margin) / 100);
                      const price = product.revenue / product.sales;
                      const categoryColors = {
                        Star: 'text-yellow-400',
                        Gem: 'text-green-400',
                        Popular: 'text-blue-400',
                        Dog: 'text-red-400'
                      };
                      const categoryBg = {
                        Star: 'bg-yellow-500/10',
                        Gem: 'bg-green-500/10',
                        Popular: 'bg-blue-500/10',
                        Dog: 'bg-red-500/10'
                      };
                      const categoryEmoji = {
                        Star: '⭐',
                        Gem: '💎',
                        Popular: '🐴',
                        Dog: '🐕'
                      };

                      return (
                        <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 text-white font-semibold text-sm">{product.name}</td>
                          <td className="py-3 px-4 text-white/60 text-sm">{product.classification || 'N/A'}</td>
                          <td className="py-3 px-4 text-white text-sm text-right">€{cost.toFixed(2)}</td>
                          <td className="py-3 px-4 text-white text-sm text-right">€{price.toFixed(2)}</td>
                          <td className="py-3 px-4 text-white font-bold text-sm text-right">{product.margin}%</td>
                          <td className="py-3 px-4 text-white text-sm text-right">{product.sales}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${categoryBg[product.category]} ${categoryColors[product.category]}`}>
                              {categoryEmoji[product.category]} {product.category}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Products Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stars */}
            {menuEngineering.stars.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">⭐ Stars - Manter & Promover</h3>
                <div className="space-y-2">
                  {menuEngineering.stars.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg">
                      <div>
                        <p className="text-white font-semibold text-sm">{p.name}</p>
                        <p className="text-white/60 text-xs">{p.sales} vendas • Margem: {p.margin}%</p>
                      </div>
                      <p className="text-yellow-400 font-bold">€{p.revenue.toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gems */}
            {menuEngineering.gems.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">💎 Gems - Promover Mais</h3>
                <div className="space-y-2">
                  {menuEngineering.gems.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
                      <div>
                        <p className="text-white font-semibold text-sm">{p.name}</p>
                        <p className="text-white/60 text-xs">{p.sales} vendas • Margem: {p.margin}%</p>
                      </div>
                      <p className="text-green-400 font-bold">€{p.revenue.toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Populars */}
            {menuEngineering.populars.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">🐴 Populars - Otimizar Custo</h3>
                <div className="space-y-2">
                  {menuEngineering.populars.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
                      <div>
                        <p className="text-white font-semibold text-sm">{p.name}</p>
                        <p className="text-white/60 text-xs">{p.sales} vendas • Margem: {p.margin}%</p>
                      </div>
                      <p className="text-blue-400 font-bold">€{p.revenue.toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dogs */}
            {menuEngineering.dogs.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">🐕 Dogs - Reformular ou Remover</h3>
                <div className="space-y-2">
                  {menuEngineering.dogs.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg">
                      <div>
                        <p className="text-white font-semibold text-sm">{p.name}</p>
                        <p className="text-white/60 text-xs">{p.sales} vendas • Margem: {p.margin}%</p>
                      </div>
                      <p className="text-red-400 font-bold">€{p.revenue.toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'forecast' && demandForecast && peakHoursHeatmap ? (
        /* AI FORECAST */
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📅</span>
                <span className="text-2xl font-black text-blue-400">7 dias</span>
              </div>
              <h3 className="text-white font-bold text-sm">PREVISÃO</h3>
              <p className="text-white/60 text-xs mt-1">Próxima semana</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">💰</span>
                <span className="text-2xl font-black text-green-400">€{demandForecast.summary.totalRevenue.toFixed(0)}</span>
              </div>
              <h3 className="text-white font-bold text-sm">RECEITA PREVISTA</h3>
              <p className="text-white/60 text-xs mt-1">Total 7 dias</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📊</span>
                <span className="text-2xl font-black text-purple-400">{demandForecast.summary.totalOrders}</span>
              </div>
              <h3 className="text-white font-bold text-sm">PEDIDOS PREVISTOS</h3>
              <p className="text-white/60 text-xs mt-1">Total 7 dias</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🎯</span>
                <span className="text-2xl font-black text-orange-400">{demandForecast.summary.confidence}%</span>
              </div>
              <h3 className="text-white font-bold text-sm">CONFIANÇA</h3>
              <p className="text-white/60 text-xs mt-1">Baseado em 30 dias</p>
            </div>
          </div>

          {/* Insight do Dia */}
          <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border border-orange-500/30 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sparkles size={28} className="text-orange-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    💡 Insight do Dia
                  </h3>
                  <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-400 font-bold text-xs">
                    BETA
                  </span>
                </div>
                <p className="text-white/80 text-base leading-relaxed mb-4">
                  Sexta-feira chuvosa prevista. O modelo sugere reforçar o delivery em 20% e reduzir staff de sala em 1 pessoa.
                </p>
                <button
                  onClick={() => toast.success('✅ Sugestão aplicada! Ajustes automáticos programados.')}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-lg transition-all hover:scale-105 flex items-center gap-2"
                >
                  <CheckCircle size={16} />
                  Aplicar Sugestão
                </button>
              </div>
            </div>
          </div>

          {/* Demand Forecast Chart + Fatores de Influência */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Demand Forecast Chart - 2 cols */}
            <div className="lg:col-span-2 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  📈 Previsão de Demanda - Próximos 7 Dias
                </h3>
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 font-bold text-xs">
                  ML Forecast
                </span>
              </div>
              <DemandForecastChart data={demandForecast} />
            </div>

            {/* Fatores de Influência - 1 col */}
            <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-6">
                🌍 Fatores de Influência
              </h3>
              <div className="space-y-4">
                {/* Meteorologia */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🌤️</span>
                      <h4 className="text-white font-bold text-sm">Meteorologia</h4>
                    </div>
                    <span className="text-blue-400 font-bold text-lg">-15%</span>
                  </div>
                  <p className="text-white/60 text-xs">Chuva forte prevista para Sexta e Sábado</p>
                </div>

                {/* Eventos Locais */}
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎉</span>
                      <h4 className="text-white font-bold text-sm">Eventos Locais</h4>
                    </div>
                    <span className="text-purple-400 font-bold text-lg">+25%</span>
                  </div>
                  <p className="text-white/60 text-xs">Concerto no Pavilhão Atlântico (Domingo)</p>
                </div>

                {/* Sazonalidade */}
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📅</span>
                      <h4 className="text-white font-bold text-sm">Sazonalidade</h4>
                    </div>
                    <span className="text-green-400 font-bold text-lg">+10%</span>
                  </div>
                  <p className="text-white/60 text-xs">Fim de mês (Payday weekend)</p>
                </div>

                {/* Ver todos os fatores */}
                <button
                  onClick={() => toast('📊 Fatores adicionais: Feriados (+5%), Clima histórico (+3%), Tendências de mercado (+2%)', {
                    duration: 4000,
                    icon: '🌍',
                  })}
                  className="w-full mt-2 text-primary hover:text-primary-hover font-bold text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  Ver todos os fatores
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Peak Hours Heatmap + Recomendações + Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Peak Hours Heatmap - 2 cols */}
            <div className="lg:col-span-2 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  🔥 Mapa de Calor - Horários de Pico
                </h3>
                <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 font-bold text-xs">
                  Últimos 30 dias
                </span>
              </div>
              <PeakHoursHeatmap data={peakHoursHeatmap} />
            </div>

            {/* Recomendações da AI + Breakdown por Zona - 1 col */}
            <div className="space-y-6">
              {/* Recomendações da AI */}
              <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">
                  🤖 Recomendações da AI
                </h3>
                <div className="space-y-3">
                  {/* Recomendação 1 */}
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-lg">⚠️</span>
                      <div className="flex-1">
                        <h4 className="text-orange-400 font-bold text-xs mb-1">Reforçar Terça ao Almoço</h4>
                        <p className="text-white/70 text-xs leading-relaxed">
                          A previsão indica um aumento de 25% nas reservas corporativas. Considere +1 empregado de mesa.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toast.success('✅ Escala ajustada automaticamente!')}
                      className="w-full px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-all"
                    >
                      Ajustar Escala
                    </button>
                  </div>

                  {/* Recomendação 2 */}
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-lg">💰</span>
                      <div className="flex-1">
                        <h4 className="text-green-400 font-bold text-xs mb-1">Corte de Custo: Segunda-feira</h4>
                        <p className="text-white/70 text-xs leading-relaxed">
                          Historicamente, segundas das 15h às 18h {'<'} 10 clientes. Reduza a equipa de cozinha ao mínimo.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toast.success('✅ Otimização aplicada!')}
                      className="w-full px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-lg transition-all"
                    >
                      Otimizar
                    </button>
                  </div>
                </div>
              </div>

              {/* Breakdown por Zona */}
              <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4">
                  📍 Breakdown por Zona
                </h3>
                <div className="space-y-4">
                  {/* Sala Principal */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">Sala Principal</span>
                      <span className="text-green-400 font-bold text-sm">85%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: '85%' }}></div>
                    </div>
                  </div>

                  {/* Esplanada */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">Esplanada</span>
                      <span className="text-yellow-400 font-bold text-sm">42%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400" style={{ width: '42%' }}></div>
                    </div>
                  </div>

                  {/* Balcão */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">Balcão</span>
                      <span className="text-red-400 font-bold text-sm">12%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-red-400" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'benchmark' && benchmark ? (
        /* BENCHMARK */
        <div className="space-y-6">
          {/* Performance Card */}
          <div className={`bg-gradient-to-br from-${benchmark.performance.color}-500/10 to-${benchmark.performance.color}-600/5 border border-${benchmark.performance.color}-500/20 rounded-3xl p-8 text-center`}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-${benchmark.performance.color}-500/20 mb-4">
              <span className="text-4xl">
                {benchmark.performance.rating === 'excellent' ? '🏆' :
                 benchmark.performance.rating === 'good' ? '👍' :
                 benchmark.performance.rating === 'average' ? '📊' : '⚠️'}
              </span>
            </div>
            <h2 className="text-3xl font-black text-white mb-2">{benchmark.performance.label}</h2>
            <p className="text-white/60 text-sm mb-4">
              Performance Geral: {benchmark.performance.score.toFixed(0)}% • Segmento: {benchmark.segmentLabel}
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className="bg-white/5 px-4 py-2 rounded-lg">
                <span className="text-white/60">Receita Mensal:</span>
                <span className="ml-2 font-bold text-white">€{benchmark.summary.totalRevenue.toFixed(0)}</span>
              </div>
              <div className="bg-white/5 px-4 py-2 rounded-lg">
                <span className="text-white/60">Pedidos:</span>
                <span className="ml-2 font-bold text-white">{benchmark.summary.totalOrders}</span>
              </div>
              <div className="bg-white/5 px-4 py-2 rounded-lg">
                <span className="text-white/60">Lugares:</span>
                <span className="ml-2 font-bold text-white">{benchmark.summary.totalSeats}</span>
              </div>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(benchmark.comparisons).map(([key, comp]) => (
              <div
                key={key}
                className={`bg-gradient-to-br ${
                  comp.status === 'good'
                    ? 'from-green-500/10 to-green-600/5 border-green-500/20'
                    : 'from-orange-500/10 to-orange-600/5 border-orange-500/20'
                } border rounded-2xl p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white/60 text-xs font-bold uppercase">{comp.label}</h3>
                  <span className="text-xl">{comp.status === 'good' ? '✅' : '⚠️'}</span>
                </div>
                <div className="mb-3">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-black text-white">
                      {comp.label.includes('%') || comp.label.includes('Food Cost')
                        ? `${comp.yours}%`
                        : comp.label.includes('Ticket') || comp.label.includes('Seat')
                        ? `€${comp.yours.toFixed(2)}`
                        : comp.yours.toFixed(1)}
                    </span>
                    <span className="text-xs text-white/60">você</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-white/60">
                      {comp.label.includes('%') || comp.label.includes('Food Cost')
                        ? `${comp.industry}%`
                        : comp.label.includes('Ticket') || comp.label.includes('Seat')
                        ? `€${comp.industry.toFixed(2)}`
                        : comp.industry.toFixed(1)}
                    </span>
                    <span className="text-xs text-white/40">setor</span>
                  </div>
                </div>
                <div className={`text-xs font-bold ${comp.diff >= 0 && comp.label.includes('Food Cost') ? 'text-orange-400' : comp.diff >= 0 ? 'text-green-400' : 'text-orange-400'}`}>
                  {comp.diff > 0 ? '+' : ''}{comp.label.includes('%') || comp.label.includes('Food Cost') ? `${comp.diff}%` : comp.label.includes('Ticket') || comp.label.includes('Seat') ? `€${comp.diff.toFixed(2)}` : comp.diff.toFixed(1)} vs. mercado
                </div>
              </div>
            ))}
          </div>

          {/* Benchmark Chart */}
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                📊 Comparação vs. Setor
              </h3>
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 font-bold text-xs">
                {benchmark.segmentLabel}
              </span>
            </div>
            <BenchmarkChart data={benchmark} />
          </div>

          {/* Opportunities */}
          {benchmark.opportunities && benchmark.opportunities.length > 0 && (
            <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  💡 Oportunidades Identificadas
                </h3>
                <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-400 font-bold text-xs">
                  {benchmark.opportunities.length} Ações
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benchmark.opportunities.map((opp, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${
                      opp.impact === 'high'
                        ? 'from-red-500/10 to-transparent border-red-500/20'
                        : 'from-yellow-500/10 to-transparent border-yellow-500/20'
                    } border rounded-xl p-4`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">
                        {opp.type === 'cost' ? '💰' :
                         opp.type === 'revenue' ? '📈' :
                         opp.type === 'capacity' ? '👥' : '⚙️'}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-sm mb-1">{opp.title}</h4>
                        <span className={`text-xs font-semibold ${
                          opp.impact === 'high' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {opp.impact === 'high' ? 'Alto Impacto' : 'Médio Impacto'}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/70 text-sm mb-3 leading-relaxed">{opp.description}</p>
                    {opp.potentialRevenue !== undefined && (
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <span className="text-green-400 font-bold">+€{opp.potentialRevenue.toFixed(0)}</span>
                        <span className="text-white/60 text-xs ml-2">potencial/mês</span>
                      </div>
                    )}
                    {opp.potentialSavings !== undefined && (
                      <div className="bg-white/5 rounded-lg p-2 text-center">
                        <span className="text-green-400 font-bold">-€{opp.potentialSavings.toFixed(0)}</span>
                        <span className="text-white/60 text-xs ml-2">economia/mês</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Mensal vs. Mercado */}
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                📈 Performance Mensal vs. Mercado
              </h3>
              <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 font-bold text-xs">
                Últimas 4 semanas
              </span>
            </div>
            <div style={{ height: '300px' }}>
              <div className="relative h-full">
                {/* Gráfico simplificado com SVG */}
                <svg viewBox="0 0 800 300" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="50" y1="250" x2="750" y2="250" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                  <line x1="50" y1="187.5" x2="750" y2="187.5" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                  <line x1="50" y1="125" x2="750" y2="125" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                  <line x1="50" y1="62.5" x2="750" y2="62.5" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>

                  {/* Linha Você (azul) */}
                  <polyline
                    points="100,150 275,180 450,160 625,140"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                  />

                  {/* Linha Média (amarela) */}
                  <polyline
                    points="100,170 275,175 450,172 625,165"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                  />

                  {/* Linha Top 10% (verde) */}
                  <polyline
                    points="100,100 275,110 450,105 625,95"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                  />

                  {/* Labels */}
                  <text x="100" y="275" fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="middle">Sem 1</text>
                  <text x="275" y="275" fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="middle">Sem 2</text>
                  <text x="450" y="275" fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="middle">Sem 3</text>
                  <text x="625" y="275" fill="rgba(255,255,255,0.6)" fontSize="12" textAnchor="middle">Sem 4</text>
                </svg>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-blue-500"></div>
                    <span className="text-white/80 text-xs font-semibold">Você</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-yellow-500" style={{ backgroundImage: 'repeating-linear-gradient(to right, #eab308 0px, #eab308 5px, transparent 5px, transparent 10px)' }}></div>
                    <span className="text-white/80 text-xs font-semibold">Média</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-green-500" style={{ backgroundImage: 'repeating-linear-gradient(to right, #22c55e 0px, #22c55e 5px, transparent 5px, transparent 10px)' }}></div>
                    <span className="text-white/80 text-xs font-semibold">Top 10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Análise Detalhada por Categoria */}
          <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                📊 Análise Detalhada por Categoria
              </h3>
              <button
                onClick={() => toast.success('📄 Relatório completo será enviado para o email!')}
                className="text-primary hover:text-primary-hover font-bold text-sm flex items-center gap-1 transition-colors"
              >
                Ver relatório completo
                <ArrowUpRight size={14} />
              </button>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/60 font-bold text-xs uppercase">Métrica</th>
                    <th className="text-right py-3 px-4 text-white/60 font-bold text-xs uppercase">Seu Restaurante</th>
                    <th className="text-right py-3 px-4 text-white/60 font-bold text-xs uppercase">Média do Setor</th>
                    <th className="text-right py-3 px-4 text-white/60 font-bold text-xs uppercase">Top Performers</th>
                    <th className="text-center py-3 px-4 text-white/60 font-bold text-xs uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* CMV */}
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-semibold text-sm">Custo da Matéria Prima (CMV)</td>
                    <td className="py-3 px-4 text-white text-sm text-right font-bold">28%</td>
                    <td className="py-3 px-4 text-white/60 text-sm text-right">30%</td>
                    <td className="py-3 px-4 text-green-400 text-sm text-right font-semibold">25%</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400">
                        ✅ Bom
                      </span>
                    </td>
                  </tr>

                  {/* Rotação de Mesa */}
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-semibold text-sm">Rotação de Mesa</td>
                    <td className="py-3 px-4 text-white text-sm text-right font-bold">1.2x</td>
                    <td className="py-3 px-4 text-white/60 text-sm text-right">1.5x</td>
                    <td className="py-3 px-4 text-green-400 text-sm text-right font-semibold">2.1x</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400">
                        ⚠️ Atenção
                      </span>
                    </td>
                  </tr>

                  {/* Staff Cost */}
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-semibold text-sm">Staff Cost %</td>
                    <td className="py-3 px-4 text-white text-sm text-right font-bold">32%</td>
                    <td className="py-3 px-4 text-white/60 text-sm text-right">35%</td>
                    <td className="py-3 px-4 text-green-400 text-sm text-right font-semibold">28%</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400">
                        ✅ Bom
                      </span>
                    </td>
                  </tr>

                  {/* Receita por m² */}
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-semibold text-sm">Receita por m²</td>
                    <td className="py-3 px-4 text-white text-sm text-right font-bold">€450/m²</td>
                    <td className="py-3 px-4 text-white/60 text-sm text-right">€420/m²</td>
                    <td className="py-3 px-4 text-green-400 text-sm text-right font-semibold">€580/m²</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400">
                        ✅ Bom
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'overview' && stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="RECEITA BRUTA"
            value={stats.receita.formatted}
            trend={stats.receita.trend}
          isUp={stats.receita.isUp}
          subtitle={stats.receita.vs}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="CLIENTES (COVERS)"
          value={stats.clientes.value}
          trend={stats.clientes.trend}
          isUp={stats.clientes.isUp}
          subtitle={stats.clientes.vs}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="TICKET MÉDIO"
          value={stats.ticketMedio.formatted}
          trend={stats.ticketMedio.trend}
          isUp={stats.ticketMedio.isUp}
          subtitle={stats.ticketMedio.vs}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="FOOD COST %"
          value={stats.foodCost.formatted}
          trend={stats.foodCost.trend}
          isUp={stats.foodCost.isUp}
          subtitle={stats.foodCost.vs}
          icon={AlertTriangle}
          color="orange"
        />
      </div>
      ) : null}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tendência de Vendas - 2 cols */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              📈 Tendência de Vendas {trendPeriod === 'hoje' ? '(Hora a Hora)' : trendPeriod === 'semana' ? '(7 Dias)' : '(30 Dias)'}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTrendPeriod('hoje')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  trendPeriod === 'hoje'
                    ? 'bg-primary/20 border border-primary/40 text-primary'
                    : 'bg-white/5 hover:bg-white/10 text-white/60'
                }`}
              >
                Hoje
              </button>
              <button
                onClick={() => setTrendPeriod('semana')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  trendPeriod === 'semana'
                    ? 'bg-primary/20 border border-primary/40 text-primary'
                    : 'bg-white/5 hover:bg-white/10 text-white/60'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setTrendPeriod('mes')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all ${
                  trendPeriod === 'mes'
                    ? 'bg-primary/20 border border-primary/40 text-primary'
                    : 'bg-white/5 hover:bg-white/10 text-white/60'
                }`}
              >
                Mês
              </button>
            </div>
          </div>

          {/* Chart Real */}
          <SalesTrendChart data={salesTrends} period={trendPeriod} />

          {/* Insight da IA */}
          {aiPrediction && (
            <div className="mt-4 p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Sparkles size={20} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white text-sm">iaMenu Previsão IA</h4>
                    <span className="text-xs text-orange-400 font-semibold">
                      {aiPrediction.confidence}% confiança • {aiPrediction.dayOfWeek}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm">
                    {aiPrediction.suggestion}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      onClick={() => {
                        toast.success(`✅ ${aiPrediction.action} confirmada! Prepare ${aiPrediction.estimatedCovers} cobertos e mantenha stock normal.`);
                      }}
                      className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-all hover:scale-105"
                    >
                      {aiPrediction.action}
                    </button>
                    <span className="text-xs text-white/60">
                      Estimativa: <strong className="text-white">{aiPrediction.estimatedCovers} cobertos</strong> • €{aiPrediction.estimatedRevenue.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top 5 Pratos - 1 col */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              🏆 Top 5 Pratos (Margem)
            </h3>
            <button
              onClick={() => setActiveTab('menu')}
              className="text-primary hover:text-primary-hover font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Ver Menu →
            </button>
          </div>
          <div className="space-y-3">
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((produto, index) => (
                <div key={produto.id} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      index === 1 ? 'bg-gray-400/20 text-gray-300' :
                      index === 2 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-white/10 text-white/60'
                    } flex items-center justify-center font-black text-sm`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm group-hover:text-primary transition-colors">{produto.name}</p>
                      <p className="text-white/40 text-xs capitalize">{produto.classification}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-sm">€{produto.revenue.toFixed(2)}</p>
                    <p className={`text-xs font-bold ${produto.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {produto.margin}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-sm text-center py-4">Sem produtos disponíveis</p>
            )}
          </div>
        </div>
      </div>

      {/* Alerts & Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                🚨 Alertas Críticos
              </h3>
              <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 font-bold text-xs">
                {alerts.length} Novos
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onDismiss={handleDismissAlert}
                onAction={handleAlertAction}
              />
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                💰 Oportunidades
              </h3>
              {alerts && alerts.length > 0 && (
                <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 font-bold text-xs">
                  {alerts.length} oportunidades
                </span>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {alerts && alerts.length > 0 ? (
              alerts.filter(a => a.type !== 'critical' && a.type !== 'warning').map((opp) => (
                <AlertCard
                  key={opp.id || opp.title}
                  alert={opp}
                  isOpportunity
                  onDismiss={handleDismissAlert}
                  onAction={handleAlertAction}
                />
              ))
            ) : (
              <p className="text-white/40 text-sm text-center py-4">Sem oportunidades no momento</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction
          icon="📊"
          title="Editar Fichas Técnicas"
          subtitle="Atualizar custos e receitas"
          onClick={handleNavigateToFoodCost}
        />
        <QuickAction
          icon="💰"
          title="Ajustar Preços de Venda"
          subtitle="Otimizar margem de lucro"
          onClick={handleNavigateToFoodCost}
        />
        <QuickAction
          icon="📈"
          title="Ver Análise Completa"
          subtitle="Todos os alertas e oportunidades"
          onClick={() => setView && setView('alerts')}
        />
        <QuickAction
          icon="🤖"
          title="Sugestões da IA"
          subtitle="Menu engineering automático"
          onClick={() => setActiveTab('menu')}
        />
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, trend, isUp, subtitle, icon: Icon, color }) => {
  const colorClasses = {
    green: 'from-green-500/10 to-green-600/5 border-green-500/20',
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20',
    orange: 'from-orange-500/10 to-orange-600/5 border-orange-500/20'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 backdrop-blur-xl hover:scale-105 transition-all cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
          <Icon size={24} className="text-white" />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-xs ${
          isUp ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <h3 className="text-3xl font-black text-white mb-2">{value}</h3>
      <p className="text-xs font-bold text-white/40 uppercase tracking-wider">{title}</p>
      <p className="text-xs text-white/60 mt-1">{subtitle}</p>
    </motion.div>
  );
};

// Alert Card Component
const AlertCard = ({ alert, isOpportunity = false, onDismiss, onAction }) => {
  // Mapear tipo para ícone
  const getIcon = () => {
    switch (alert.type) {
      case 'critical':
        return AlertTriangle;
      case 'warning':
        return AlertCircle;
      case 'revenue':
        return TrendingUp;
      case 'capacity':
        return Info;
      default:
        return Info;
    }
  };

  const Icon = getIcon();
  const borderColor = alert.type === 'critical' ? 'border-red-500/30' :
                      alert.type === 'warning' ? 'border-yellow-500/30' :
                      alert.type === 'revenue' ? 'border-green-500/30' :
                      'border-blue-500/30';

  const bgColor = alert.type === 'critical' ? 'from-red-500/10' :
                  alert.type === 'warning' ? 'from-yellow-500/10' :
                  alert.type === 'revenue' ? 'from-green-500/10' :
                  'from-blue-500/10';

  const iconColor = alert.type === 'critical' ? 'text-red-400' :
                    alert.type === 'warning' ? 'text-yellow-400' :
                    alert.type === 'revenue' ? 'text-green-400' :
                    'text-blue-400';

  const actionColor = alert.type === 'critical' ? 'bg-red-500 hover:bg-red-600' :
                      alert.type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
                      alert.type === 'revenue' ? 'bg-green-500 hover:bg-green-600' :
                      'bg-blue-500 hover:bg-blue-600';

  return (
    <div className={`bg-gradient-to-br ${bgColor} to-transparent border ${borderColor} rounded-xl p-4`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 ${iconColor}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-sm mb-0.5">{alert.title}</h4>
          <p className={`text-xs font-semibold ${iconColor}`}>{alert.subtitle}</p>
        </div>
        <span className="text-xs text-white/40 font-medium flex-shrink-0">{alert.time}</span>
      </div>
      <p className="text-white/70 text-sm mb-3 leading-relaxed">{alert.description}</p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => onDismiss && onDismiss(alert.id || alert.title)}
          className="text-white/60 hover:text-white font-semibold text-xs transition-colors hover:underline"
        >
          Dismiss
        </button>
        <button
          onClick={() => onAction && onAction(alert)}
          className={`px-4 py-2 ${actionColor} text-white font-bold text-xs rounded-lg transition-all hover:scale-105`}
        >
          {alert.action}
        </button>
      </div>
    </div>
  );
};

// Quick Action Component
const QuickAction = ({ icon, title, subtitle, onClick }) => (
  <button
    onClick={onClick}
    className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all group text-left hover:scale-105"
  >
    <div className="text-3xl mb-2">{icon}</div>
    <h4 className="font-bold text-white text-sm mb-1 group-hover:text-primary transition-colors">{title}</h4>
    <p className="text-xs text-white/60">{subtitle}</p>
  </button>
);

export default DashboardBI;
