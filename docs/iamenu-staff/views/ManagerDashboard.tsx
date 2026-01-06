
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { mockShifts, staffList } from '../mockData';

const ManagerDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark pb-32 max-w-md mx-auto relative flex flex-col overflow-hidden">
      <header className="pt-12 px-6 pb-4 flex justify-between items-center z-10 sticky top-0 glass border-b border-white/5">
        <div>
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Bem-vindo de volta</p>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
        </div>
        <div className="relative">
          <button className="p-2 rounded-full bg-surface-dark border border-white/5 shadow-sm hover:bg-zinc-800 transition-colors">
            <span className="material-icons-round text-gray-300">notifications_none</span>
          </button>
          <span className="absolute top-0 right-0 h-3 w-3 bg-primary rounded-full border-2 border-background-dark"></span>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6 overflow-y-auto hide-scrollbar">
        {/* Banner */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-lg group border border-white/5">
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            alt="Dashboard Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="relative z-10 h-full flex flex-col justify-center px-6 text-white">
            <div className="mb-2 inline-flex">
              <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-primary/20">Novidade</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">iaMenu Ecosystem</h2>
            <p className="text-sm text-gray-300 max-w-[80%] leading-snug mb-4">Revolucionar a restauração em Portugal.</p>
            <button className="w-fit text-xs font-semibold bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
              Explorar Módulos <span className="material-icons-round text-xs">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Calendar Strip */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-1">
            <h3 className="text-lg font-semibold text-white">Calendário da Equipa</h3>
            <button className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">Ver Completo</button>
          </div>
          <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-2">
            {[23, 24, 25, 26, 27].map((day, i) => (
              <div
                key={day}
                className={`flex flex-col items-center justify-center min-w-[3.5rem] h-16 rounded-xl border transition-all ${
                  day === 24 ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-surface-dark text-gray-400 border-white/5 opacity-60'
                }`}
              >
                <span className="text-[10px] font-bold">
                  {['SEG', 'TER', 'QUA', 'QUI', 'SEX'][i]}
                </span>
                <span className="font-bold text-lg">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-dark border border-white/5 p-4 rounded-xl flex flex-col justify-between h-28 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start w-full">
              <div className="p-2 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <span className="material-icons-round text-red-500 text-sm">warning</span>
              </div>
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">Turnos não atribuídos</span>
          </div>
          <div className="bg-surface-dark border border-white/5 p-4 rounded-xl flex flex-col justify-between h-28 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start w-full">
              <div className="p-2 w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <span className="material-icons-round text-orange-500 text-sm">group</span>
              </div>
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">Sobreposições de horário</span>
          </div>
        </div>

        {/* Today's Shifts Timeline */}
        <div className="bg-surface-dark rounded-2xl p-5 border border-white/5 shadow-sm">
          <h3 className="font-semibold mb-4 text-base text-white">Turnos de Hoje</h3>
          <div className="space-y-6 relative">
            <div className="absolute left-[45px] top-2 bottom-2 w-px bg-zinc-800"></div>
            {mockShifts.map((shift, i) => {
              const staff = staffList.find(u => u.id === shift.userId) || staffList[0];
              return (
                <div key={shift.id} className="flex group relative items-start">
                  <div className="w-10 text-[10px] font-bold text-gray-500 pt-3 text-right pr-2">{shift.startTime}</div>
                  <div className={`relative z-10 w-3 h-3 rounded-full border-2 border-surface-dark mt-3 ${
                    i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-red-500' : 'bg-gray-600'
                  }`}></div>
                  <div className="flex-1 ml-4 bg-zinc-900 p-3 rounded-xl border border-white/5 flex items-center gap-3 hover:bg-zinc-800 transition-colors cursor-pointer">
                    <img src={staff.avatar} alt="Staff" className="w-9 h-9 rounded-full border border-white/5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-100">{staff.name}</h4>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">{shift.position} • {shift.tag}</p>
                    </div>
                    {i === 0 && <span className="text-[9px] font-bold text-emerald-400 uppercase border border-emerald-500/20 px-1.5 py-0.5 rounded">Ativo</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 pb-8">
          <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400">
              <span className="material-icons-round text-xl">schedule</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Horas Totais</p>
              <p className="font-bold text-lg text-white">142h</p>
            </div>
          </div>
          <div className="bg-surface-dark p-4 rounded-2xl border border-white/5 flex items-center gap-3">
            <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400">
              <span className="material-icons-round text-xl">monetization_on</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Custo Est.</p>
              <p className="font-bold text-lg text-white">1.2k€</p>
            </div>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default ManagerDashboard;
