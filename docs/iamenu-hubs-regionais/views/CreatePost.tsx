
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostCategory } from '../types';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(PostCategory.GERAL);

  return (
    <div className="p-4 flex flex-col min-h-[calc(100vh-140px)]">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full">
          <span className="material-symbols-outlined">close</span>
        </button>
        <h2 className="font-bold text-lg">Novo Post</h2>
        <button className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95">
          Publicar
        </button>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoria</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(PostCategory).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  category === cat ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <input 
          type="text" 
          placeholder="Título do seu post..." 
          className="w-full bg-transparent border-none text-2xl font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-0 p-0"
        />

        <textarea 
          placeholder="O que está a acontecer na sua cozinha? Partilhe uma dica, faça uma pergunta ou mostre os seus resultados..." 
          className="w-full bg-transparent border-none text-base placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-0 p-0 min-h-[200px] resize-none"
        ></textarea>
      </div>

      <div className="flex items-center gap-4 py-4 border-t border-slate-100 dark:border-white/5">
        <button className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">image</span>
        </button>
        <button className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">link</span>
        </button>
        <button className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">poll</span>
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
