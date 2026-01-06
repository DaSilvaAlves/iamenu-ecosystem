
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_USER, REGIONS } from '../constants';

const Profile: React.FC = () => {
  // Carregar dados guardados ou usar os mocks iniciais
  const savedAvatar = localStorage.getItem('user_avatar');
  const savedHub = localStorage.getItem('user_hub');

  const [avatar, setAvatar] = useState(savedAvatar || MOCK_USER.avatar);
  const [selectedHub, setSelectedHub] = useState(savedHub || MOCK_USER.hub);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setSaveSuccess(false); // Reset success state when a new change is made
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simular gravação e persistir no localStorage
    setTimeout(() => {
      localStorage.setItem('user_avatar', avatar);
      localStorage.setItem('user_hub', selectedHub);
      
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Esconder a mensagem de sucesso após 3 segundos
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center pt-8 pb-4">
        <div className="relative mb-4 group">
          <div className="w-28 h-28 rounded-full border-4 border-white dark:border-surface-dark shadow-xl overflow-hidden relative ring-4 ring-primary/10">
            <img 
              src={avatar} 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
            <div 
              onClick={handleImageClick}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <span className="material-symbols-outlined text-white">photo_camera</span>
            </div>
          </div>
          
          <button 
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-4 border-bg-light dark:border-bg-dark shadow-lg hover:bg-primary-dark transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        
        <h2 className="text-2xl font-bold">{MOCK_USER.name}</h2>
        <p className="text-slate-400 text-sm font-medium">{MOCK_USER.role} @ {MOCK_USER.restaurant}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Definições da Conta</h3>
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400">hub</span>
              <span className="text-sm font-bold">O meu Hub</span>
            </div>
            <select 
              value={selectedHub}
              onChange={(e) => {
                setSelectedHub(e.target.value);
                setSaveSuccess(false);
              }}
              className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer text-right"
            >
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          
          <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5 text-left">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400">notifications</span>
              <span className="text-sm font-bold">Notificações Push</span>
            </div>
            <div className="w-10 h-6 bg-primary rounded-full relative">
              <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </button>
          
          <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400">verified_user</span>
              <span className="text-sm font-bold">Segurança e Privacidade</span>
            </div>
            <span className="material-symbols-outlined text-slate-300">chevron_right</span>
          </button>
        </div>

        {/* Botão Salvar Alterações */}
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
            saveSuccess 
              ? 'bg-green-500 text-white shadow-green-500/20' 
              : 'bg-primary hover:bg-primary-dark text-white shadow-primary/20'
          }`}
        >
          {isSaving ? (
            <>
              <span className="material-symbols-outlined animate-spin">sync</span>
              A guardar...
            </>
          ) : saveSuccess ? (
            <>
              <span className="material-symbols-outlined">check_circle</span>
              Alterações Guardadas!
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">save</span>
              Guardar Alterações
            </>
          )}
        </button>

        <button className="w-full p-4 flex items-center justify-center gap-2 bg-red-500/10 text-red-600 rounded-2xl font-bold transition-all active:scale-95 hover:bg-red-500/20">
          <span className="material-symbols-outlined">logout</span>
          Terminar Sessão
        </button>
      </div>

      <div className="text-center pb-8">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">iaMenu Ecosystem v2.4.0</p>
      </div>
    </div>
  );
};

export default Profile;
