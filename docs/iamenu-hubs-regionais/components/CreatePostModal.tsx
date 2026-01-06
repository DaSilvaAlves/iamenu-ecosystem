
import React, { useState, useRef } from 'react';
import { PostCategory } from '../types';
import { MOCK_USER } from '../constants';

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (post: any) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onSubmit }) => {
  const [category, setCategory] = useState(PostCategory.GERAL);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [link, setLink] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>([]);
  const [showPollInput, setShowPollInput] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleFormSubmit = () => {
    if (!title || !content) return;
    
    const newPost = {
      id: `p${Date.now()}`,
      author: { 
        name: MOCK_USER.name, 
        avatar: MOCK_USER.avatar, 
        restaurant: MOCK_USER.restaurant 
      },
      category,
      title,
      content,
      timestamp: 'Agora mesmo',
      likes: 0,
      commentsCount: 0,
      imageUrl: imagePreview || undefined,
      link: link || undefined,
      poll: pollOptions.length > 0 ? pollOptions : undefined
    };

    onSubmit(newPost);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-surface-dark w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
          <h2 className="font-bold text-lg">Novo Post</h2>
          <button 
            onClick={handleFormSubmit}
            disabled={!title || !content}
            className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            Publicar
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {Object.values(PostCategory).map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    category === cat ? 'bg-primary text-white shadow-md' : 'bg-slate-100 dark:bg-white/5 text-slate-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do seu post..." 
            className="w-full bg-transparent border-none text-xl font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-0 p-0"
          />

          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="O que está a acontecer na sua cozinha? Partilhe uma dica ou faça uma pergunta..." 
            className="w-full bg-transparent border-none text-base placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-0 p-0 min-h-[120px] resize-none"
          ></textarea>

          {/* Attachments Display */}
          {imagePreview && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 group">
              <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
              <button 
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {showLinkInput && (
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-200 dark:border-white/10">
              <span className="material-symbols-outlined text-primary text-sm">link</span>
              <input 
                type="url" 
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Inserir link (https://...)" 
                className="flex-1 bg-transparent border-none text-xs focus:ring-0 p-0"
              />
              <button onClick={() => {setShowLinkInput(false); setLink('');}} className="text-slate-400">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

          {showPollInput && (
            <div className="space-y-3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sondagem</span>
                <button onClick={() => {setShowPollInput(false); setPollOptions([]);}} className="text-slate-400">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              {pollOptions.map((opt, idx) => (
                <input
                  key={idx}
                  value={opt}
                  onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                  placeholder={`Opção ${idx + 1}`}
                  className="w-full bg-white dark:bg-bg-dark border border-slate-100 dark:border-white/5 rounded-xl px-4 py-2 text-xs focus:ring-primary focus:border-primary"
                />
              ))}
              {pollOptions.length < 4 && (
                <button 
                  onClick={addPollOption}
                  className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-bold text-slate-400 hover:text-primary hover:border-primary transition-all"
                >
                  + Adicionar Opção
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 rounded-2xl transition-colors ${imagePreview ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary'}`}
          >
            <span className="material-symbols-outlined">image</span>
          </button>
          
          <button 
            onClick={() => setShowLinkInput(!showLinkInput)}
            className={`p-3 rounded-2xl transition-colors ${showLinkInput ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary'}`}
          >
            <span className="material-symbols-outlined">link</span>
          </button>
          
          <button 
            onClick={() => {
              if(!showPollInput) {
                setShowPollInput(true);
                setPollOptions(['', '']);
              } else {
                setShowPollInput(false);
                setPollOptions([]);
              }
            }}
            className={`p-3 rounded-2xl transition-colors ${showPollInput ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary'}`}
          >
            <span className="material-symbols-outlined">poll</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
