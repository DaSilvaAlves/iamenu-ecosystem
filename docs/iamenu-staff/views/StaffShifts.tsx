
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { mockShifts } from '../mockData';

const StaffShifts: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-dark flex flex-col pb-32">
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 pt-12 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-6">Escala Semanal</h1>
        <div className="flex justify-between items-center overflow-x-auto hide-scrollbar gap-2">
          {['SEG', 'TER', 'QUA', 'QUI', 'SEX'].map((day, i) => (
            <div
              key={day}
              className={`flex flex-col items-center justify-center min-w-[56px] h-[76px] rounded-2xl border transition-all ${
                day === 'SEG' ? 'bg-primary border-primary shadow-lg shadow-primary/20 text-white' : 'bg-surface-dark border-white/5 text-gray-500'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">{day}</span>
              <span className={`text-xl font-bold mt-1 ${day === 'SEG' ? 'text-white' : 'text-gray-200'}`}>{14 + i}</span>
            </div>
          ))}
        </div>
      </header>

      <main className="flex-1 px-6 py-6 space-y-6 overflow-y-auto">
        <h3 className="text-lg font-bold text-white mb-2">Próximos Turnos</h3>
        <div className="space-y-4">
          {mockShifts.map((shift) => (
            <div
              key={shift.id}
              onClick={() => navigate(`/shift/${shift.id}`)}
              className="bg-surface-dark hover:bg-zinc-800 rounded-2xl p-5 border border-white/5 transition-all cursor-pointer relative overflow-hidden group"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    shift.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-zinc-800 text-gray-400 border-white/5'
                  }`}>
                    <span className="text-[10px] font-bold uppercase">{shift.date.split('-')[2]}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-200">{new Date(shift.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long' })}</p>
                    <p className="text-xs text-gray-500">{shift.tag}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold text-white text-sm">{shift.startTime} - {shift.endTime}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">Confirmado</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-xs font-medium text-gray-400">
                  <span className="material-icons-round text-[14px]">local_bar</span> {shift.position}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-xs font-medium text-gray-400">
                  <span className="material-icons-round text-[14px]">map</span> {shift.location}
                </span>
              </div>
              {shift.status === 'PENDING' && (
                <div className="mt-4 flex gap-3">
                  <button className="flex-1 py-2.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">Aceitar Turno</button>
                  <button className="flex-1 py-2.5 rounded-lg bg-zinc-800 text-gray-300 text-xs font-bold transition-all border border-white/5">Pedir Troca</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Navigation />
    </div>
  );
};

export default StaffShifts;
