
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ManagerCreateAnnouncement: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark text-white font-sans antialiased flex flex-col max-w-md mx-auto relative overflow-hidden">
      <header className="flex items-center justify-between px-4 pt-14 pb-4 bg-background-dark sticky top-0 z-30">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 hover:text-white transition-colors rounded-full hover:bg-zinc-800">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-semibold text-center flex-grow text-white">Novo Anúncio</h1>
        <button className="p-2 -mr-2 text-primary font-medium text-sm">Rascunho</button>
      </header>

      <main className="flex-grow px-4 py-2 overflow-y-auto pb-32 space-y-8 hide-scrollbar">
        <form className="space-y-8">
          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Destinatários</label>
            <div className="relative group">
              <select className="w-full bg-zinc-900 border border-white/5 text-white rounded-xl py-4 px-4 pr-10 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none transition-all">
                <option value="all">Toda a Equipa</option>
                <option value="kitchen">Cozinha</option>
                <option value="waiters">Sala & Bar</option>
                <option value="management">Gerência</option>
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">expand_more</span>
            </div>
            <p className="text-[10px] text-gray-500 px-1 flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[14px]">info</span>
              Quem receberá a notificação deste anúncio.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1" htmlFor="title">Título</label>
              <input className="w-full bg-zinc-900 border border-white/5 text-white rounded-xl py-4 px-4 text-base placeholder-zinc-700 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm" placeholder="Ex: Novo menu de verão disponível" type="text" />
            </div>
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1" htmlFor="message">Mensagem</label>
              <textarea className="w-full bg-zinc-900 border border-white/5 text-white rounded-xl py-4 px-4 text-base placeholder-zinc-700 focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none transition-all shadow-sm min-h-[160px]" placeholder="Escreva os detalhes do anúncio aqui..." rows={6}></textarea>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Anexos</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/5 border-dashed rounded-xl cursor-pointer bg-zinc-900 hover:bg-zinc-800 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <span className="material-symbols-outlined text-zinc-500 mb-2 text-3xl">cloud_upload</span>
                  <p className="mb-1 text-sm text-gray-400"><span className="font-medium text-primary">Toque para carregar</span> ou arraste</p>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">PDF, PNG ou JPG (Max. 5MB)</p>
                </div>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-white/5 shadow-sm">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">Marcar como Urgente</span>
                <span className="material-symbols-outlined text-amber-500 text-[18px]">priority_high</span>
              </div>
              <span className="text-xs text-gray-500">Envia notificação push com prioridade</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-800 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </form>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-background-dark/80 backdrop-blur-xl border-t border-white/5 z-20 pb-12 max-w-md mx-auto">
        <button className="w-full bg-gradient-to-r from-primary to-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]">
          <span className="material-symbols-outlined">send</span>
          <span>Publicar Anúncio</span>
        </button>
      </div>
    </div>
  );
};

export default ManagerCreateAnnouncement;
