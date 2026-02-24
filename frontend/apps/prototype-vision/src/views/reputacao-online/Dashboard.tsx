import { useState } from 'react';
import { MOCK_REVIEWS } from './constants';
import { Platform } from './types';
import ReviewCard from './ReviewCard';

interface DashboardProps {
  onTabChange: (tab: string) => void;
}

const Dashboard = ({ onTabChange }: DashboardProps) => {
  const [filter, setFilter] = useState('Todas');

  const filteredReviews = MOCK_REVIEWS.filter(review => {
    if (filter === 'Todas') return true;
    if (filter === 'Sem resposta') return review.status === 'Sem resposta';
    if (filter === 'Negativas') return review.rating <= 3;
    return review.platform === filter;
  });

  return (
    <div className="flex flex-col animate-in fade-in duration-500 max-w-full">
      {/* Header Estilo iaMenu Ecosystem */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 pb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tighter text-white italic uppercase">
            Reputação Online
          </h1>
          <p className="text-[#a1a1aa] text-[10px] font-bold tracking-wider uppercase opacity-80">
            Análise detalhada de reviews e feedback dos seus clientes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-lg px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-white/5 transition-colors">
            <span className="text-xs font-bold text-gray-300 uppercase">Esta Semana</span>
            <span className="material-symbols-outlined text-gray-500 text-lg">keyboard_arrow_down</span>
          </div>
          <button className="bg-[#1A1A1A] border border-white/5 p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-gray-300 text-xl">refresh</span>
          </button>
          <button className="bg-[#F2542D] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-[#F2542D]/20 hover:bg-[#D9421C] transition-all">
            <span className="material-symbols-outlined text-sm">download</span>
            Exportar Relatório
          </button>
        </div>
      </header>

      {/* Sub-Navegação estilo iaMenu (Substituindo Visão Geral, etc) */}
      <div className="flex gap-2 px-6 pb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] font-black transition-all border bg-[#F2542D] border-[#F2542D] text-white uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-[18px]">grid_view</span>
          Início
        </button>
        <button
          onClick={() => onTabChange('inbox')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] font-black transition-all border bg-[#1A1A1A] border-white/5 text-[#a1a1aa] hover:text-white hover:bg-[#262626] uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-[18px]">inbox</span>
          Entrada
        </button>
        <button
          onClick={() => onTabChange('request')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] font-black transition-all border bg-[#1A1A1A] border-white/5 text-[#a1a1aa] hover:text-white hover:bg-[#262626] uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-[18px]">send_and_archive</span>
          Pedir
        </button>
        <button
          onClick={() => onTabChange('settings')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[11px] font-black transition-all border bg-[#1A1A1A] border-white/5 text-[#a1a1aa] hover:text-white hover:bg-[#262626] uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
          Definições
        </button>
      </div>

      {/* Conteúdo do Projeto Original (Inbox) */}
      <div className="px-6 space-y-4">
        {/* Barra de Pesquisa */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-500 group-focus-within:text-[#F2542D] transition-colors" style={{ fontSize: '20px' }}>search</span>
          </div>
          <input
            type="text"
            placeholder="Pesquisar..."
            className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-[#1A1A1A] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#F2542D] shadow-sm ring-1 ring-white/5"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['Todas', 'Sem resposta', 'Negativas', Platform.GOOGLE, Platform.TRIPADVISOR].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-xs font-bold transition-all ${
                filter === item
                ? 'bg-[#F2542D] text-white shadow-lg shadow-[#F2542D]/20'
                : 'bg-[#1A1A1A] text-gray-400 border border-white/5 hover:bg-white/5'
              }`}
            >
              {item === 'Negativas' && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
              {item}
            </button>
          ))}
        </div>

        {/* Lista de Reviews */}
        <div className="flex flex-col gap-4 pb-12">
          {filteredReviews.length > 0 ? (
            filteredReviews.map(review => (
              <ReviewCard key={review.id} review={review} onSelect={() => onTabChange('inbox')} />
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-gray-600 gap-4">
              <span className="material-symbols-outlined text-6xl opacity-20">inbox_customize</span>
              <p className="font-bold uppercase text-[10px] tracking-widest">Sem resultados</p>
            </div>
          )}

          <div className="flex justify-center py-6">
            <span className="material-symbols-outlined text-gray-800 animate-spin">progress_activity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
