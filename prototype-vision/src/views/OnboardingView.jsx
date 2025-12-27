import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  Check,
  Loader2,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Users,
  Clock,
  MapPin,
  Utensils,
  FileSpreadsheet
} from 'lucide-react';

const OnboardingView = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Dados Básicos
    restaurantName: '',
    address: '',
    cuisine: '',
    tables: '',
    openHour: '12:00',
    closeHour: '23:00',

    // Step 2: Menu
    menuUploadType: 'excel', // 'excel' or 'manual'
    menuFile: null,
    menuItems: [],

    // Step 3: Financeiro
    monthlyCosts: '',
    staffCount: '',
    averageTicket: '',
    suppliers: '',

    // Step 4: Objetivos
    revenueGoal: '',
    foodCostTarget: '30',
    tableRotation: '3',
    segment: 'casual'
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    {
      id: 0,
      title: 'Dados do Restaurante',
      subtitle: 'Informações básicas do seu negócio',
      icon: '🍽️',
      color: '#ff4d00'
    },
    {
      id: 1,
      title: 'Configuração de Menu',
      subtitle: 'Upload do cardápio ou adição manual',
      icon: '📋',
      color: '#3b82f6'
    },
    {
      id: 2,
      title: 'Dados Financeiros',
      subtitle: 'Custos e estrutura da equipa',
      icon: '💰',
      color: '#f59e0b'
    },
    {
      id: 3,
      title: 'Objetivos & Metas',
      subtitle: 'Defina os targets do seu restaurante',
      icon: '🎯',
      color: '#8b5cf6'
    },
    {
      id: 4,
      title: 'Análise Inteligente',
      subtitle: 'A nossa IA está a processar os dados',
      icon: '🤖',
      color: '#ec4899'
    },
    {
      id: 5,
      title: 'Dashboard Pronto!',
      subtitle: 'Veja os primeiros insights',
      icon: '🎉',
      color: '#ff4d00'
    }
  ];

  const currentStepData = steps[currentStep];

  const nextStep = () => {
    if (currentStep === 3) {
      // Trigger IA processing
      setCurrentStep(4);
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep(5);
      }, 3000);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0 && currentStep !== 4) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('iaMenu_onboarding_setup_completed', 'true');
    if (onComplete) {
      onComplete(); // Navigate to Dashboard Business Intel
    }
  };

  // Step 1: Dados Básicos
  const renderStep1 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <div className="form-group">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          <Utensils size={16} className="inline mr-2" />
          Nome do Restaurante *
        </label>
        <input
          type="text"
          value={formData.restaurantName}
          onChange={(e) => updateFormData('restaurantName', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff4d00] transition-all"
          placeholder="Ex: Restaurante O Pátio"
        />
      </div>

      <div className="form-group">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          <MapPin size={16} className="inline mr-2" />
          Morada
        </label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => updateFormData('address', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff4d00] transition-all"
          placeholder="Ex: Rua das Flores, 123, Lisboa"
        />
      </div>

      <div className="form-group">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          Tipo de Cozinha *
        </label>
        <select
          value={formData.cuisine}
          onChange={(e) => updateFormData('cuisine', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#ff4d00] transition-all"
        >
          <option value="">Selecione...</option>
          <option value="portuguesa">Portuguesa</option>
          <option value="italiana">Italiana</option>
          <option value="japonesa">Japonesa</option>
          <option value="fusion">Fusion</option>
          <option value="vegetariana">Vegetariana</option>
          <option value="outra">Outra</option>
        </select>
      </div>

      <div className="form-group">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          <Users size={16} className="inline mr-2" />
          Número de Mesas
        </label>
        <input
          type="number"
          value={formData.tables}
          onChange={(e) => updateFormData('tables', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff4d00] transition-all"
          placeholder="Ex: 20"
        />
      </div>

      <div className="form-group">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          <Clock size={16} className="inline mr-2" />
          Horário de Abertura
        </label>
        <input
          type="time"
          value={formData.openHour}
          onChange={(e) => updateFormData('openHour', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#ff4d00] transition-all"
        />
      </div>

      <div className="form-group">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          <Clock size={16} className="inline mr-2" />
          Horário de Fecho
        </label>
        <input
          type="time"
          value={formData.closeHour}
          onChange={(e) => updateFormData('closeHour', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#ff4d00] transition-all"
        />
      </div>
    </div>
  );

  // Step 2: Menu Upload
  const renderStep2 = () => (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => updateFormData('menuUploadType', 'excel')}
          className={`p-6 rounded-xl border-2 transition-all ${
            formData.menuUploadType === 'excel'
              ? 'border-[#ff4d00] bg-[#ff4d00]/10'
              : 'border-white/20 hover:border-white/40'
          }`}
        >
          <FileSpreadsheet size={32} className="mx-auto mb-3 text-[#ff4d00]" />
          <h4 className="font-bold text-white mb-1">Upload Excel</h4>
          <p className="text-sm text-white/60">Mais rápido (Recomendado)</p>
        </button>

        <button
          onClick={() => updateFormData('menuUploadType', 'manual')}
          className={`p-6 rounded-xl border-2 transition-all ${
            formData.menuUploadType === 'manual'
              ? 'border-[#ff4d00] bg-[#ff4d00]/10'
              : 'border-white/20 hover:border-white/40'
          }`}
        >
          <Utensils size={32} className="mx-auto mb-3 text-[#ff4d00]" />
          <h4 className="font-bold text-white mb-1">Adicionar Manual</h4>
          <p className="text-sm text-white/60">Criar do zero</p>
        </button>
      </div>

      {formData.menuUploadType === 'excel' ? (
        <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-12 text-center">
          <Upload size={48} className="mx-auto mb-4 text-white/40" />
          <h4 className="text-lg font-bold text-white mb-2">Arraste o ficheiro Excel</h4>
          <p className="text-white/60 mb-4">ou clique para selecionar</p>
          <label className="inline-block px-6 py-3 bg-[#ff4d00] hover:bg-[#e64500] text-white font-bold rounded-xl cursor-pointer transition-all">
            Selecionar Ficheiro
            <input type="file" accept=".xlsx,.xls" className="hidden" />
          </label>
          <p className="text-xs text-white/40 mt-4">
            <a href="#" className="text-[#ff4d00] hover:underline">Baixar template Excel</a>
          </p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/20 rounded-xl p-6">
          <p className="text-white/60 text-center mb-4">Adicione pratos manualmente (pode fazer depois)</p>
          <button className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all">
            + Adicionar Prato
          </button>
        </div>
      )}
    </div>
  );

  // Step 3: Financeiro
  const renderStep3 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <div className="form-group">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          <DollarSign size={16} className="inline mr-2" />
          Custos Fixos Mensais (€)
        </label>
        <input
          type="number"
          value={formData.monthlyCosts}
          onChange={(e) => updateFormData('monthlyCosts', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff4d00] transition-all"
          placeholder="Ex: 5000"
        />
        <p className="text-xs text-white/40 mt-1">Renda, água, luz, gás, etc.</p>
      </div>

      <div className="form-group">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          <Users size={16} className="inline mr-2" />
          Número de Funcionários
        </label>
        <input
          type="number"
          value={formData.staffCount}
          onChange={(e) => updateFormData('staffCount', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff4d00] transition-all"
          placeholder="Ex: 8"
        />
      </div>

      <div className="form-group">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          Ticket Médio Atual (€)
        </label>
        <input
          type="number"
          value={formData.averageTicket}
          onChange={(e) => updateFormData('averageTicket', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff4d00] transition-all"
          placeholder="Ex: 25.50"
        />
        <p className="text-xs text-white/40 mt-1">Valor médio por cliente</p>
      </div>

      <div className="form-group">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          Principais Fornecedores
        </label>
        <input
          type="text"
          value={formData.suppliers}
          onChange={(e) => updateFormData('suppliers', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff4d00] transition-all"
          placeholder="Ex: Fornecedor A, Fornecedor B"
        />
      </div>
    </div>
  );

  // Step 4: Objetivos
  const renderStep4 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <div className="form-group">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          <TrendingUp size={16} className="inline mr-2" />
          Meta de Receita Mensal (€)
        </label>
        <input
          type="number"
          value={formData.revenueGoal}
          onChange={(e) => updateFormData('revenueGoal', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff4d00] transition-all"
          placeholder="Ex: 50000"
        />
      </div>

      <div className="form-group">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          Food Cost % Ideal
        </label>
        <input
          type="number"
          value={formData.foodCostTarget}
          onChange={(e) => updateFormData('foodCostTarget', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff4d00] transition-all"
          placeholder="30"
        />
        <p className="text-xs text-white/40 mt-1">Recomendado: 28-32%</p>
      </div>

      <div className="form-group">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          Rotação de Mesa Alvo
        </label>
        <input
          type="number"
          value={formData.tableRotation}
          onChange={(e) => updateFormData('tableRotation', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#ff4d00] transition-all"
          placeholder="3"
        />
        <p className="text-xs text-white/40 mt-1">Vezes por serviço</p>
      </div>

      <div className="form-group">
        <label className="block text-sm font-semibold text-white/80 mb-2">
          Segmento do Restaurante
        </label>
        <select
          value={formData.segment}
          onChange={(e) => updateFormData('segment', e.target.value)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#ff4d00] transition-all"
        >
          <option value="fast-casual">Fast Casual</option>
          <option value="casual">Casual Dining</option>
          <option value="fine-dining">Fine Dining</option>
          <option value="fast-food">Fast Food</option>
        </select>
      </div>
    </div>
  );

  // Step 5: Processing
  const renderStep5 = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <Loader2 size={64} className="mx-auto text-[#ff4d00] animate-spin" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">A Nossa IA Está a Trabalhar...</h3>
      <div className="space-y-3 text-left max-w-md mx-auto">
        <div className="flex items-center gap-3 text-white/80">
          <Check size={20} className="text-[#ff4d00]" />
          <span>Analisando estrutura de menu</span>
        </div>
        <div className="flex items-center gap-3 text-white/80">
          <Check size={20} className="text-[#ff4d00]" />
          <span>Calculando rentabilidade por prato</span>
        </div>
        <div className="flex items-center gap-3 text-white/80">
          <Loader2 size={20} className="text-[#ff4d00] animate-spin" />
          <span>Gerando insights personalizados...</span>
        </div>
      </div>
    </div>
  );

  // Step 6: Results
  const renderStep6 = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-3xl font-black text-white mb-2">Dashboard Configurado!</h3>
        <p className="text-white/60">Já identificámos oportunidades de melhoria</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <TrendingUp size={24} className="text-green-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-white mb-1">Potencial de Receita</h4>
              <p className="text-2xl font-black text-green-400 mb-2">+€1,240</p>
              <p className="text-sm text-white/60">4 oportunidades identificadas</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle size={24} className="text-yellow-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-white mb-1">Alertas Críticos</h4>
              <p className="text-2xl font-black text-yellow-400 mb-2">3</p>
              <p className="text-sm text-white/60">Requerem atenção imediata</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/20 rounded-xl p-6 mb-8">
        <h4 className="font-bold text-white mb-4">🎯 Primeiras Recomendações:</h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-white/80">
            <span className="text-green-400">✓</span>
            <span><strong>Menu Engineering:</strong> 3 pratos com alta margem mas baixas vendas. Promova-os!</span>
          </li>
          <li className="flex items-start gap-3 text-white/80">
            <span className="text-yellow-400">⚠</span>
            <span><strong>Food Cost:</strong> "Bacalhau à Brás" tem custo 15% acima do ideal. Reveja fornecedor.</span>
          </li>
          <li className="flex items-start gap-3 text-white/80">
            <span className="text-blue-400">ℹ</span>
            <span><strong>Peak Hours:</strong> Sexta 20h-22h está a 98% de ocupação. Considere reservas.</span>
          </li>
        </ul>
      </div>

      <button
        onClick={completeOnboarding}
        className="w-full px-8 py-4 bg-[#ff4d00] hover:bg-[#e64500] text-white font-black text-lg rounded-xl transition-all shadow-lg shadow-[#ff4d00]/30"
      >
        Ir para o Dashboard →
      </button>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderStep1();
      case 1: return renderStep2();
      case 2: return renderStep3();
      case 3: return renderStep4();
      case 4: return renderStep5();
      case 5: return renderStep6();
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] p-8 overflow-y-auto"
    >
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                      index <= currentStep
                        ? 'bg-[#ff4d00] shadow-lg shadow-[#ff4d00]/30'
                        : 'bg-white/10'
                    }`}
                  >
                    {index < currentStep ? '✓' : step.icon}
                  </div>
                  <span className={`text-xs mt-2 hidden md:block ${index <= currentStep ? 'text-white font-semibold' : 'text-white/40'}`}>
                    Step {index + 1}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${index < currentStep ? 'bg-[#ff4d00]' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-black text-white mb-2">
                {currentStepData.title}
              </h1>
              <p className="text-lg text-white/60">{currentStepData.subtitle}</p>
            </div>

            {/* Step Content */}
            <div className="mb-12">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            {currentStep !== 4 && currentStep !== 5 && (
              <div className="flex justify-center gap-4">
                {currentStep > 0 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
                  >
                    <ChevronLeft size={20} />
                    Anterior
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#ff4d00] hover:bg-[#e64500] text-white font-bold transition-all shadow-lg shadow-[#ff4d00]/30"
                >
                  {currentStep === 3 ? 'Analisar com IA' : 'Próximo'}
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default OnboardingView;
