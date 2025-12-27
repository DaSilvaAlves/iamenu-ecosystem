import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  ShoppingCart,
  GraduationCap,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';

const OnboardingView = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 0,
      emoji: '🍽️',
      title: 'Bem-vindo ao iaMenu',
      subtitle: 'O ecossistema completo para o seu restaurante',
      description: 'Junte-se a 100+ restauradores portugueses que estão a transformar os seus negócios com tecnologia, comunidade e conhecimento.',
      features: [
        { icon: '💡', text: 'Resolva 90% dos problemas do seu restaurante' },
        { icon: '🤝', text: 'Rede exclusiva de restauradores' },
        { icon: '💰', text: 'Poupe €200-400/mês em fornecedores' },
        { icon: '📈', text: 'Ferramentas IA para otimizar gestão' }
      ],
      color: '#10b981'
    },
    {
      id: 1,
      emoji: '💬',
      title: 'Community & Chat',
      subtitle: 'Conecte-se com outros restauradores',
      description: 'Partilhe experiências, faça perguntas e receba conselhos de quem já passou pelos mesmos desafios que você.',
      features: [
        { icon: <MessageSquare size={20} />, text: 'Chat em tempo real com a comunidade' },
        { icon: '👥', text: 'Grupos regionais (Algarve, Lisboa, Porto...)' },
        { icon: '🎯', text: 'Grupos temáticos (Turismo, Vegano, Sushi...)' },
        { icon: '🏆', text: 'Eventos e networking presencial' }
      ],
      color: '#3b82f6'
    },
    {
      id: 2,
      emoji: '🛒',
      title: 'Marketplace de Fornecedores',
      subtitle: 'Poupe até €400/mês em compras',
      description: 'Aceda a fornecedores verificados, compare preços e negocie em grupo para conseguir os melhores descontos.',
      features: [
        { icon: <ShoppingCart size={20} />, text: '50+ fornecedores certificados' },
        { icon: '💰', text: 'Negociação coletiva = melhores preços' },
        { icon: '⭐', text: 'Reviews reais de outros restauradores' },
        { icon: '📦', text: 'Entregas rápidas em todo Portugal' }
      ],
      color: '#f59e0b',
      highlight: 'Poupe €200-400/mês'
    },
    {
      id: 3,
      emoji: '🎓',
      title: 'Academia & Ferramentas IA',
      subtitle: 'Aprenda, cresça e otimize',
      description: 'Cursos práticos, ferramentas de IA e consultoria para levar o seu restaurante ao próximo nível.',
      features: [
        { icon: <GraduationCap size={20} />, text: 'Cursos gratuitos de gestão e marketing' },
        { icon: '🤖', text: 'GastroLens AI - Análise de pratos com IA' },
        { icon: '📊', text: 'Dashboard Business Intelligence' },
        { icon: <TrendingUp size={20} />, text: 'Food Cost & Marketing Planner' }
      ],
      color: '#8b5cf6',
      highlight: 'Upskilling gratuito'
    }
  ];

  const currentStepData = steps[currentStep];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('iaMenu_onboarding_completed', 'true');
    if (onComplete) onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('iaMenu_onboarding_completed', 'true');
    if (onSkip) onSkip();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-auto px-6">
        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={24} />
        </button>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mb-12">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-12 bg-[#10b981]'
                  : index < currentStep
                  ? 'w-8 bg-[#10b981]/50'
                  : 'w-8 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {/* Emoji Icon */}
            <div className="text-8xl mb-6 animate-bounce-slow">
              {currentStepData.emoji}
            </div>

            {/* Title */}
            <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
              {currentStepData.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-white/60 mb-6 font-medium">
              {currentStepData.subtitle}
            </p>

            {/* Highlight Badge (if exists) */}
            {currentStepData.highlight && (
              <div className="inline-block px-4 py-2 mb-6 rounded-full bg-[#10b981]/20 border border-[#10b981]/40">
                <span className="text-[#10b981] font-bold text-sm">
                  ⚡ {currentStepData.highlight}
                </span>
              </div>
            )}

            {/* Description */}
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
              {currentStepData.description}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
              {currentStepData.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="text-2xl flex-shrink-0">
                    {typeof feature.icon === 'string' ? feature.icon : feature.icon}
                  </div>
                  <span className="text-white/90 text-left font-medium">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Navigation Buttons */}
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
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#10b981] hover:bg-[#059669] text-white font-bold transition-all shadow-lg shadow-[#10b981]/30"
              >
                {currentStep === steps.length - 1 ? 'Começar' : 'Próximo'}
                {currentStep < steps.length - 1 && <ChevronRight size={20} />}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default OnboardingView;
