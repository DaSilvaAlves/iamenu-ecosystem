
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const ManagerOnboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark flex flex-col pb-32 max-w-md mx-auto">
      <header className="pt-12 pb-6 px-6 glass border-b border-white/5 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-zinc-800 text-gray-400">
            <span className="material-icons text-2xl">arrow_back</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border-2 border-primary">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white leading-tight">Progresso de Onboarding</h1>
        <p className="text-sm text-gray-500 mt-1">Acompanhe a integração da sua equipa</p>
      </header>

      <main className="flex-1 px-4 py-6 space-y-8 overflow-y-auto hide-scrollbar">
        {/* Overall Summary */}
        <div className="bg-surface-dark rounded-xl p-5 border border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Resumo Geral</h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-tighter">Semana Atual</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-zinc-900 border border-white/5 text-center">
              <span className="block text-3xl font-bold text-white">12</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-1">Novos Staff</span>
            </div>
            <div className="p-4 rounded-lg bg-zinc-900 border border-white/5 text-center relative overflow-hidden">
              <span className="block text-3xl font-bold text-emerald-400">85%</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-1">Conclusão Média</span>
            </div>
          </div>
        </div>

        {/* Staff Progress List */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Colaboradores Recentes</h3>
          {[
            { name: 'Sofia Martins', pos: 'Empregado de Mesa', time: 'há 3 dias', progress: 80, items: '4 de 5' },
            { name: 'Pedro Alves', pos: 'Barman', time: 'há 1 dia', progress: 33, items: '2 de 6', warning: 'Higiene e Segurança' },
            { name: 'Maria Costa', pos: 'Cozinha', time: 'Início hoje', progress: 0, items: '0 de 5' }
          ].map((staff, i) => (
            <div key={i} className="bg-surface-dark rounded-xl p-4 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-800 p-0.5">
                    <img src={`https://i.pravatar.cc/150?u=${staff.name}`} alt="Staff" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white group-hover:text-primary transition-colors">{staff.name}</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{staff.pos} • {staff.time}</p>
                  </div>
                </div>
                <span className="material-icons text-gray-500 text-lg">chevron_right</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{staff.items} módulos</span>
                  <span className={`text-sm font-bold ${staff.progress >= 80 ? 'text-emerald-400' : 'text-primary'}`}>{staff.progress}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${staff.progress >= 80 ? 'bg-emerald-500' : 'bg-primary'}`}
                    style={{ width: `${staff.progress}%` }}
                  ></div>
                </div>
                {staff.warning && (
                  <div className="mt-3 flex items-center space-x-2 text-[10px] font-bold uppercase text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md w-fit">
                    <span className="material-icons text-xs">schedule</span>
                    <span>Pendente: {staff.warning}</span>
                  </div>
                )}
                {staff.progress === 0 && (
                  <button className="mt-3 text-[10px] font-bold uppercase text-primary hover:underline">Enviar Lembrete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default ManagerOnboarding;
