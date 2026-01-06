
import React, { useState } from 'react';
import { PainCategory, Impact } from '../types';
import { geminiService } from '../services/geminiService';

const Feedback: React.FC = () => {
  const [description, setDescription] = useState('');
  const [isExpanding, setIsExpanding] = useState(false);
  const [category, setCategory] = useState(PainCategory.MARGEM);
  const [impact, setImpact] = useState(Impact.MEDIUM);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleExpand = async () => {
    if (!description.trim()) return;
    setIsExpanding(true);
    const expanded = await geminiService.helpFramePain(description);
    setDescription(expanded);
    setIsExpanding(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setDescription('');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-surface-darker rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Dores da Região</h2>
          <p className="text-gray-400 text-sm mb-4">A sua opinião alimenta diretamente o Roadmap do iaMenu.</p>
          <div className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full w-fit">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            AI Assistant disponível
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4 shadow-sm">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Categoria do Problema</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(PainCategory).map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                    category === cat ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-50 dark:bg-white/5 border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Impacto no Negócio</label>
            <div className="flex gap-2">
              {Object.values(Impact).map(imp => (
                <button
                  type="button"
                  key={imp}
                  onClick={() => setImpact(imp)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                    impact === imp 
                      ? (imp === Impact.HIGH ? 'bg-red-500/10 border-red-500 text-red-600' : 
                         imp === Impact.MEDIUM ? 'bg-yellow-500/10 border-yellow-500 text-yellow-600' : 
                         'bg-green-500/10 border-green-500 text-green-600')
                      : 'bg-slate-50 dark:bg-white/5 border-transparent'
                  }`}
                >
                  {imp}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Descrição Detalhada</label>
              <button 
                type="button" 
                onClick={handleExpand}
                disabled={isExpanding || !description}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline disabled:opacity-50"
              >
                {isExpanding ? 'Melhorando...' : (
                  <>
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    Melhorar com AI
                  </>
                )}
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-bg-dark border-transparent rounded-xl p-4 text-sm min-h-[120px] focus:ring-primary focus:border-primary placeholder:text-slate-400"
              placeholder="Descreva aqui a dor que está a sentir no seu negócio..."
            ></textarea>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {isSubmitted ? 'Enviado com Sucesso!' : (
            <>
              <span className="material-symbols-outlined">send</span>
              Enviar para a Equipa
            </>
          )}
        </button>
      </form>

      {/* Stats Preview */}
      <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl">
        <h4 className="text-sm font-bold text-primary mb-3">Impacto na Comunidade</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/50 dark:bg-surface-dark/50 rounded-xl">
             <div className="text-xl font-black text-primary">85%</div>
             <div className="text-[10px] font-medium text-slate-500 uppercase">Dores Similares</div>
          </div>
          <div className="text-center p-3 bg-white/50 dark:bg-surface-dark/50 rounded-xl">
             <div className="text-xl font-black text-primary">12h</div>
             <div className="text-[10px] font-medium text-slate-500 uppercase">Tempo Médio Resposta</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
