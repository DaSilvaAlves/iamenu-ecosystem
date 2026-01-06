
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { mockAnnouncements } from '../mockData';
import { useAuth } from '../App';

const Announcements: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background-dark flex flex-col pb-32">
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 pt-12 pb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-white/5">
            <span className="material-icons-round text-primary text-xl">campaign</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Anúncios</h1>
            <p className="text-xs text-gray-500 font-medium">Equipa iaMenu</p>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-zinc-800 transition-colors relative group">
          <span className="material-icons-round text-gray-400 group-hover:text-white">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-background-dark"></span>
        </button>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6">
        {/* Banner */}
        <div className="relative w-full h-52 rounded-2xl overflow-hidden group shadow-lg border border-white/5">
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 text-center flex flex-col items-center justify-end h-full">
            <span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-[10px] font-bold text-primary uppercase mb-3 tracking-wider backdrop-blur-sm">Novidade</span>
            <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
              iaMenu <span className="text-primary">Ecosystem</span>
            </h2>
            <p className="text-sm text-gray-300 font-light max-w-[95%] leading-snug">
              Revolucionando a restauração em Portugal. Bem-vindos ao futuro!
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 hide-scrollbar">
          <button className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow-lg shadow-primary/20 whitespace-nowrap">Todos</button>
          <button className="px-5 py-2 bg-zinc-900 border border-white/5 text-gray-400 text-sm font-medium rounded-lg whitespace-nowrap hover:bg-zinc-800 hover:text-white transition-colors">Gestão</button>
          <button className="px-5 py-2 bg-zinc-900 border border-white/5 text-gray-400 text-sm font-medium rounded-lg whitespace-nowrap hover:bg-zinc-800 hover:text-white transition-colors">Turnos</button>
          <button className="px-5 py-2 bg-zinc-900 border border-white/5 text-gray-400 text-sm font-medium rounded-lg whitespace-nowrap hover:bg-zinc-800 hover:text-white transition-colors">Eventos</button>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {mockAnnouncements.map((ann) => (
            <article
              key={ann.id}
              className={`bg-surface-dark rounded-xl p-5 shadow-sm border border-white/5 hover:border-primary/50 transition-colors group relative overflow-hidden ${ann.isPinned ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                    ann.category === 'IMPORTANTE' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-zinc-800 text-gray-400 border-white/5'
                  }`}>
                    {ann.category}
                  </span>
                  <span className="text-xs text-gray-500">{ann.date}</span>
                </div>
                {ann.isPinned && <span className="material-icons-round text-primary text-sm">push_pin</span>}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 leading-tight group-hover:text-primary transition-colors">{ann.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{ann.content}</p>

              {ann.images && (
                <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden mt-3">
                  {ann.images.map((img, i) => (
                    <img key={i} src={img} alt="Post" className="h-28 w-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <img src={ann.authorAvatar} alt="Author" className="w-7 h-7 rounded-full ring-2 ring-background-dark" />
                  <span className="text-xs text-gray-400">{ann.author}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-500">
                  <button className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors">
                    <span className="material-icons-round text-sm">favorite_border</span> {ann.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors">
                    <span className="material-icons-round text-sm">chat_bubble_outline</span> {ann.comments}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {user?.role === 'MANAGER' && (
        <button
          onClick={() => navigate('/manager/create-announcement')}
          className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform border-4 border-background-dark z-50"
        >
          <span className="material-icons-round text-2xl">add</span>
        </button>
      )}

      <Navigation />
    </div>
  );
};

export default Announcements;
