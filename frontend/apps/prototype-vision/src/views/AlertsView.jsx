import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  TrendingUp,
  Download,
  RefreshCcw,
  ArrowLeft
} from 'lucide-react';
import { DashboardAPI } from '../services/businessAPI';
import toast, { Toaster } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const AlertsView = ({ setView }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar alertas da API
  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const response = await DashboardAPI.getAlerts();
      setAlerts(response.data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      // Fallback para dados mock se API falhar
      setAlerts([
        {
          id: '1',
          type: 'critical',
          title: 'Food Cost Elevado',
          subtitle: 'Produto: Bacalhau à Brás',
          description: 'O custo do bacalhau aumentou 15% esta semana, empurrando o prato "Bacalhau à Brás" para margem abaixo de 70%.',
          time: '2h atrás',
          action: 'Rever Produto'
        },
        {
          id: '2',
          type: 'warning',
          title: 'Receita Abaixo da Meta',
          subtitle: 'Categoria: Sobremesas',
          description: 'Vendas de sobremesas -12% vs. semana anterior. Considere promover ou ajustar preços.',
          time: '5h atrás',
          action: 'Ver Estratégias'
        },
        {
          id: '3',
          type: 'revenue',
          title: 'Oportunidade de Upsell',
          subtitle: 'Alta demanda: Vinhos',
          description: 'Clientes estão a pedir vinhos premium. Aumente stock e crie combo menu+vinho.',
          time: '1d atrás',
          action: 'Ver Sugestões'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar/refresh dos dados
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
    toast.success('Dados atualizados!');
  };

  // Função para exportar relatório
  const handleExport = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Alerts & Opportunities Report', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Real-time insights to optimize your restaurant\'s performance', 105, 28, { align: 'center' });

    doc.setFontSize(10);
    const now = new Date();
    doc.text(`Generated on: ${now.toLocaleDateString('pt-PT')} at ${now.toLocaleTimeString('pt-PT')}`, 105, 35, { align: 'center' });

    // Linha separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 40, 190, 40);

    let yPos = 50;

    // Summary Statistics
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Summary', 20, yPos);
    yPos += 10;

    const summaryData = [
      ['Category', 'Count', 'Status'],
      ['Critical Alerts', criticalAlerts.length.toString(), 'Requires immediate attention'],
      ['Warnings', warnings.length.toString(), 'Stable since yesterday'],
      ['Opportunities', opportunities.length.toString(), `Potential Revenue: €${potentialRevenue}`]
    ];

    autoTable(doc, {
      startY: yPos,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [255, 107, 53], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // All Alerts
    if (alerts.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('All Alerts & Opportunities', 20, yPos);
      yPos += 10;

      const alertsData = [
        ['Type', 'Title', 'Description', 'Time'],
        ...alerts.map(a => [
          a.type.toUpperCase(),
          a.title,
          a.description.substring(0, 80) + (a.description.length > 80 ? '...' : ''),
          a.time
        ])
      ];

      autoTable(doc, {
        startY: yPos,
        head: [alertsData[0]],
        body: alertsData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [255, 107, 53], textColor: 255 },
        styles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 45 },
          2: { cellWidth: 90 },
          3: { cellWidth: 20 }
        },
        margin: { left: 20, right: 20 }
      });
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
      doc.text(
        'Generated with iaMenu Business Intelligence',
        105,
        doc.internal.pageSize.height - 5,
        { align: 'center' }
      );
    }

    // Download
    const fileName = `alerts-report-${now.toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    toast.success('Relatório exportado com sucesso!');
  };

  // Função para remover alerta (dismiss)
  const handleDismissAlert = (alertId) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
    toast.success('Alerta removido');
  };

  // Handler para ações dos alertas
  const handleAlertAction = (alert) => {
    if (alert.action === 'Rever Produto' || alert.action === 'Ver Detalhes') {
      if (setView) {
        setView('foodcost');
      }
    } else if (alert.action === 'Ver Estratégias' || alert.action === 'Ver Sugestões') {
      if (setView) {
        setView('marketing');
      }
    } else {
      toast('🚧 ' + alert.action + ' disponível em breve!', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151',
        },
      });
    }
  };

  // Calcular estatísticas dos alertas
  const criticalAlerts = alerts.filter(a => a.type === 'critical');
  const warnings = alerts.filter(a => a.type === 'warning');
  const opportunities = alerts.filter(a => a.type === 'revenue' || a.type === 'capacity');

  // Calcular potencial revenue (mock - seria calculado pela API)
  const potentialRevenue = opportunities.length * 310;

  // Filtrar alertas baseado na tab ativa
  const getFilteredAlerts = () => {
    switch (activeTab) {
      case 'critical':
        return criticalAlerts;
      case 'warnings':
        return warnings;
      case 'opportunities':
        return opportunities;
      default:
        return alerts;
    }
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <div className="space-y-8">
      {/* Toast Notifications */}
      <Toaster />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView && setView('dashboard')}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-white mb-2 tracking-tight italic"
            >
              ALERTS & OPPORTUNITIES
            </motion.h1>
            <p className="text-white/40 font-bold text-sm uppercase tracking-wider">
              Real-time insights to optimize your restaurant's performance.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCcw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Updating...' : 'Update Data'}
          </button>
          <button
            onClick={handleExport}
            className="px-6 py-2 bg-primary hover:bg-primary-hover rounded-xl text-white font-bold text-sm transition-all flex items-center gap-2"
          >
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Critical Alerts */}
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <span className="text-4xl font-black text-red-400">{criticalAlerts.length}</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-1">CRITICAL ALERTS</h3>
          <p className="text-red-400 text-sm font-semibold">⚠️ Requires immediate attention</p>
        </div>

        {/* Warnings */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <AlertCircle size={24} className="text-yellow-400" />
            </div>
            <span className="text-4xl font-black text-yellow-400">{warnings.length}</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-1">WARNINGS</h3>
          <p className="text-yellow-400 text-sm font-semibold">📊 Stable since yesterday</p>
        </div>

        {/* Potential Revenue */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={24} className="text-green-400" />
            </div>
            <span className="text-4xl font-black text-green-400">+€{potentialRevenue}</span>
          </div>
          <h3 className="text-white font-bold text-lg mb-1">POTENTIAL REVENUE</h3>
          <p className="text-green-400 text-sm font-semibold">💡 {opportunities.length} Opportunities identified</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'all'
              ? 'bg-primary text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          All Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab('critical')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'critical'
              ? 'bg-primary text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Critical ({criticalAlerts.length})
        </button>
        <button
          onClick={() => setActiveTab('warnings')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'warnings'
              ? 'bg-primary text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Warnings ({warnings.length})
        </button>
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
            activeTab === 'opportunities'
              ? 'bg-primary text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          Opportunities ({opportunities.length})
        </button>
      </div>

      {/* Alert Cards Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-white/60">Loading alerts...</p>
        </div>
      ) : filteredAlerts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDismiss={handleDismissAlert}
              onAction={handleAlertAction}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/40 text-lg">No alerts in this category</p>
        </div>
      )}
    </div>
  );
};

// Alert Card Component (expandido)
const AlertCard = ({ alert, onDismiss, onAction }) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${bgColor} to-transparent border ${borderColor} rounded-xl p-6`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 ${iconColor}`}>
          <Icon size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-lg mb-1">{alert.title}</h4>
          <p className={`text-sm font-semibold ${iconColor}`}>{alert.subtitle}</p>
        </div>
        <span className="text-sm text-white/40 font-medium flex-shrink-0">{alert.time}</span>
      </div>
      <p className="text-white/70 text-sm mb-4 leading-relaxed">{alert.description}</p>
      <div className="flex items-center justify-between">
        <button
          onClick={() => onDismiss && onDismiss(alert.id)}
          className="text-white/60 hover:text-white font-semibold text-sm transition-colors hover:underline"
        >
          Dismiss
        </button>
        <button
          onClick={() => onAction && onAction(alert)}
          className={`px-6 py-2.5 ${actionColor} text-white font-bold text-sm rounded-lg transition-all hover:scale-105`}
        >
          {alert.action}
        </button>
      </div>
    </motion.div>
  );
};

export default AlertsView;
