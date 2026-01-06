
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockShifts, staffList } from '../mockData';

const ShiftDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const shift = mockShifts.find(s => s.id === id);
  const [swapType, setSwapType] = useState<'OPEN' | 'SPECIFIC'>('OPEN');

  if (!shift) return null;

  return (
    <div className="min-h-screen bg-background-dark pb-32 max-w-md mx-auto relative flex flex-col selection:bg-primary selection:text-white">
      <header className="fixed top-0 w-full max-w-md z-50 glass px-6 py-4 pt-12 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-base font-semibold tracking-wide text-white">Detalhes do Turno</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </header>

      <main className="flex-1 px-5 pt-32 space-y-6">
        <section className="bg-surface-dark rounded-2xl p-6 border border-white/5 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 border border-primary/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(242,101,34,0.8)] animate-pulse"></span>
                  <span>Próximo Turno</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-1">Sexta-feira</h2>
                <p className="text-gray-400 text-sm font-medium">{new Date(shift.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="bg-zinc-800 border border-white/5 p-3 rounded-xl flex flex-col items-center justify-center min-w-[70px]">
                <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">Duração</span>
                <span className="text-xl font-bold text-white">5.5h</span>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { icon: 'schedule', label: 'Horário', value: `${shift.startTime} - ${shift.endTime}` },
                { icon: 'badge', label: 'Função', value: shift.position },
                { icon: 'restaurant', label: 'Local', value: shift.location }
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-4 p-3 rounded-xl bg-zinc-900/30 border border-transparent hover:border-white/5 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wide">{item.label}</p>
                    <p className="font-semibold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-lg font-bold text-white">Solicitar Troca</h3>
            <span className="material-symbols-outlined text-gray-500 text-xl">swap_horiz</span>
          </div>
          <div className="bg-surface-dark rounded-2xl p-5 border border-white/5 space-y-5">
            <label className="relative flex items-start space-x-4 cursor-pointer group">
              <input
                type="radio"
                name="swapType"
                checked={swapType === 'OPEN'}
                onChange={() => setSwapType('OPEN')}
                className="peer sr-only"
              />
              <div className="w-5 h-5 mt-1 border border-gray-500 rounded-full peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all shrink-0">
                <span className="material-symbols-outlined text-white text-[14px] opacity-0 peer-checked:opacity-100 font-bold">check</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white group-hover:text-primary transition-colors">Troca Aberta</span>
                  <span className="bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide">Recomendado</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Qualquer colega disponível com a mesma função poderá aceitar este turno.</p>
              </div>
            </label>

            <div className="w-full h-px bg-white/5"></div>

            <label className="relative flex items-start space-x-4 cursor-pointer group">
              <input
                type="radio"
                name="swapType"
                checked={swapType === 'SPECIFIC'}
                onChange={() => setSwapType('SPECIFIC')}
                className="peer sr-only"
              />
              <div className="w-5 h-5 mt-1 border border-gray-500 rounded-full peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all shrink-0">
                <span className="material-symbols-outlined text-white text-[14px] opacity-0 peer-checked:opacity-100 font-bold">check</span>
              </div>
              <div className="flex-1">
                <span className="font-semibold text-white group-hover:text-primary transition-colors">Propor a Colega Específico</span>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Envie o pedido diretamente para um colega específico.</p>
                {swapType === 'SPECIFIC' && (
                  <div className="mt-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="relative mb-3">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 material-symbols-outlined text-lg">search</span>
                      <input className="w-full bg-zinc-900 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-white placeholder-gray-600 transition-all" placeholder="Pesquisar colega..." type="text" />
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto pr-1 hide-scrollbar">
                      {staffList.filter(u => u.id !== 'u1').map(user => (
                        <div key={user.id} className="flex items-center p-2 rounded-lg hover:bg-zinc-800 cursor-pointer border border-transparent transition-colors group/item">
                          <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full mr-3 border border-white/5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white group-hover/item:text-primary transition-colors">{user.name}</p>
                            <p className="text-[10px] text-gray-500">{user.position}</p>
                          </div>
                          <span className="material-symbols-outlined text-gray-500 text-sm opacity-0 group-hover/item:opacity-100">chevron_right</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </label>

            <div className="pt-2">
              <label className="block text-xs uppercase font-bold text-gray-500 mb-2 tracking-wide">Motivo (Opcional)</label>
              <textarea
                className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-white placeholder-zinc-700 resize-none transition-all"
                placeholder="Ex: Consulta médica inesperada..."
                rows={3}
              ></textarea>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-40 max-w-md mx-auto">
        <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transform transition-all active:scale-[0.98] flex items-center justify-center space-x-2">
          <span className="material-symbols-outlined">send</span>
          <span>Enviar Pedido de Troca</span>
        </button>
      </div>
    </div>
  );
};

export default ShiftDetails;
