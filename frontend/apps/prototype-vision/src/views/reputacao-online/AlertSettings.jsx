import React, { useState } from 'react';

const AlertSettings = () => {
  const [starRange, setStarRange] = useState(3);

  return (
    <div className="flex flex-col gap-6 p-4 animate-in fade-in duration-500 pb-20">
      <header className="mt-2 flex items-center justify-between">
        <h2 className="text-xl font-bold">Alertas e Notificações</h2>
      </header>

      <section>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Configuração</h3>
        <div className="flex flex-col gap-4">
          <div className="bg-[#141414] rounded-xl p-5 border border-[#262626]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col gap-1">
                <p className="text-white font-bold">Pontuação Estrela</p>
                <p className="text-gray-500 text-xs font-medium">Intervalo de alerta</p>
              </div>
              <span className="bg-[#FF5420]/10 text-[#FF5420] text-xs font-bold px-3 py-1.5 rounded-lg border border-[#FF5420]/20">
                1 - {starRange} Estrelas
              </span>
            </div>

            <div className="relative h-12 w-full flex items-center px-1">
              <div className="absolute h-1.5 w-full rounded-full bg-zinc-800"></div>
              <div
                className="absolute h-1.5 rounded-full bg-[#FF5420] left-0 transition-all duration-300"
                style={{ width: `${(starRange - 1) * 25}%` }}
              ></div>

              {[1, 2, 3, 4, 5].map((val) => (
                <div
                  key={val}
                  onClick={() => setStarRange(val)}
                  className="absolute flex flex-col items-center gap-2 group cursor-pointer -translate-x-1/2"
                  style={{ left: `${(val - 1) * 25}%` }}
                >
                  <div className={`size-5 rounded-full ring-4 ring-[#141414] shadow-lg transition-all ${val <= starRange ? 'bg-[#FF5420]' : 'bg-zinc-700'}`}></div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${val <= starRange ? 'text-gray-400' : 'text-zinc-600'}`}>{val} Estrelas</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141414] rounded-xl p-5 border border-[#262626]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <p className="text-white font-bold">Palavras-chave</p>
                <p className="text-gray-500 text-xs">Alertar ao encontrar correspondência</p>
              </div>
              <button className="text-[#FF5420] text-xs font-bold uppercase tracking-wide">Editar</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['"Intoxicação"', '"Sujo"'].map((kw) => (
                <div key={kw} className="flex items-center gap-2 bg-[#FF5420]/10 text-[#FF5420] px-3 py-1.5 rounded-lg text-sm font-medium border border-[#FF5420]/20">
                  <span>{kw}</span>
                  <span className="material-symbols-outlined text-[16px] cursor-pointer">close</span>
                </div>
              ))}
              <button className="flex items-center justify-center size-9 rounded-lg border border-dashed border-zinc-700 text-gray-500 hover:border-[#FF5420] hover:text-[#FF5420] transition-all">
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Canais de Entrega</h3>
        <div className="bg-[#141414] rounded-xl overflow-hidden border border-[#262626] divide-y divide-[#262626]">
          {[
            { id: 'push', label: 'Notificações Push', sub: 'Alertas em tempo real', icon: 'notifications_active', color: 'text-blue-400', checked: true },
            { id: 'email', label: 'Resumo por Email', sub: 'Sumário diário', icon: 'mail', color: 'text-purple-400', checked: true },
            { id: 'sms', label: 'Alertas SMS', sub: 'Apenas críticos', icon: 'sms', color: 'text-orange-400', checked: false }
          ].map((ch) => (
            <div key={ch.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`size-10 rounded-lg bg-zinc-800 flex items-center justify-center ${ch.color}`}>
                  <span className="material-symbols-outlined">{ch.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-200 font-semibold text-sm">{ch.label}</span>
                  <span className="text-gray-500 text-xs">{ch.sub}</span>
                </div>
              </div>
              <label className="relative flex h-6 w-11 cursor-pointer items-center rounded-full bg-zinc-700 transition-colors has-[:checked]:bg-[#FF5420]">
                <div className="absolute left-1 size-4 rounded-full bg-white shadow-sm transition-transform has-[:checked]:translate-x-5"></div>
                <input type="checkbox" className="sr-only" defaultChecked={ch.checked} />
              </label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AlertSettings;
