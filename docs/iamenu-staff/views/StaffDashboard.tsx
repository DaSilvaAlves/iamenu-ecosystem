
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { mockShifts, currentUser } from '../mockData';

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const nextShift = mockShifts.find(s => s.status === 'CONFIRMED');

  return (
    <div className="min-h-screen bg-background-dark pb-32">
      <header className="sticky top-0 z-50 glass border-b border-white/5 pt-12 pb-4 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-zinc-800 overflow-hidden border border-white/10 p-0.5">
              <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h1 className="text-xs text-gray-500 font-medium uppercase tracking-wide">Bem vindo</h1>
              <p className="text-lg font-bold leading-none text-white">{currentUser.name}</p>
            </div>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 border border-white/5 relative">
            <span className="material-icons-round text-gray-300 text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-primary rounded-full"></span>
          </button>
        </div>
      </header>

      <main className="px-6 py-6 space-y-8">
        {/* Next Shift Card */}
        {nextShift && (
          <div
            onClick={() => navigate(`/shift/${nextShift.id}`)}
            className="bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-sm relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Próximo Turno</h2>
                <p className="text-2xl font-bold text-white">Hoje, 14 Out</p>
              </div>
              <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-green-500/20 uppercase tracking-wide">Confirmado</span>
            </div>
            <div className="flex items-center gap-4 mt-5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center text-primary">
                <span className="material-icons-round text-2xl">schedule</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Horário</p>
                <p className="text-xl font-bold text-white tracking-tight">{nextShift.startTime} - {nextShift.endTime}</p>
              </div>
            </div>
            <div className="h-px bg-white/5 my-5 relative z-10"></div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-zinc-800 text-gray-400">
                  <span className="material-icons-round text-xs">restaurant</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Posto</p>
                  <p className="text-sm font-semibold text-gray-200 mt-0.5">{nextShift.position}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-md bg-zinc-800 text-gray-400">
                  <span className="material-icons-round text-xs">place</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Local</p>
                  <p className="text-sm font-semibold text-gray-200 mt-0.5">{nextShift.location}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* This Week Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Esta Semana</h3>
            <span onClick={() => navigate('/shifts')} className="text-xs text-primary font-bold cursor-pointer uppercase tracking-wide">Ver calendário</span>
          </div>

          <div className="space-y-4">
            {mockShifts.map(shift => (
              <div
                key={shift.id}
                onClick={() => navigate(`/shift/${shift.id}`)}
                className={`bg-surface-dark hover:bg-zinc-800/80 rounded-2xl p-5 border border-white/5 transition-all cursor-pointer ${shift.status === 'PENDING' ? 'border-l-4 border-l-primary' : ''}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-white/5">
                      <span className="text-[10px] font-bold uppercase text-gray-400">{shift.date.split('-')[2]}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-200">{new Date(shift.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })}</p>
                      <p className="text-xs text-gray-500">{shift.tag}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-white text-sm">{shift.startTime} - {shift.endTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-xs font-medium text-gray-400">
                    <span className="material-icons-round text-[14px]">local_bar</span> {shift.position}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-xs font-medium text-gray-400">
                    <span className="material-icons-round text-[14px]">place</span> {shift.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default StaffDashboard;
