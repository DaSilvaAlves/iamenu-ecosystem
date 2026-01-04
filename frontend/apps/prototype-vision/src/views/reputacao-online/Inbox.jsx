import React, { useState } from 'react';
import { MOCK_REVIEWS } from './constants';
import { Platform } from './types';
import ReviewCard from './ReviewCard';

const Inbox = ({ onSelectReview }) => {
  const [filter, setFilter] = useState('Todas');

  const filteredReviews = MOCK_REVIEWS.filter(review => {
    if (filter === 'Todas') return true;
    if (filter === 'Sem resposta') return review.status === 'Sem resposta';
    if (filter === 'Negativas') return review.rating <= 3;
    return review.platform === filter;
  });

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="sticky top-0 z-30 bg-[#0F0F0F]/95 backdrop-blur-md pt-safe-top border-b border-white/5">
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#F2542D] rounded flex items-center justify-center text-white font-bold text-lg">ia</div>
            <h2 className="text-xl font-bold flex items-center">
              Entrada
              <span className="bg-[#F2542D]/20 text-[#F2542D] text-[10px] font-extrabold ml-2 px-1.5 py-0.5 rounded">12</span>
            </h2>
          </div>
          <div className="flex items-center justify-end gap-3 text-gray-400">
            <button className="relative p-2 hover:text-white transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#F2542D] rounded-full"></span>
            </button>
            <div className="w-9 h-9 rounded-lg bg-[#262626] overflow-hidden border border-white/10">
              <img src="https://picsum.photos/id/64/100/100" className="w-full h-full object-cover" alt="Utilizador" />
            </div>
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl">search</span>
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full bg-[#262626] rounded-lg border-none text-sm py-2.5 pl-10 pr-4 focus:ring-1 focus:ring-[#F2542D] transition-all"
            />
          </div>
        </div>

        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {['Todas', 'Sem resposta', 'Negativas', Platform.GOOGLE, Platform.TRIPADVISOR].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 text-xs font-bold transition-all ${
                filter === item
                ? 'bg-[#F2542D] text-white shadow-lg shadow-[#F2542D]/20'
                : 'bg-[#262626] text-gray-400 hover:bg-white/10 ring-1 ring-white/5'
              }`}
            >
              {item === 'Negativas' && <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>}
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map(review => (
            <ReviewCard key={review.id} review={review} onSelect={onSelectReview} />
          ))
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-gray-600 gap-4">
            <span className="material-symbols-outlined text-6xl">inbox_customize</span>
            <p className="font-bold">Nenhuma avaliação encontrada</p>
          </div>
        )}

        <div className="flex justify-center py-6">
          <span className="material-symbols-outlined text-gray-800 animate-spin">progress_activity</span>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
