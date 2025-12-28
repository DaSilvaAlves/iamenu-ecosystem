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

const DashboardBI = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('semana');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar stats da API
  useEffect(() => {
    loadStats();
  }, [selectedPeriod]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await DashboardAPI.getStats(selectedPeriod);
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
      // Fallback para dados mock
      setStats({
        receita: { formatted: '€0', trend: '0%', isUp: true, vs: 'Sem dados' },
        clientes: { value: 0, trend: '0%', isUp: false, vs: 'Sem dados' },
        ticketMedio: { formatted: '€0', trend: '0%', isUp: true, vs: 'Sem dados' },
        foodCost: { formatted: '0%', trend: 'Sem dados', isUp: true, vs: 'Sem dados' }
      });
    } finally {
      setLoading(false);
    }
  };

  const alerts = [
    {
      id: 1,
      type: 'critical',
      icon: AlertTriangle,
      title: 'Food Cost Spike',
      subtitle: 'Critical Impact • Salmão Fillet',
      description: 'The cost of Salmão Fillet has increased by 15% this week, pushing the dish "Grilled Salmão" margin below the 70% threshold.',
      time: '2h ago',
      action: 'Review Recipe'
    },
    {
      id: 2,
      type: 'warning',
      icon: AlertCircle,
      title: 'Reputation Dip',
      subtitle: 'Warning • Google Reviews',
      description: 'Your rating dropped by 0.1 stars due to 2 negative reviews mentioning "Slow Service" during lunch hour yesterday.',
      time: '1d ago',
      action: 'View Reviews'
    }
  ];

  const opportunities = [
    {
      id: 1,
      type: 'revenue',
      icon: TrendingUp,
      title: 'High Demand Expected',
      subtitle: 'Opportunity • Meso Filler',
      description: 'Local event "Jazz Festival" is bringing +40% traffic to your area next Friday. You have 8 tables unreserved.',
      time: '5h ago',
      action: 'Create Promo'
    },
    {
      id: 2,
      type: 'stock',
      icon: Info,
      title: 'Dead Stock Alert',
      subtitle: 'Opportunity • Wine Cellar',
      description: '"Vinho Verde Casa" hasn\'t sold in 30 days. Recommend creating a bundle with "Seafood Platter" to clear inventory.',
      time: '2d ago',
      action: 'Create Bundle'
    }
  ];

  const topPratos = [
    { name: 'Bacalhau à Brás', vendas: '€18.50', margem: 'High Profit', trend: '+12%' },
    { name: 'Polvo à Lagareiro', vendas: '€22.00', margem: 'High Profit', trend: '+8%' },
    { name: 'Pizza Margherita', vendas: '€12.50', margem: 'Popular', trend: '+5%' },
    { name: 'Mousse Chocolate', vendas: '€5.50', margem: 'Popular', trend: '+3%' },
    { name: 'Arroz de Pato', vendas: '€21.00', margem: 'Opportunity', trend: '-2%' }
  ];

  return (
    <div className="space-y-8">
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
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold text-sm transition-all flex items-center gap-2">
            <RefreshCcw size={16} />
            Atualizar
          </button>
          <button className="px-6 py-2 bg-primary hover:bg-primary-hover rounded-xl text-white font-bold text-sm transition-all flex items-center gap-2">
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

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-white/60">Carregando estatísticas...</p>
        </div>
      ) : stats ? (
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
          value={stats.ticketMedio.value}
          trend={stats.ticketMedio.trend}
          isUp={stats.ticketMedio.isUp}
          subtitle={stats.ticketMedio.vs}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="FOOD COST %"
          value={stats.foodCost.value}
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
              📈 Tendência de Vendas (Hora a Hora)
            </h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-primary/20 border border-primary/40 rounded-lg text-primary font-bold text-xs">
                Hoje
              </button>
              <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 font-semibold text-xs transition-all">
                Semana
              </button>
              <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-white/60 font-semibold text-xs transition-all">
                Mês
              </button>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="h-64 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp size={48} className="mx-auto mb-3 text-white/20" />
              <p className="text-white/40 font-semibold text-sm">Gráfico de Tendências</p>
              <p className="text-white/20 text-xs mt-1">(Integrar Chart.js aqui)</p>
            </div>
          </div>

          {/* Insight da IA */}
          <div className="mt-4 p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Sparkles size={20} className="text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white mb-1 text-sm">iaMenu Previsão IA</h4>
                <p className="text-white/80 text-sm">
                  Com base no histórico e eventos locais, prevemos um aumento de <strong>25%</strong> na procura para o jantar de sexta-feira. Preparar +15kg de Bacalhau e reforçar staff de sala (2 pax) para o turno das 19:00.
                </p>
                <button className="mt-2 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-all">
                  Ver Detalhes da Previsão
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top 5 Pratos - 1 col */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              🏆 Top 5 Pratos (Margem)
            </h3>
            <a href="#" className="text-primary hover:text-primary-hover font-bold text-xs uppercase tracking-wider transition-colors">
              Ver Menu →
            </a>
          </div>
          <div className="space-y-3">
            {topPratos.map((prato, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer group">
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
                    <p className="text-white font-semibold text-sm group-hover:text-primary transition-colors">{prato.name}</p>
                    <p className="text-white/40 text-xs">{prato.margem}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">{prato.vendas}</p>
                  <p className={`text-xs font-bold ${prato.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {prato.trend}
                  </p>
                </div>
              </div>
            ))}
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
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                💰 Potential Revenue
              </h3>
              <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 font-bold text-xs">
                +€1,240
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {opportunities.map((opp) => (
              <AlertCard key={opp.id} alert={opp} isOpportunity />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction
          icon="📊"
          title="Editar Fichas Técnicas"
          subtitle="Atualizar custos e receitas"
        />
        <QuickAction
          icon="💰"
          title="Ajustar Preços de Venda"
          subtitle="Otimizar margem de lucro"
        />
        <QuickAction
          icon="📈"
          title="Ver Análise Completa"
          subtitle="Relatório detalhado em PDF"
        />
        <QuickAction
          icon="🤖"
          title="Sugestões da IA"
          subtitle="Menu engineering automático"
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
const AlertCard = ({ alert, isOpportunity = false }) => {
  const Icon = alert.icon;
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
        <button className="text-white/60 hover:text-white font-semibold text-xs transition-colors">
          Dismiss
        </button>
        <button className={`px-4 py-2 ${actionColor} text-white font-bold text-xs rounded-lg transition-all`}>
          {alert.action}
        </button>
      </div>
    </div>
  );
};

// Quick Action Component
const QuickAction = ({ icon, title, subtitle }) => (
  <button className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all group text-left">
    <div className="text-3xl mb-2">{icon}</div>
    <h4 className="font-bold text-white text-sm mb-1 group-hover:text-primary transition-colors">{title}</h4>
    <p className="text-xs text-white/60">{subtitle}</p>
  </button>
);

export default DashboardBI;
