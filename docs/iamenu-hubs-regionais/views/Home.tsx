
import React, { useState } from 'react';
import { MOCK_POSTS, HUBS } from '../constants';
import { PostCategory, Post } from '../types';
import CreatePostModal from '../components/CreatePostModal';

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS as any);
  const hub = HUBS[0];

  const handleCreatePost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="relative h-60 overflow-hidden group">
        <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" alt="Hub Banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
          <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest w-fit mb-2">Comunidade iaMenu</span>
          <h2 className="text-3xl font-bold text-white mb-1">{hub.name}</h2>
          <p className="text-gray-200 text-sm max-w-sm">{hub.description}</p>
        </div>
      </div>

      <div className="px-4 flex items-center justify-between">
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 rounded-2xl flex items-center p-1.5 shadow-sm">
           <span className="material-symbols-outlined text-slate-400 px-2">groups</span>
           <span className="text-xs font-semibold pr-4">{hub.memberCount} Membros</span>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Novo Post
        </button>
      </div>

      <div className="px-4 overflow-x-auto hide-scrollbar flex gap-2">
        {['Todas', ...Object.values(PostCategory)].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === cat 
                ? 'bg-primary text-white shadow-md shadow-primary/10' 
                : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-4">
        {posts.map(post => (
          <article key={post.id} className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-sm hover:border-primary/20 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-white/5" />
                <div>
                  <h4 className="font-bold text-sm">{post.author.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{post.author.restaurant} • {post.timestamp}</p>
                </div>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                post.category === PostCategory.EVENTO ? 'bg-green-100 text-green-700' :
                post.category === PostCategory.DUVIDA ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {post.category}
              </span>
            </div>

            <h3 className="font-bold text-base mb-2 leading-snug">{post.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3 leading-relaxed">
              {post.content}
            </p>

            {/* Links anexados */}
            {post.link && (
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/30 transition-all group">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">link</span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate flex-1">{post.link}</span>
                <span className="material-symbols-outlined text-sm text-slate-300">open_in_new</span>
              </a>
            )}

            {/* Sondagens */}
            {post.poll && post.poll.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Sondagem</p>
                {post.poll.map((opt, i) => (
                  <button key={i} className="w-full p-3 text-left text-xs font-bold rounded-xl border border-slate-100 dark:border-white/5 hover:bg-primary/5 hover:border-primary/20 transition-all flex justify-between items-center group">
                    <span>{opt}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-primary transition-opacity">0%</span>
                  </button>
                ))}
              </div>
            )}

            {post.imageUrl && (
              <div className="rounded-xl overflow-hidden mb-4 aspect-video">
                <img src={post.imageUrl} alt="Post image" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">favorite</span>
                  <span className="text-xs font-bold">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-slate-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-lg">chat_bubble</span>
                  <span className="text-xs font-bold">{post.commentsCount}</span>
                </button>
              </div>
              <button className="text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">share</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {isModalOpen && (
        <CreatePostModal 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleCreatePost} 
        />
      )}
    </div>
  );
};

export default Home;
