
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ManagerCreateShift: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark text-white font-sans antialiased flex flex-col items-center max-w-md mx-auto relative overflow-hidden">
      <header className="w-full flex items-center justify-between px-6 pt-12 pb-4 glass sticky top-0 z-30">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-zinc-800 transition-colors">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Criar Turno</h1>
        <button className="text-primary font-semibold text-sm">Salvar</button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-6 pb-32 w-full space-y-8 hide-scrollbar">
        {/* Conflict Alert */}
        <div className="p-4 rounded-xl bg-red-900/10 border border-red-900/40 flex items-start gap-3">
          <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">warning</span>
          <div>
            <h3 className="text-sm font-semibold text-red-400">Conflito de Horário</h3>
            <p className="text-xs text-red-300 mt-1 opacity-80">O colaborador João Silva já possui um turno neste horário.</p>
          </div>
        </div>

        {/* Date & Time */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">Data e Hora</h2>
          <div className="bg-surface-dark rounded-2xl p-5 space-y-4 border border-white/5">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1.5 ml-1">Data do Turno</label>
              <div className="flex items-center bg-black/40 rounded-xl px-4 py-3 border border-white/10 focus-within:border-primary transition-all">
                <span className="material-symbols-outlined text-gray-500 mr-3 text-xl">calendar_today</span>
                <input type="date" defaultValue="2023-10-25" className="bg-transparent border-none p-0 text-sm w-full focus:ring-0 text-white" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1.5 ml-1">Início</label>
                <div className="flex items-center bg-black/40 rounded-xl px-4 py-3 border border-white/10 focus-within:border-primary transition-all">
                  <span className="material-symbols-outlined text-gray-500 mr-3 text-xl">schedule</span>
                  <input type="time" defaultValue="18:00" className="bg-transparent border-none p-0 text-sm w-full focus:ring-0 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1.5 ml-1">Fim</label>
                <div className="flex items-center bg-black/40 rounded-xl px-4 py-3 border border-white/10 focus-within:border-primary transition-all">
                  <span className="material-symbols-outlined text-gray-500 mr-3 text-xl">schedule</span>
                  <input type="time" defaultValue="23:30" className="bg-transparent border-none p-0 text-sm w-full focus:ring-0 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Details */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">Detalhes do Serviço</h2>
          <div className="bg-surface-dark rounded-2xl p-5 space-y-5 border border-white/5">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 ml-1">Função</label>
              <div className="relative">
                <select className="appearance-none bg-black/40 w-full rounded-xl px-4 py-3.5 border border-white/10 text-sm focus:ring-1 focus:ring-primary focus:border-primary text-white outline-none">
                  <option>Empregado de Mesa</option>
                  <option>Barman</option>
                  <option>Cozinha</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">expand_more</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 ml-1">Atribuir a</label>
              <div className="flex items-center justify-between bg-black/40 w-full rounded-xl p-3 border border-white/10 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
                  <span className="text-sm font-medium text-white">João Silva</span>
                </div>
                <span className="material-symbols-outlined text-gray-500 text-xl">chevron_right</span>
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                <button className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[14px] mr-1">add</span> Sugerido: Ana M.
                </button>
                <button className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase bg-zinc-800 text-gray-400 border border-white/5 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[14px] mr-1">add</span> Sugerido: Pedro R.
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Toggles */}
        <section className="bg-surface-dark rounded-2xl overflow-hidden border border-white/5">
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Notificar colaborador</span>
              <span className="text-xs text-gray-500">Enviar push notification</span>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative p-0.5 transition-colors">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 shadow-sm"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-5">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">Turno urgente</span>
              <span className="text-xs text-gray-500">Destacar na dashboard</span>
            </div>
            <div className="w-12 h-6 bg-zinc-700 rounded-full relative p-0.5 transition-colors">
              <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 shadow-sm"></div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 w-full bg-background-dark/90 backdrop-blur-xl border-t border-white/5 p-4 pb-12 z-40 max-w-md mx-auto">
        <div className="flex gap-4">
          <button onClick={() => navigate(-1)} className="flex-1 py-3.5 rounded-xl border border-white/10 text-white font-semibold text-sm">Cancelar</button>
          <button className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">check</span>
            Confirmar Turno
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerCreateShift;
