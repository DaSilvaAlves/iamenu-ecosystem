import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Award, MoreHorizontal, Plus, Loader } from 'lucide-react';
import { CommunityAPI, Auth } from '../services/api';
import TextRenderer from '../components/TextRenderer';
import MentionInput from '../components/MentionInput';

const CommunityView = ({ selectedGroup, setSelectedGroup }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNewPostModal, setShowNewPostModal] = useState(false);
    const [expandedComments, setExpandedComments] = useState({}); // { postId: true/false }
    const [comments, setComments] = useState({}); // { postId: [comments] }
    const [newComment, setNewComment] = useState({}); // { postId: 'content' }

    // Phase 8: Search and filters
    const [searchInput, setSearchInput] = useState(''); // Local input state
    const [searchQuery, setSearchQuery] = useState(''); // Actual search query
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('recent');

    // Feed Personalizado: Tabs and user groups
    const [feedTab, setFeedTab] = useState('all'); // 'all' ou 'mygroups'
    const [userGroups, setUserGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(false);

    // Debounce search input
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    // Load posts from backend (reload when filters or tab change)
    useEffect(() => {
        loadPosts(selectedGroup?.id);
    }, [selectedGroup, searchQuery, selectedCategory, sortBy, feedTab]);

    // Ensure authentication on mount
    useEffect(() => {
        ensureAuthentication();
        loadUserGroups();
    }, []);

    const ensureAuthentication = async () => {
        if (!Auth.isAuthenticated()) {
            try {
                await Auth.getTestToken();
                console.log('✅ Authenticated with test token');
            } catch (err) {
                console.error('❌ Authentication failed:', err);
            }
        }
    };

    const loadUserGroups = async () => {
        try {
            setLoadingGroups(true);
            const userId = Auth.getUserId();
            if (!userId) return;

            const data = await CommunityAPI.getUserGroups(userId);
            setUserGroups(data.data || []);
        } catch (err) {
            console.error('Error loading user groups:', err);
        } finally {
            setLoadingGroups(false);
        }
    };

    const loadPosts = async (groupId = null) => {
        try {
            setLoading(true);
            const params = { limit: 10 };

            // Feed Personalizado: Add userGroupIds filter when on "Meus Grupos" tab
            if (feedTab === 'mygroups' && userGroups.length > 0) {
                params.userGroupIds = userGroups.map(g => g.id).join(',');
            }

            if (groupId) params.groupId = groupId;
            if (searchQuery) params.search = searchQuery;
            if (selectedCategory) params.category = selectedCategory;
            if (sortBy) params.sortBy = sortBy;

            const data = await CommunityAPI.getPosts(params);
            setPosts(data.data || []);
            setError(null);
        } catch (err) {
            console.error('Error loading posts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (postData) => {
        try {
            await CommunityAPI.createPost(postData);
            setShowNewPostModal(false);
            loadPosts(); // Reload posts
        } catch (err) {
            alert('Erro ao criar post: ' + err.message);
        }
    };

    const toggleComments = async (postId) => {
        const isExpanded = expandedComments[postId];

        if (!isExpanded) {
            // Load comments if not already loaded
            if (!comments[postId]) {
                try {
                    const data = await CommunityAPI.getComments(postId);
                    setComments(prev => ({ ...prev, [postId]: data.data || [] }));
                } catch (err) {
                    console.error('Error loading comments:', err);
                }
            }
        }

        setExpandedComments(prev => ({ ...prev, [postId]: !isExpanded }));
    };

    const handleCreateComment = async (postId) => {
        const content = newComment[postId];
        if (!content || !content.trim()) {
            alert('Comentário não pode estar vazio');
            return;
        }

        try {
            await CommunityAPI.createComment(postId, { content: content.trim() });

            // Reload comments
            const data = await CommunityAPI.getComments(postId);
            setComments(prev => ({ ...prev, [postId]: data.data || [] }));

            // Clear input
            setNewComment(prev => ({ ...prev, [postId]: '' }));
        } catch (err) {
            alert('Erro ao criar comentário: ' + err.message);
        }
    };

    const handleReaction = async (postId, reactionType) => {
        try {
            const result = await CommunityAPI.toggleReaction(postId, reactionType);

            // Update post reactions in state
            setPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post.id === postId) {
                        const reactions = { ...post.reactions };
                        if (result.data.action === 'added') {
                            reactions[reactionType] = (reactions[reactionType] || 0) + 1;
                        } else {
                            reactions[reactionType] = Math.max(0, (reactions[reactionType] || 0) - 1);
                        }
                        return { ...post, reactions };
                    }
                    return post;
                })
            );
        } catch (err) {
            console.error('Error toggling reaction:', err);
            alert('Erro ao reagir: ' + err.message);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'agora';
        if (seconds < 3600) return `há ${Math.floor(seconds / 60)} min`;
        if (seconds < 86400) return `há ${Math.floor(seconds / 3600)}h`;
        return `há ${Math.floor(seconds / 86400)} dias`;
    };

    const getCategoryLabel = (category) => {
        const labels = {
            dica: 'Dica',
            duvida: 'Dúvida',
            showcase: 'Showcase',
            evento: 'Evento'
        };
        return labels[category] || category;
    };

    
    const parseTags = (tags) => {
        if (!tags) return [];
        if (Array.isArray(tags)) return tags;
        try {
            const parsed = JSON.parse(tags);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
            {/* Hero Banner */}
            <div style={{
                width: '100%',
                height: '340px',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                backgroundImage: 'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid var(--border)'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '0 40px'
                }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '12px' }}>iaMenu Ecosystem</h2>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', maxWidth: '600px' }}>
                        Juntos estamos a revolucionar a restauração em Portugal. Bem-vindos ao futuro!
                    </p>
                </div>
            </div>

            {/* Feed Header */}
            <div className="flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {selectedGroup ? `Feed - ${selectedGroup.name}` : 'Feed'}
                    </h3>
                    {selectedGroup && (
                        <button
                            onClick={() => setSelectedGroup(null)}
                            style={{
                                marginTop: '8px',
                                padding: '4px 12px',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                color: 'var(--text-muted)',
                                fontSize: '0.8rem',
                                cursor: 'pointer'
                            }}
                        >
                            ← Todos os posts
                        </button>
                    )}
                </div>
                <button
                    onClick={() => setShowNewPostModal(true)}
                    style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        padding: '8px 20px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        border: 'none'
                    }}
                >
                    <Plus size={18} /> New post
                </button>
            </div>

            {/* Feed Tabs */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '20px',
                marginBottom: '20px'
            }}>
                <button
                    onClick={() => setFeedTab('all')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: feedTab === 'all' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: feedTab === 'all' ? 'white' : 'var(--text-muted)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.95rem',
                        fontWeight: feedTab === 'all' ? '600' : '500'
                    }}
                >
                    Todos os Posts
                </button>
                <button
                    onClick={() => setFeedTab('mygroups')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: feedTab === 'mygroups' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: feedTab === 'mygroups' ? 'white' : 'var(--text-muted)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.95rem',
                        fontWeight: feedTab === 'mygroups' ? '600' : '500'
                    }}
                >
                    Meus Grupos {userGroups.length > 0 && `(${userGroups.length})`}
                </button>
            </div>

            {/* Empty State - User has no groups */}
            {feedTab === 'mygroups' && userGroups.length === 0 && !loading && (
                <div className="glass-panel" style={{
                    padding: '60px 40px',
                    textAlign: 'center',
                    marginTop: '20px',
                    marginBottom: '20px'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
                    <h3 style={{ marginBottom: '12px' }}>Ainda não és membro de nenhum grupo</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Junta-te a grupos para ver posts personalizados aqui
                    </p>
                    <button
                        onClick={() => window.location.href = '/grupos'}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: '500'
                        }}
                    >
                        Explorar Grupos
                    </button>
                </div>
            )}

            {/* Phase 8: Search and Filters */}
            <div className="glass-panel" style={{ padding: '20px', marginTop: '16px' }}>
                {/* Search Bar */}
                <div style={{ marginBottom: '16px' }}>
                    <input
                        type="text"
                        placeholder="Pesquisar posts..."
                        value={searchInput}
                        onChange={(e) => {
                            console.log('Input changed:', e.target.value);
                            setSearchInput(e.target.value);
                        }}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '0.9rem'
                        }}
                    />
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Debug: "{searchInput}"
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    {/* Category Filters */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '8px' }}>Categoria:</span>
                        {['', 'dica', 'duvida', 'showcase', 'evento'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '6px 14px',
                                    backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '16px',
                                    color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {cat === '' ? 'Todas' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ordenar:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '0.85rem',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="recent">Mais Recente</option>
                            <option value="popular">Mais Popular</option>
                            <option value="commented">Mais Comentado</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
                {/* Main Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* New Post Input */}
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--border)' }}></div>
                            <span style={{ fontSize: '0.9rem' }}>Vais partilhar algo hoje, Eurico?</span>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                            <Loader size={32} className="animate-spin" style={{ margin: '0 auto', color: 'var(--primary)' }} />
                            <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>A carregar posts...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="glass-panel" style={{ padding: '24px', backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.3)' }}>
                            <p style={{ color: '#ff6b6b' }}>❌ Erro: {error}</p>
                            <button
                                onClick={loadPosts}
                                style={{ marginTop: '12px', padding: '8px 16px', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    {/* Posts List */}
                    {!loading && posts.length === 0 && (
                        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-muted)' }}>Ainda não há posts. Seja o primeiro a partilhar!</p>
                        </div>
                    )}

                    {!loading && posts.map(post => (
                        <div key={post.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                            <div style={{ padding: '24px' }}>
                                {/* Post Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--border)',
                                            fontSize: '1.2rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            👤
                                        </div>
                                        <div>
                                            <h4 style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                                {post.authorName || 'Restaurador'}
                                            </h4>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {formatTimeAgo(post.createdAt)} • <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
                                                    {getCategoryLabel(post.category)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <MoreHorizontal size={20} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                                </div>

                                {/* Post Title */}
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px' }}>
                                    {post.title}
                                </h3>

                                {/* Post Body */}
                                <TextRenderer text={post.body} />

                                {/* Post Image */}
                                {post.imageUrl && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <img
                                            src={`http://localhost:3004${post.imageUrl}`}
                                            alt={post.title}
                                            style={{
                                                width: '100%',
                                                maxHeight: '500px',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                                border: '1px solid var(--border)'
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Tags */}
                                {parseTags(post.tags).length > 0 && (
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                        {parseTags(post.tags).map(tag => (
                                            <span key={tag} style={{
                                                fontSize: '0.75rem',
                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                color: 'var(--text-muted)'
                                            }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Post Footer */}
                            <div style={{
                                padding: '12px 24px',
                                borderTop: '1px solid var(--border)',
                                display: 'flex',
                                gap: '24px',
                                fontSize: '0.85rem',
                                color: 'var(--text-muted)'
                            }}>
                                <div
                                    onClick={() => toggleComments(post.id)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'color 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                >
                                    <MessageSquare size={16} /> {comments[post.id]?.length || post._count?.comments || 0} Comentários
                                </div>
                                <div
                                    onClick={() => handleReaction(post.id, 'like')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        color: (post.reactions?.like > 0) ? 'var(--primary)' : 'var(--text-muted)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.1)';
                                        e.currentTarget.style.color = 'var(--primary)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.color = (post.reactions?.like > 0) ? 'var(--primary)' : 'var(--text-muted)';
                                    }}
                                >
                                    <Award size={16} /> {post.reactions?.like || 0} Likes
                                </div>
                                <div style={{ fontSize: '0.75rem', marginLeft: 'auto' }}>
                                    👁️ {post.views || 0} visualizações
                                </div>
                            </div>

                            {/* Comments Section */}
                            {expandedComments[post.id] && (
                                <div style={{
                                    padding: '24px',
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    borderTop: '1px solid var(--border)'
                                }}>
                                    {/* Comments List */}
                                    <div style={{ marginBottom: '16px' }}>
                                        {comments[post.id]?.length > 0 ? (
                                            comments[post.id].map((comment) => (
                                                <div key={comment.id} style={{
                                                    marginBottom: '12px',
                                                    padding: '12px',
                                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                                    borderRadius: '8px'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                        <div style={{
                                                            width: '24px',
                                                            height: '24px',
                                                            borderRadius: '50%',
                                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.7rem'
                                                        }}>
                                                            👤
                                                        </div>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Restaurador</span>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                            {formatTimeAgo(comment.createdAt)}
                                                        </span>
                                                    </div>
                                                    <TextRenderer
                                                        text={comment.body || comment.content}
                                                        style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
                                                Nenhum comentário ainda. Seja o primeiro!
                                            </p>
                                        )}
                                    </div>

                                    {/* New Comment Input */}
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <input
                                            type="text"
                                            value={newComment[post.id] || ''}
                                            onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleCreateComment(post.id);
                                                }
                                            }}
                                            placeholder="Escreve um comentário..."
                                            style={{
                                                flex: 1,
                                                padding: '10px 16px',
                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '20px',
                                                color: 'white',
                                                fontSize: '0.9rem'
                                            }}
                                        />
                                        <button
                                            onClick={() => handleCreateComment(post.id)}
                                            style={{
                                                padding: '10px 20px',
                                                backgroundColor: 'var(--primary)',
                                                border: 'none',
                                                borderRadius: '20px',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            Comentar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Eventos */}
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Eventos Próximos</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { date: '28 JAN', title: 'Webinar: IA na Gestão de Stocks', time: '15:00 WET' },
                                { date: '12 FEV', title: 'Networking Algarve: Restauradores 4.0', time: '11:00 WET' }
                            ].map(event => (
                                <div key={event.title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        padding: '8px',
                                        borderRadius: '6px',
                                        textAlign: 'center',
                                        minWidth: '60px'
                                    }}>
                                        <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{event.date.split(' ')[0]}</p>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{event.date.split(' ')[1]}</p>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.85rem', fontWeight: '600' }}>{event.title}</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{event.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tendências */}
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '16px' }}>Tendências</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {['#DigitalGastro', '#EcoEfficiency', '#StaffRetention', '#MarketAI'].map(tag => (
                                <span key={tag} style={{
                                    fontSize: '0.75rem',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer'
                                }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* New Post Modal (Simple version - can be enhanced later) */}
            {showNewPostModal && (
                <NewPostModal
                    onClose={() => setShowNewPostModal(false)}
                    onSubmit={handleCreatePost}
                />
            )}
        </motion.div>
    );
};

// Simple New Post Modal Component
const NewPostModal = ({ onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [category, setCategory] = useState('dica');
    const [groupId, setGroupId] = useState('');
    const [tags, setTags] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [groups, setGroups] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        // Load groups for dropdown
        CommunityAPI.getGroups({ limit: 20 }).then(data => {
            setGroups(data.data || []);
        });
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Por favor seleciona apenas imagens');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('A imagem deve ter no máximo 5MB');
                return;
            }
            setSelectedImage(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) {
            alert('Título e conteúdo são obrigatórios');
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit({
                title: title.trim(),
                body: body.trim(),
                category,
                groupId: groupId || undefined,
                tags: tags.split(',').map(t => t.trim()).filter(Boolean),
                image: selectedImage
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            overflowY: 'auto',
            padding: '20px 0'
        }} onClick={onClose}>
            <div className="glass-panel" style={{ padding: '32px', maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Criar Novo Post</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Título *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                            placeholder="Ex: Como aumentei vendas em 20%"
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Categoria *</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                        >
                            <option value="dica">Dica</option>
                            <option value="duvida">Dúvida</option>
                            <option value="showcase">Showcase</option>
                            <option value="evento">Evento</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Grupo (opcional)</label>
                        <select
                            value={groupId}
                            onChange={(e) => setGroupId(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                        >
                            <option value="">Sem grupo (geral)</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Conteúdo *</label>
                        <MentionInput
                            value={body}
                            onChange={setBody}
                            placeholder="Partilha a tua experiência... (usa @username para mencionar)"
                            minHeight="150px"
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Tags (separadas por vírgula)</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                            placeholder="Ex: marketing, vendas, turismo"
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Imagem (opcional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        />
                        {imagePreview && (
                            <div style={{ marginTop: '12px', position: 'relative' }}>
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    style={{
                                        width: '100%',
                                        maxHeight: '300px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border)'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        padding: '8px',
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    Remover
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: 'var(--primary)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                opacity: submitting ? 0.6 : 1
                            }}
                        >
                            {submitting ? 'A publicar...' : 'Publicar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommunityView;
