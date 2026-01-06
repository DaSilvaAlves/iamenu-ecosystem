
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RequestTimeOff: React.FC = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<'vacation' | 'dayoff'>('vacation');

  return (
    <div className="min-h-screen bg-background-dark text-gray-100 font-sans antialiased flex flex-col max-w-md mx-auto">
      <header className="flex items-center justify-between px-6 pt-12 pb-6 sticky top-0 z-50 glass">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-zinc-800 transition-colors text-gray-400">
          <span className="material-icons-round text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-semibold tracking-tight text-white">Solicitar Ausência</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-zinc-800 transition-colors text-gray-400">
          <span className="material-icons-round text-2xl">history</span>
        </button>
      </header>

      <main className="flex-1 px-5 py-6 space-y-8">
        <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-2xl group border border-white/5">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
            alt="Restaurant background"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
          <div className="absolute bottom-5 left-6">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> iaMenu Staff
            </p>
            <h2 className="text-2xl font-bold text-white leading-tight">Planeie o seu<br />descanso</h2>
          </div>
        </div>

        <form className="space-y-6">
          <div className="bg-surface-dark rounded-xl p-5 shadow-lg border border-white/5">
            <label className="block text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">Tipo de Ausência</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  checked={type === 'vacation'}
                  onChange={() => setType('vacation')}
                  className="peer sr-only"
                />
                <div className={`flex flex-col items-center justify-center py-4 px-2 rounded-lg border border-white/5 transition-all duration-200 ${type === 'vacation' ? 'bg-primary/10 border-primary text-primary' : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'}`}>
                  <span className={`material-icons-round mb-2 text-2xl ${type === 'vacation' ? 'text-primary' : 'text-gray-500'}`}>beach_access</span>
                  <span className="text-sm font-medium">Férias</span>
                </div>
              </label>
              <label className="relative cursor-pointer group">
                <input
                  type="radio"
                  name="type"
                  checked={type === 'dayoff'}
                  onChange={() => setType('dayoff')}
                  className="peer sr-only"
                />
                <div className={`flex flex-col items-center justify-center py-4 px-2 rounded-lg border border-white/5 transition-all duration-200 ${type === 'dayoff' ? 'bg-primary/10 border-primary text-primary' : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'}`}>
                  <span className={`material-icons-round mb-2 text-2xl ${type === 'dayoff' ? 'text-primary' : 'text-gray-500'}`}>event_busy</span>
                  <span className="text-sm font-medium">Folga Pontual</span>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-surface-dark rounded-xl p-5 shadow-lg border border-white/5">
            <label className="block text-xs font-bold text-gray-500 mb-5 uppercase tracking-wider">Período</label>
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                    <span className="material-icons-round text-xl">flight_takeoff</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Início</p>
                    <p className="text-sm font-semibold text-white">Selecione a data</p>
                  </div>
                </div>
                <input type="date" className="bg-transparent border-none text-right text-gray-300 focus:text-primary focus:ring-0 p-0 text-sm font-semibold cursor-pointer w-32 tracking-tight" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                    <span className="material-icons-round text-xl">flight_land</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Fim</p>
                    <p className="text-sm font-semibold text-white">Selecione a data</p>
                  </div>
                </div>
                <input type="date" className="bg-transparent border-none text-right text-gray-300 focus:text-primary focus:ring-0 p-0 text-sm font-semibold cursor-pointer w-32 tracking-tight" />
              </div>
            </div>
          </div>

          <div className="bg-surface-dark rounded-xl p-5 shadow-lg border border-white/5">
            <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Observações</label>
            <textarea
              className="w-full bg-zinc-900 border border-white/5 rounded-lg text-sm text-gray-100 placeholder-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary resize-none p-4 leading-relaxed transition-all"
              placeholder="Ex: Preciso de tirar uns dias para tratar de assuntos pessoais..."
              rows={3}
            ></textarea>
          </div>

          <div className="pt-6">
            <button
              type="button"
              className="w-full bg-gradient-to-r from-primary to-primary-hover hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transform transition-all active:scale-[0.98] text-base flex items-center justify-center gap-2"
            >
              <span>Enviar Pedido</span>
              <span className="material-icons-round text-xl">arrow_forward</span>
            </button>
            <p className="text-center text-xs text-gray-600 mt-4 flex items-center justify-center gap-1">
              <span className="material-icons-round text-sm">info</span>
              O pedido requer aprovação do gerente.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RequestTimeOff;
