
import React, { useState, useEffect } from 'react';
import { Review, Tone } from '../types';
import { generateAIResponse } from '../services/geminiService';

interface ReviewDetailProps {
  review: Review;
  onBack: () => void;
  onPost: (id: string, response: string) => void;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({ review, onBack, onPost }) => {
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [response, setResponse] = useState(review.response || '');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (selectedTone: Tone) => {
    setTone(selectedTone);
    setLoading(true);
    const text = await generateAIResponse(review.content, review.rating, selectedTone);
    setResponse(text);
    setLoading(false);
  };

  useEffect(() => {
    if (!review.response && !response && !loading) {
      handleGenerate(Tone.PROFESSIONAL);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="sticky top-0 z-50 flex items-center bg-[#0A0A0A]/80 backdrop-blur-md p-4 pb-3 justify-between border-b border-[#262626]">
        <button onClick={onBack} className="text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-white text-lg font-bold flex-1 text-center pr-10">Detalhes da Avaliação</h2>
      </header>

      <main className="flex-1 p-4 pb-32">
        <div className="bg-[#161616] rounded-xl p-5 shadow-lg border border-[#262626] mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-3">
              <div className="bg-[#262626] rounded-full h-12 w-12 flex items-center justify-center font-bold text-gray-300">
                {review.avatar || review.author.substring(0, 2)}
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-white text-lg font-bold">{review.author}</h3>
                <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                  <span className="material-symbols-outlined text-[#E00707] text-base fill">reviews</span>
                  <span>{review.platform}</span>
                  <span>•</span>
                  <span>{review.date}</span>
                </div>
              </div>
            </div>
            <div className={`flex h-7 px-3 rounded-full border items-center gap-1.5 ${review.rating >= 4 ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
              <span className="material-symbols-outlined text-[14px] fill">{review.rating >= 4 ? 'sentiment_satisfied' : 'sentiment_dissatisfied'}</span>
              <p className="text-[10px] font-bold uppercase tracking-wider">{review.rating >= 4 ? 'Positiva' : 'Requer Ação'}</p>
            </div>
          </div>
          
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`material-symbols-outlined text-[20px] ${i < review.rating ? 'text-[#F25410] fill' : 'text-[#333]'}`}>star</span>
            ))}
          </div>
          <p className="text-gray-300 text-[15px] leading-relaxed italic">
            "{review.content}"
          </p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-bold">A Tua Resposta</h3>
          <div className="flex items-center gap-1 text-[#F25410]/80">
            <span className="material-symbols-outlined text-[14px] fill">auto_awesome</span>
            <span className="text-[10px] uppercase font-bold tracking-wider">Rascunho IA</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {[Tone.PROFESSIONAL, Tone.FRIENDLY, Tone.APOLOGETIC].map((t) => (
            <button 
              key={t}
              onClick={() => handleGenerate(t)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all shrink-0 ${
                tone === t 
                ? 'bg-[#F25410] text-white shadow-lg shadow-[#F25410]/20' 
                : 'bg-[#161616] border border-[#333] text-gray-400'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {t === Tone.PROFESSIONAL ? 'verified' : t === Tone.FRIENDLY ? 'sentiment_satisfied' : 'handshake'}
              </span>
              {t}
            </button>
          ))}
        </div>

        <div className="relative mt-2">
          {loading && (
            <div className="absolute inset-0 z-10 bg-[#161616]/80 flex flex-col items-center justify-center gap-3 rounded-xl backdrop-blur-sm">
              <span className="material-symbols-outlined text-[#F25410] animate-spin text-4xl">progress_activity</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase">A IA está a escrever...</p>
            </div>
          )}
          <textarea 
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="w-full h-56 p-5 rounded-xl bg-[#161616] border border-[#333] text-[15px] text-gray-200 leading-relaxed resize-none focus:ring-1 focus:ring-[#F25410] focus:border-[#F25410] shadow-sm outline-none"
            placeholder="Escreve aqui a tua resposta..."
          />
          <div className="absolute bottom-3 right-3">
             <button className="p-2 rounded-lg text-gray-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[20px]">content_copy</span>
            </button>
          </div>
        </div>
        
        <p className="mt-3 text-xs text-gray-500 text-center flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">info</span>
          Conteúdo gerado por IA pode requerer edição. Reveja antes de publicar.
        </p>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-[#262626] z-50 max-w-md mx-auto">
        <div className="flex gap-3">
          <button 
            onClick={() => handleGenerate(tone)}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-lg bg-[#161616] border border-[#333] text-white font-bold hover:bg-[#262626] transition-colors group"
          >
            <span className="material-symbols-outlined text-[#F25410] group-hover:rotate-180 transition-transform duration-500">autorenew</span>
            Regerar
          </button>
          <button 
            onClick={() => onPost(review.id, response)}
            className="flex-[2] flex items-center justify-center gap-2 h-12 rounded-lg bg-[#F25410] text-white font-bold shadow-lg shadow-orange-500/10 hover:bg-[#D14008] transition-colors"
          >
            <span className="material-symbols-outlined">send</span>
            Publicar Resposta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
