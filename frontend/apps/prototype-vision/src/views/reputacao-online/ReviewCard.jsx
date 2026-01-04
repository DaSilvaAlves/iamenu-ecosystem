import React from 'react';
import { Platform, ResponseStatus } from './types';

const ReviewCard = ({ review, onSelect }) => {
  const getPlatformColor = (platform) => {
    switch (platform) {
      case Platform.GOOGLE: return 'text-blue-400';
      case Platform.TRIPADVISOR: return 'text-green-500';
      case Platform.PRIVATE: return 'text-gray-400';
      default: return 'text-white';
    }
  };

  const isUnanswered = review.status === ResponseStatus.UNANSWERED;
  const isNegative = review.rating <= 3;

  return (
    <div className="relative flex flex-col gap-3 rounded-xl bg-[#1A1A1A] p-4 shadow-lg border border-white/5 overflow-hidden group active:scale-[0.98] transition-all">
      {isNegative && isUnanswered && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>}

      <div className="absolute top-4 right-4 flex items-center gap-2">
        {review.status === ResponseStatus.UNANSWERED ? (
          <span className="inline-flex items-center rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-500 uppercase tracking-wider border border-red-500/20">
            Sem resposta
          </span>
        ) : (
          <div className="flex items-center gap-1 text-[#F2542D] text-[10px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined fill" style={{ fontSize: '14px' }}>check_circle</span>
            Respondida
          </div>
        )}
      </div>

      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className={`w-10 h-10 rounded ${review.platform === Platform.PRIVATE ? 'bg-gray-800' : 'bg-[#262626]'} flex items-center justify-center text-gray-300 font-bold border border-white/5`}>
            {review.avatar || review.author.substring(0, 2)}
          </div>
          <div>
            <h3 className="text-white text-sm font-bold leading-tight">{review.author}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${getPlatformColor(review.platform)}`}>
                {review.platform}
              </span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span className="text-gray-500 text-[10px]">{review.date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex text-yellow-500 gap-0.5 mt-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`material-symbols-outlined ${i < review.rating ? 'fill' : 'text-gray-700'}`} style={{ fontSize: '16px' }}>
            star
          </span>
        ))}
      </div>

      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
        {review.content}
      </p>

      {review.status === ResponseStatus.REPLIED && review.response && (
        <div className="bg-[#262626] p-3 rounded border border-white/5 mt-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 rounded-full bg-[#F2542D]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#F2542D]" style={{ fontSize: '10px' }}>reply</span>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">A Tua Resposta</p>
          </div>
          <p className="text-gray-500 text-xs italic line-clamp-1 pl-6 border-l-2 border-[#F2542D]/20">
            "{review.response}"
          </p>
        </div>
      )}

      <div className="mt-2 flex gap-2">
        {review.platform === Platform.PRIVATE ? (
          <button className="flex-1 flex items-center justify-center gap-2 h-9 bg-white text-black hover:bg-gray-200 rounded font-bold text-xs transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>confirmation_number</span>
            Enviar Voucher
          </button>
        ) : (
          <button
            onClick={() => onSelect(review)}
            className="flex-1 flex items-center justify-center gap-2 h-9 bg-[#F2542D] hover:bg-[#D9421C] text-white rounded font-bold text-xs transition-colors shadow-lg shadow-[#F2542D]/20"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>reply</span>
            {review.status === ResponseStatus.REPLIED ? 'Editar Resposta' : 'Responder Agora'}
          </button>
        )}
        <button className="flex items-center justify-center w-9 h-9 rounded bg-[#262626] text-gray-400 hover:text-white transition-colors border border-white/5">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_horiz</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
