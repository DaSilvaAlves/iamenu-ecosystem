
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'inbox' | 'request' | 'settings';
  setActiveTab: (tab: 'home' | 'inbox' | 'request' | 'settings') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="relative flex flex-col min-h-screen pb-24 mx-auto w-full bg-[#0F0F0F] text-white overflow-x-hidden">
      {/* Top Nav Global iaMenu */}
      <nav className="hidden md:flex items-center gap-6 px-8 py-4 bg-[#0A0A0A] border-b border-white/5 text-[11px] font-bold uppercase tracking-widest text-gray-500">
        <span className="text-white cursor-pointer hover:text-white transition-colors">Home</span>
        <span className="cursor-pointer hover:text-white transition-colors">Cursos</span>
        <span className="cursor-pointer hover:text-white transition-colors">Hubs</span>
        <span className="cursor-pointer hover:text-white transition-colors">Leaderboard</span>
        <div className="ml-auto flex items-center gap-4">
          <div className="bg-[#1A1A1A] rounded px-3 py-1.5 border border-white/5 flex items-center gap-2">
             <span className="material-symbols-outlined text-sm">search</span>
             <input type="text" placeholder="Pesquisar..." className="bg-transparent border-none outline-none text-[10px] w-32 uppercase font-bold" />
          </div>
          <span className="material-symbols-outlined text-lg">notifications</span>
          <span className="material-symbols-outlined text-lg">chat_bubble</span>
          <span className="material-symbols-outlined text-lg">bookmark</span>
          <div className="size-8 rounded-lg bg-[#222] border border-white/10"></div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto">
        {children}
      </main>
      
      {/* Bottom Nav estilo Imagem 1 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6">
        <nav className="bg-[#0A0A0A]/90 backdrop-blur-2xl flex justify-around items-center h-20 w-[95%] max-w-md rounded-2xl border border-white/10 shadow-2xl px-2">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1.5 w-16 transition-all ${activeTab === 'home' ? 'text-[#F2542D]' : 'text-gray-600 hover:text-gray-400'}`}
          >
            <span className={`material-symbols-outlined ${activeTab === 'home' ? 'fill' : ''}`} style={{ fontSize: '26px' }}>grid_view</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">Início</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('inbox')}
            className={`flex flex-col items-center gap-1.5 w-16 relative transition-all ${activeTab === 'inbox' ? 'text-[#F2542D]' : 'text-gray-600 hover:text-gray-400'}`}
          >
            <span className={`material-symbols-outlined ${activeTab === 'inbox' ? 'fill' : ''}`} style={{ fontSize: '26px' }}>inbox</span>
            <span className="absolute top-0 right-4 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]"></span>
            <span className="text-[10px] font-black uppercase tracking-tighter">Entrada</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('request')}
            className={`flex flex-col items-center gap-1.5 w-16 transition-all ${activeTab === 'request' ? 'text-[#F2542D]' : 'text-gray-600 hover:text-gray-400'}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>send_and_archive</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">Pedir</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1.5 w-16 transition-all ${activeTab === 'settings' ? 'text-[#F2542D]' : 'text-gray-600 hover:text-gray-400'}`}
          >
            <span className={`material-symbols-outlined ${activeTab === 'settings' ? 'fill' : ''}`} style={{ fontSize: '26px' }}>settings</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">Definições</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
