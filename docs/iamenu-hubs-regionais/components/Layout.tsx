
import React from 'react';
import { NavLink } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto shadow-2xl bg-bg-light dark:bg-bg-dark relative overflow-x-hidden">
      {/* Top Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-lg border-b border-slate-200 dark:border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">hub</span>
          <h1 className="font-bold text-lg tracking-tight">iaMenu Hubs</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-surface-dark"></span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pb-24">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto z-50 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md border-t border-slate-200 dark:border-white/5 py-2 px-8 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold">Início</span>
        </NavLink>
        <NavLink to="/resources" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined">description</span>
          <span className="text-[10px] font-bold">Recursos</span>
        </NavLink>
        <NavLink to="/feedback" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined">campaign</span>
          <span className="text-[10px] font-bold">Feedback</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}>
          <span className="material-symbols-outlined">account_circle</span>
          <span className="text-[10px] font-bold">Perfil</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout;
