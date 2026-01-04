import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, Link as LinkIcon, BarChart3 } from 'lucide-react';

const POST_CATEGORIES = {
    DICA: { label: 'Dica', icon: 'lightbulb' },
    DUVIDA: { label: 'Dúvida', icon: 'help' },
    SHOWCASE: { label: 'Showcase', icon: 'emoji_events' },
    EVENTO: { label: 'Evento', icon: 'event' },
    GERAL: { label: 'Geral', icon: 'chat' },
};

const CreatePostModal = ({ onClose, onSubmit, hub }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('GERAL');
    const [imageUrl, setImageUrl] = useState('');
    const [link, setLink] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newPost = {
            id: `p${Date.now()}`,
            author: {
                name: 'Você',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
                restaurant: 'Meu Restaurante',
            },
            category,
            title,
            content,
            timestamp: 'Agora',
            likes: 0,
            commentsCount: 0,
            imageUrl: imageUrl || undefined,
            link: link || undefined,
            isPinned: false,
        };

        onSubmit(newPost);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="glass-panel rounded-[40px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Criar Post</h2>
                            <p className="text-white/40 text-sm mt-1">Partilhe com {hub.name}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all"
                        >
                            <X size={20} className="text-white/60" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category Selection */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-white/60">
                                Categoria
                            </label>
                            <div className="grid grid-cols-5 gap-2">
                                {Object.entries(POST_CATEGORIES).map(([key, cat]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setCategory(key)}
                                        className={`p-3 rounded-2xl border transition-all ${
                                            category === key
                                                ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20'
                                                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-xl block mb-1">{cat.icon}</span>
                                        <span className="text-xs font-black">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-white/60">
                                Título
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Como aumentei 20% na margem..."
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-white/60">
                                Conteúdo
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Partilhe a sua experiência, dica ou dúvida..."
                                required
                                rows={6}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                            />
                        </div>

                        {/* Advanced Options Toggle */}
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="text-xs font-black text-primary hover:underline uppercase flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">
                                {showAdvanced ? 'expand_less' : 'expand_more'}
                            </span>
                            Opções Avançadas
                        </button>

                        {/* Advanced Options */}
                        {showAdvanced && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4"
                            >
                                {/* Image URL */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
                                        <Image size={14} />
                                        URL da Imagem (opcional)
                                    </label>
                                    <input
                                        type="url"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    />
                                </div>

                                {/* Link */}
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
                                        <LinkIcon size={14} />
                                        Link Externo (opcional)
                                    </label>
                                    <input
                                        type="url"
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white/60 rounded-2xl font-black uppercase transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={!title.trim() || !content.trim()}
                                className="flex-1 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase shadow-lg shadow-primary/20 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                Publicar
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreatePostModal;
