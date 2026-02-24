import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, MapPin, Users, FileText, Clock, MessageSquare, Eye, Heart } from 'lucide-react';
import { CommunityAPI } from '../services/api';

interface SearchPost {
    id: string;
    title: string;
    body: string;
    category: string;
    views?: number;
    createdAt: string;
    group?: { id: string; name: string };
    _count?: { reactions: number; comments: number };
}

interface SearchGroup {
    id: string;
    name: string;
    description?: string;
    category: string;
    _count?: { memberships: number; posts: number };
}

interface SearchViewProps {
    initialQuery?: string;
    onNavigateToGroup?: (groupId: string) => void;
    onNavigateToPost?: (postId: string) => void;
}

const SearchView = ({ initialQuery = '', onNavigateToGroup, onNavigateToPost: _onNavigateToPost }: SearchViewProps) => {
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [searchInput, setSearchInput] = useState(initialQuery);
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'posts', 'groups'
    const [showFilters, setShowFilters] = useState(false);

    // Results
    const [posts, setPosts] = useState<SearchPost[]>([]);
    const [groups, setGroups] = useState<SearchGroup[]>([]);
    const [loading, setLoading] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        category: '',
        region: '',
        type: '',
        sortBy: 'recent'
    });

    // Debounce search input
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchInput]);

    // Load results when query or filters change
    useEffect(() => {
        if (searchQuery || filters.category || filters.region) {
            loadResults();
        } else {
            setPosts([]);
            setGroups([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, filters, activeTab]);

    const loadResults = async () => {
        try {
            setLoading(true);

            if (activeTab === 'all' || activeTab === 'posts') {
                const postsData = await CommunityAPI.getPosts({
                    search: searchQuery,
                    category: filters.category,
                    sortBy: filters.sortBy,
                    limit: 20
                });
                setPosts(((postsData as { data: SearchPost[] }).data || []) as SearchPost[]);
            }

            if (activeTab === 'all' || activeTab === 'groups') {
                const groupsData = await CommunityAPI.getGroups({
                    search: searchQuery,
                    category: filters.region,
                    type: filters.type,
                    sortBy: filters.sortBy === 'recent' ? 'recent' : 'members',
                    limit: 20
                });
                setGroups(((groupsData as { data: SearchGroup[] }).data || []) as SearchGroup[]);
            }
        } catch (err: unknown) {
            console.error('Error loading search results:', err);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            region: '',
            type: '',
            sortBy: 'recent'
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getCategoryIcon = (category: string) => {
        if (category === 'region') return <MapPin size={16} />;
        return <Users size={16} />;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
            {/* Search Header */}
            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid var(--border)'
                    }}>
                        <Search size={20} color="var(--text-muted)" />
                        <input
                            type="text"
                            placeholder="Pesquisar posts, grupos..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            autoFocus
                        />
                        {searchInput && (
                            <button
                                onClick={() => {
                                    setSearchInput('');
                                    setSearchQuery('');
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '4px'
                                }}
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            padding: '12px 16px',
                            backgroundColor: showFilters ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <SlidersHorizontal size={20} />
                        Filtros
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    {['all', 'posts', 'groups'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: activeTab === tab ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: activeTab === tab ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: activeTab === tab ? '600' : '400'
                            }}
                        >
                            {tab === 'all' ? 'Tudo' : tab === 'posts' ? 'Posts' : 'Grupos'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel"
                    style={{ padding: '20px', marginBottom: '24px' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Filtros Avancados</h3>
                        <button
                            onClick={clearFilters}
                            style={{
                                fontSize: '0.85rem',
                                color: 'var(--primary)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Limpar tudo
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        {/* Category */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Categoria
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <option value="">Todas</option>
                                <option value="Gestao">Gestao</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Operacoes">Operacoes</option>
                                <option value="Financeiro">Financeiro</option>
                            </select>
                        </div>

                        {/* Region */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Regiao
                            </label>
                            <select
                                value={filters.region}
                                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <option value="">Todas</option>
                                <option value="region">Regioes</option>
                                <option value="theme">Temas</option>
                            </select>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Ordenar por
                            </label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <option value="recent">Mais Recentes</option>
                                <option value="popular">Mais Populares</option>
                                <option value="commented">Mais Comentados</option>
                            </select>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Loading State */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    A pesquisar...
                </div>
            )}

            {/* No Results */}
            {!loading && searchQuery && posts.length === 0 && groups.length === 0 && (
                <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <Search size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Nenhum resultado encontrado</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Tenta ajustar os filtros ou usar outras palavras-chave
                    </p>
                </div>
            )}

            {/* Groups Results */}
            {!loading && (activeTab === 'all' || activeTab === 'groups') && groups.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={20} />
                        Grupos ({groups.length})
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                        {groups.map(group => (
                            <div
                                key={group.id}
                                className="glass-panel hover:scale-105"
                                style={{ padding: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
                                onClick={() => onNavigateToGroup && onNavigateToGroup(group.id)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    {getCategoryIcon(group.category)}
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', flex: 1 }}>{group.name}</h3>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px', lineHeight: '1.4' }}>
                                    {group.description?.slice(0, 100)}{(group.description?.length ?? 0) > 100 && '...'}
                                </p>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span>{group._count?.memberships || 0} membros</span>
                                    <span>•</span>
                                    <span>{group._count?.posts || 0} posts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Posts Results */}
            {!loading && (activeTab === 'all' || activeTab === 'posts') && posts.length > 0 && (
                <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={20} />
                        Posts ({posts.length})
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {posts.map(post => (
                            <div
                                key={post.id}
                                className="glass-panel hover:scale-[1.01]"
                                style={{ padding: '20px', cursor: 'pointer', transition: 'all 0.2s' }}
                                onClick={() => post.group && onNavigateToGroup && onNavigateToGroup(post.group.id)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', flex: 1 }}>{post.title}</h3>
                                    <span style={{
                                        padding: '4px 8px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)'
                                    }}>
                                        {post.category}
                                    </span>
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '12px', lineHeight: '1.5' }}>
                                    {post.body.slice(0, 200)}{post.body.length > 200 && '...'}
                                </p>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', alignItems: 'center' }}>
                                    {post.group && <span><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />{post.group.name}</span>}
                                    <span>•</span>
                                    <span><Heart size={12} style={{ display: 'inline', marginRight: '4px' }} />{post._count?.reactions || 0}</span>
                                    <span><MessageSquare size={12} style={{ display: 'inline', marginRight: '4px' }} />{post._count?.comments || 0}</span>
                                    <span><Eye size={12} style={{ display: 'inline', marginRight: '4px' }} />{post.views || 0}</span>
                                    <span>•</span>
                                    <span><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />{formatDate(post.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && !searchQuery && posts.length === 0 && groups.length === 0 && (
                <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <Search size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Comeca a pesquisar</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Pesquisa posts, grupos, ou usa os filtros para encontrar o que procuras
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default SearchView;
