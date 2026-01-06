
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { onboardingTasks } from '../mockData';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const completedCount = onboardingTasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / onboardingTasks.length) * 100);

  return (
    <div className="min-h-screen bg-background-dark flex flex-col pb-32">
      <header className="px-6 pb-4 pt-12 flex items-center justify-between glass sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <span className="material-icons-round text-2xl text-white">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">Onboarding</h1>
        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden relative">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto hide-scrollbar px-6 pt-6 space-y-8">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl group border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"
            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-700"
            alt="Welcome"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1 block">Bem-vindo à equipa</span>
            <h2 className="text-2xl font-bold text-white mb-1">Vamos começar</h2>
            <p className="text-gray-300 text-sm">Complete as tarefas abaixo para desbloquear o seu perfil completo no iaMenu.</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <div>
              <h3 className="text-lg font-bold text-white">O teu progresso</h3>
              <p className="text-sm text-gray-500">{completedCount} de {onboardingTasks.length} tarefas concluídas</p>
            </div>
            <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(242,93,35,0.5)]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-6">
          {['ESSENCIAL', 'FORMAÇÃO'].map((cat) => (
            <div key={cat}>
              <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-3 ml-1">{cat === 'ESSENCIAL' ? 'Essenciais' : 'Formação iaMenu'}</h4>
              <div className="space-y-3">
                {onboardingTasks.filter(t => t.category === cat).map((task) => (
                  <label
                    key={task.id}
                    className={`flex items-start gap-4 p-4 rounded-xl bg-surface-dark border transition-all ${
                      task.completed
                        ? 'border-white/5 opacity-50 grayscale'
                        : task.isUrgent
                        ? 'border-primary/50 shadow-sm shadow-primary/10'
                        : 'border-white/5'
                    }`}
                  >
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        readOnly
                        className="w-6 h-6 rounded-full border-2 border-gray-600 text-primary focus:ring-primary focus:ring-offset-0 bg-transparent cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h5 className={`text-base font-semibold text-white ${task.completed ? 'line-through decoration-gray-500' : ''}`}>
                          {task.title}
                        </h5>
                        {!task.completed && task.isUrgent && (
                          <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-primary/20">Hoje</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                      {!task.completed && task.category === 'FORMAÇÃO' && (
                         <div className="mt-3">
                            <button className="bg-primary hover:bg-primary-hover text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-lg shadow-primary/20">
                              <span className="material-icons-round text-sm">play_circle</span>
                              Ver Vídeo
                            </button>
                         </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default Onboarding;
