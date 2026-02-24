import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Heart, MessageCircle, Share2, Pin } from 'lucide-react';
import CreatePostModal from './CreatePostModal';

interface PostAuthor {
  name: string;
  avatar: string;
  restaurant: string;
}

interface Post {
  id: string;
  author: PostAuthor;
  category: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  imageUrl?: string;
  isPinned?: boolean;
}

interface Hub {
  name: string;
  region: string;
}

interface HubFeedProps {
  hub: Hub;
}

const POST_CATEGORIES: Record<string, { label: string; color: string }> = {
  DICA: { label: 'Dica', color: 'blue' },
  DUVIDA: { label: 'Duvida', color: 'purple' },
  SHOWCASE: { label: 'Showcase', color: 'green' },
  EVENTO: { label: 'Evento', color: 'orange' },
  GERAL: { label: 'Geral', color: 'gray' },
};

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: { name: 'Ana Costa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana', restaurant: 'Bistro 22' },
    category: 'EVENTO',
    title: 'Workshop de Mixologia - Lisboa',
    content: 'Nao percam o proximo workshop no Hub Lisboa. Vamos explorar novas tendencias para o verao de 2024. Inscricoes abertas!',
    timestamp: '5h atras',
    likes: 45,
    commentsCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
    isPinned: true
  },
  {
    id: 'p2',
    author: { name: 'Miguel Santos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel', restaurant: 'Cafe Central' },
    category: 'DUVIDA',
    title: 'POS System: Qual recomendam?',
    content: 'Estamos a pensar trocar o nosso sistema de POS. Qual e o melhor para integrar com Uber Eats e Glovo sem dores de cabeca?',
    timestamp: '1d atras',
    likes: 8,
    commentsCount: 23
  },
  {
    id: 'p3',
    author: { name: 'Sofia Pereira', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia', restaurant: 'Tasca do Ze' },
    category: 'DICA',
    title: 'Como reduzimos 15% no desperdicio alimentar',
    content: 'Implementamos um sistema de tracking diario com o modulo Food Cost do iaMenu. Em 2 meses reduzimos o desperdicio em 15%. Partilho o processo...',
    timestamp: '2d atras',
    likes: 67,
    commentsCount: 34,
  },
];

const HubFeed = ({ hub }: HubFeedProps) => {
    const [activeCategory, setActiveCategory] = useState('Todas');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

    const handleCreatePost = (newPost: Post) => {
        setPosts([newPost, ...posts]);
        setIsModalOpen(false);
    };

    const getCategoryColor = (category: string): string => {
        const colors: Record<string, string> = {
            blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            green: 'bg-green-500/10 text-green-400 border-green-500/20',
            orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            gray: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        };
        return colors[POST_CATEGORIES[category]?.color] || colors.gray;
    };

    return (
        <div className="space-y-6">
            {/* Create Post Button */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                    {['Todas', ...Object.values(POST_CATEGORIES).map(c => c.label)].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                                activeCategory === cat
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 border border-white/5'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="ml-4 flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 transition-all hover:scale-105 whitespace-nowrap"
                >
                    <Plus size={18} />
                    Novo Post
                </button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-6 rounded-[30px] hover:border-primary/20 transition-all"
                    >
                        {/* Post Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    className="w-12 h-12 rounded-full ring-2 ring-white/10"
                                />
                                <div>
                                    <h4 className="font-bold text-white">{post.author.name}</h4>
                                    <p className="text-xs text-white/40 font-medium">
                                        {post.author.restaurant} - {post.timestamp}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {post.isPinned && (
                                    <Pin size={16} className="text-primary" fill="currentColor" />
                                )}
                                <span className={`text-xs font-black px-3 py-1 rounded-full uppercase border ${getCategoryColor(post.category)}`}>
                                    {POST_CATEGORIES[post.category]?.label}
                                </span>
                            </div>
                        </div>

                        {/* Post Content */}
                        <h3 className="font-black text-lg text-white mb-2 leading-snug">{post.title}</h3>
                        <p className="text-sm text-white/60 mb-4 leading-relaxed">{post.content}</p>

                        {/* Post Image */}
                        {post.imageUrl && (
                            <div className="rounded-2xl overflow-hidden mb-4 aspect-video">
                                <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-6">
                                <button className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors">
                                    <Heart size={18} />
                                    <span className="text-sm font-bold">{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors">
                                    <MessageCircle size={18} />
                                    <span className="text-sm font-bold">{post.commentsCount}</span>
                                </button>
                            </div>
                            <button className="text-white/40 hover:text-primary transition-colors">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </motion.article>
                ))}
            </div>

            {/* Empty State */}
            {posts.length === 0 && (
                <div className="glass-panel p-12 rounded-[30px] text-center">
                    <span className="material-symbols-outlined text-6xl text-white/10 mb-4">forum</span>
                    <h3 className="text-xl font-black text-white/20 uppercase mb-2">Nenhum post ainda</h3>
                    <p className="text-white/40 text-sm">Seja o primeiro a partilhar algo com a comunidade!</p>
                </div>
            )}

            {/* Create Post Modal */}
            {isModalOpen && (
                <CreatePostModal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreatePost}
                    hub={hub}
                />
            )}
        </div>
    );
};

export default HubFeed;
