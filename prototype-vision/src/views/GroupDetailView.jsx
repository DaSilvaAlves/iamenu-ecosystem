import { useState, useEffect } from 'react';
import {
    ArrowLeft, Users, MapPin, Crown, Shield, UserPlus, UserMinus,
    Heart, MessageCircle, Eye, Send, X, Plus
} from 'lucide-react';
import CommunityAPI from '../services/api';

const GroupDetailView = ({ groupId, onBack }) => {
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMember, setIsMember] = useState(false);
    const [userRole, setUserRole] = useState(null);

    // Posts management
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [expandedComments, setExpandedComments] = useState({});
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState({});
    const [showNewPostModal, setShowNewPostModal] = useState(false);

    // New post form
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostBody, setNewPostBody] = useState('');
    const [newPostCategory, setNewPostCategory] = useState('discussion');
    const [submittingPost, setSubmittingPost] = useState(false);

    const currentUserId = 'test-user-001';

    useEffect(() => {
        if (groupId) {
            fetchGroupDetails();
            fetchMembers();
            checkMembership();
        }
    }, [groupId]);

    const fetchGroupDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/v1/community/groups/${groupId}`);
            const data = await response.json();
            if (data.success) {
                setGroup(data.data);
            }
        } catch (error) {
            console.error('Erro ao carregar grupo:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/v1/community/groups/${groupId}/members`);
            const data = await response.json();
            if (data.success) {
                setMembers(data.data);

                // Check if current user is member and get role
                const currentUserMembership = data.data.find(m => m.userId === currentUserId);
                if (currentUserMembership) {
                    setIsMember(true);
                    setUserRole(currentUserMembership.role);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar membros:', error);
        }
    };

    const checkMembership = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/v1/community/groups/user/${currentUserId}`);
            const data = await response.json();
            if (data.success) {
                const membership = data.data.find(g => g.id === groupId);
                setIsMember(!!membership);
                if (membership) {
                    setUserRole(membership.userRole);
                }
            }
        } catch (error) {
            console.error('Erro ao verificar membership:', error);
        }
    };

    const fetchPosts = async () => {
        if (!groupId) return;

        try {
            setPostsLoading(true);
            const data = await CommunityAPI.getPosts({
                groupId: groupId,
                limit: 50
            });
            setPosts(data.data || []);
        } catch (err) {
            console.error('Error loading posts:', err);
        } finally {
            setPostsLoading(false);
        }
    };

    // Load posts when groupId changes
    useEffect(() => {
        if (groupId) {
            fetchPosts();
        }
    }, [groupId]);

    const joinGroup = async () => {
        try {
            const token = localStorage.getItem('authToken') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMDAxIiwiZW1haWwiOiJldXJpY29AaWFtZW51LnB0Iiwicm9sZSI6InJlc3RhdXJhZG9yIiwiaWF0IjoxNzY2NjM2MzU1LCJleHAiOjE3NjY3MjI3NTV9.7PG9LRK7y8UkhU1zpc7vHe1Zsf748NMp0cLFS2-vFLU';

            const response = await fetch(`http://localhost:3001/api/v1/community/groups/${groupId}/join`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                alert('Juntaste-te ao grupo!');
                fetchMembers();
                checkMembership();
            } else {
                alert(data.error || 'Erro ao juntar-se ao grupo');
            }
        } catch (error) {
            console.error('Erro ao juntar-se ao grupo:', error);
            alert('Erro ao juntar-se ao grupo');
        }
    };

    const leaveGroup = async () => {
        if (!confirm('Tens a certeza que queres sair deste grupo?')) return;

        try {
            const token = localStorage.getItem('authToken') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItMDAxIiwiZW1haWwiOiJldXJpY29AaWFtZW51LnB0Iiwicm9sZSI6InJlc3RhdXJhZG9yIiwiaWF0IjoxNzY2NjM2MzU1LCJleHAiOjE3NjY3MjI3NTV9.7PG9LRK7y8UkhU1zpc7vHe1Zsf748NMp0cLFS2-vFLU';

            const response = await fetch(`http://localhost:3001/api/v1/community/groups/${groupId}/leave`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                alert('Saíste do grupo');
                if (onBack) onBack();
            } else {
                alert(data.error || 'Erro ao sair do grupo');
            }
        } catch (error) {
            console.error('Erro ao sair do grupo:', error);
            alert('Erro ao sair do grupo');
        }
    };

    // Posts handlers
    const toggleComments = async (postId) => {
        if (expandedComments[postId]) {
            setExpandedComments(prev => ({ ...prev, [postId]: false }));
        } else {
            setExpandedComments(prev => ({ ...prev, [postId]: true }));

            if (!comments[postId]) {
                try {
                    const data = await CommunityAPI.getComments(postId);
                    setComments(prev => ({ ...prev, [postId]: data.data || [] }));
                } catch (err) {
                    console.error('Error loading comments:', err);
                }
            }
        }
    };

    const handleCreateComment = async (postId) => {
        const content = newComment[postId];
        if (!content?.trim()) return;

        try {
            await CommunityAPI.createComment(postId, { content: content.trim() });

            // Refresh comments
            const data = await CommunityAPI.getComments(postId);
            setComments(prev => ({ ...prev, [postId]: data.data || [] }));
            setNewComment(prev => ({ ...prev, [postId]: '' }));
        } catch (err) {
            console.error('Error creating comment:', err);
            alert('Erro ao criar comentário');
        }
    };

    const handleReaction = async (postId, reactionType) => {
        try {
            await CommunityAPI.toggleReaction(postId, reactionType);
            // Refresh posts to get updated counts
            fetchPosts();
        } catch (err) {
            console.error('Error toggling reaction:', err);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();

        if (!newPostTitle.trim() || !newPostBody.trim()) {
            alert('Título e conteúdo são obrigatórios');
            return;
        }

        setSubmittingPost(true);
        try {
            await CommunityAPI.createPost({
                title: newPostTitle.trim(),
                body: newPostBody.trim(),
                category: newPostCategory,
                groupId: groupId
            });

            // Reset form and close modal
            setNewPostTitle('');
            setNewPostBody('');
            setNewPostCategory('discussion');
            setShowNewPostModal(false);

            // Refresh posts and group details to update counters
            fetchPosts();
            fetchGroupDetails();

            alert('Post criado com sucesso!');
        } catch (err) {
            console.error('Error creating post:', err);
            alert('Erro ao criar post: ' + err.message);
        } finally {
            setSubmittingPost(false);
        }
    };

    const getCategoryIcon = (category) => {
        if (category === 'region') return '📍';
        if (category === 'theme') return '💡';
        return '🏘️';
    };

    const getRoleBadge = (role) => {
        if (role === 'owner') return { text: 'OWNER', color: '#FFD700' };
        if (role === 'admin') return { text: 'ADMIN', color: '#FF6B6B' };
        return { text: 'MEMBRO', color: '#00ff00' };
    };

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>
                    A carregar grupo...
                </div>
            </div>
        );
    }

    if (!group) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>
                    Grupo não encontrado
                </div>
                {onBack && (
                    <button
                        onClick={onBack}
                        style={{
                            marginTop: '20px',
                            padding: '12px 24px',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        ← Voltar aos Grupos
                    </button>
                )}
            </div>
        );
    }

    return (
        <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    style={{
                        marginBottom: '24px',
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-primary)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                    }}
                >
                    ← Voltar aos Grupos
                </button>
            )}

            {/* Cover Image */}
            <div
                className="glass-panel"
                style={{
                    height: '200px',
                    borderRadius: '20px',
                    marginBottom: '24px',
                    background: group.coverImage
                        ? `url(${group.coverImage}) center/cover`
                        : 'linear-gradient(135deg, rgba(0,122,255,0.3) 0%, rgba(0,122,255,0.05) 100%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '24px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '4rem' }}>{getCategoryIcon(group.category)}</div>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
                            {group.name}
                        </h1>
                        <span style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            fontWeight: '600',
                        }}>
                            {group.category === 'region' ? 'REGIÃO' : 'TEMA'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Info & Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
                {/* Description */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '12px' }}>
                        Sobre a Comunidade
                    </h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        {group.description || 'Sem descrição'}
                    </p>
                </div>

                {/* Stats & Actions */}
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                {members.length}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Membros
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                {group._count?.posts || 0}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Posts
                            </div>
                        </div>
                    </div>

                    {/* Member Badge */}
                    {isMember && userRole && (
                        <div style={{
                            padding: '12px',
                            borderRadius: '12px',
                            background: `rgba(${userRole === 'owner' ? '255,215,0' : userRole === 'admin' ? '255,107,107' : '0,255,0'},0.1)`,
                            border: `1px solid rgba(${userRole === 'owner' ? '255,215,0' : userRole === 'admin' ? '255,107,107' : '0,255,0'},0.3)`,
                            textAlign: 'center',
                            marginBottom: '16px',
                        }}>
                            <div style={{
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                color: getRoleBadge(userRole).color,
                            }}>
                                {getRoleBadge(userRole).text}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    {!isMember ? (
                        <button
                            onClick={joinGroup}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '1rem',
                            }}
                        >
                            Juntar-me ao Grupo
                        </button>
                    ) : userRole !== 'owner' && (
                        <button
                            onClick={leaveGroup}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: 'rgba(255,0,0,0.1)',
                                color: '#ff4444',
                                border: '1px solid rgba(255,0,0,0.3)',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '1rem',
                            }}
                        >
                            Sair do Grupo
                        </button>
                    )}
                </div>
            </div>

            {/* Posts Feed Section */}
            {group && (
                <div className="glass-panel" style={{
                    padding: '32px',
                    borderRadius: '20px',
                    marginBottom: '32px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            Posts do Grupo ({group._count?.posts || 0})
                        </h2>
                        {isMember && (
                            <button
                                onClick={() => setShowNewPostModal(true)}
                                className="glass-panel"
                                style={{
                                    padding: '12px 24px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <Plus size={18} /> Novo Post
                            </button>
                        )}
                    </div>

                    {/* Posts List */}
                    {postsLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            A carregar posts...
                        </div>
                    ) : posts.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: 'var(--text-muted)'
                        }}>
                            <MessageCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
                                Ainda não há posts neste grupo
                            </p>
                            {isMember && (
                                <p style={{ fontSize: '0.9rem' }}>
                                    Sê o primeiro a partilhar algo!
                                </p>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {posts.map(post => (
                                <div key={post.id} style={{
                                    padding: '24px',
                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '16px'
                                }}>
                                    {/* Post Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: 'var(--primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                            {post.authorId?.substring(0, 2).toUpperCase() || 'U'}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                                                {post.authorId}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {new Date(post.createdAt).toLocaleDateString('pt-PT')}
                                            </div>
                                        </div>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            color: 'var(--text-muted)'
                                        }}>
                                            {post.category}
                                        </span>
                                    </div>

                                    {/* Post Content */}
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px' }}>
                                        {post.title}
                                    </h3>
                                    <p style={{
                                        color: 'var(--text-muted)',
                                        lineHeight: '1.6',
                                        whiteSpace: 'pre-line',
                                        marginBottom: '16px'
                                    }}>
                                        {post.body}
                                    </p>

                                    {/* Post Image */}
                                    {post.imageUrl && (
                                        <img
                                            src={`http://localhost:3001${post.imageUrl}`}
                                            alt={post.title}
                                            style={{
                                                width: '100%',
                                                maxHeight: '400px',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                                marginBottom: '16px'
                                            }}
                                        />
                                    )}

                                    {/* Tags */}
                                    {post.tags && JSON.parse(post.tags).length > 0 && (
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                            {JSON.parse(post.tags).map((tag, idx) => (
                                                <span key={idx} style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                                    color: 'var(--primary)'
                                                }}>
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Post Footer - Reactions & Comments */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '24px',
                                        paddingTop: '16px',
                                        borderTop: '1px solid rgba(255,255,255,0.1)',
                                        alignItems: 'center'
                                    }}>
                                        <button
                                            onClick={() => handleReaction(post.id, 'like')}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            <Heart size={18} /> {post._count?.reactions || 0}
                                        </button>

                                        <button
                                            onClick={() => toggleComments(post.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            <MessageCircle size={18} /> {post._count?.comments || 0}
                                        </button>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            color: 'var(--text-muted)',
                                            fontSize: '0.9rem'
                                        }}>
                                            <Eye size={18} /> {post.views || 0}
                                        </div>
                                    </div>

                                    {/* Comments Section */}
                                    {expandedComments[post.id] && (
                                        <div style={{
                                            marginTop: '20px',
                                            paddingTop: '20px',
                                            borderTop: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            {/* New Comment Input */}
                                            {isMember && (
                                                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                                    <input
                                                        type="text"
                                                        value={newComment[post.id] || ''}
                                                        onChange={(e) => setNewComment(prev => ({
                                                            ...prev,
                                                            [post.id]: e.target.value
                                                        }))}
                                                        placeholder="Escreve um comentário..."
                                                        style={{
                                                            flex: 1,
                                                            padding: '12px',
                                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                                            border: '1px solid var(--border)',
                                                            borderRadius: '8px',
                                                            color: 'white'
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleCreateComment(post.id);
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => handleCreateComment(post.id)}
                                                        style={{
                                                            padding: '12px 20px',
                                                            backgroundColor: 'var(--primary)',
                                                            border: 'none',
                                                            borderRadius: '8px',
                                                            color: 'white',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <Send size={18} />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Comments List */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {comments[post.id]?.map(comment => (
                                                    <div key={comment.id} style={{
                                                        padding: '12px',
                                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                                        borderRadius: '8px'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            marginBottom: '8px'
                                                        }}>
                                                            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                                                                {comment.authorId}
                                                            </span>
                                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                {new Date(comment.createdAt).toLocaleDateString('pt-PT')}
                                                            </span>
                                                        </div>
                                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                ))}
                                                {(!comments[post.id] || comments[post.id].length === 0) && (
                                                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                        Ainda sem comentários
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Members */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px' }}>
                    Membros ({members.length})
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
                    {members.map(member => {
                        const badge = getRoleBadge(member.role);
                        return (
                            <div
                                key={member.userId}
                                style={{
                                    padding: '12px 16px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'var(--primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                    }}>
                                        {member.userId.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                                            {member.userId}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            Entrou {new Date(member.joinedAt).toLocaleDateString('pt-PT')}
                                        </div>
                                    </div>
                                </div>
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    background: `rgba(${member.role === 'owner' ? '255,215,0' : member.role === 'admin' ? '255,107,107' : '0,255,0'},0.1)`,
                                    color: badge.color,
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                }}>
                                    {badge.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* New Post Modal */}
            {showNewPostModal && (
                <div
                    style={{
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
                        padding: '20px'
                    }}
                    onClick={() => setShowNewPostModal(false)}
                >
                    <div
                        className="glass-panel"
                        style={{
                            padding: '32px',
                            maxWidth: '600px',
                            width: '100%',
                            borderRadius: '20px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Novo Post</h2>
                            <button
                                onClick={() => setShowNewPostModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePost}>
                            {/* Title */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    value={newPostTitle}
                                    onChange={(e) => setNewPostTitle(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}
                                    placeholder="Título do post..."
                                    disabled={submittingPost}
                                />
                            </div>

                            {/* Category */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    Categoria
                                </label>
                                <select
                                    value={newPostCategory}
                                    onChange={(e) => setNewPostCategory(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}
                                    disabled={submittingPost}
                                >
                                    <option value="discussion">💬 Discussão</option>
                                    <option value="tip">💡 Dica</option>
                                    <option value="question">❓ Dúvida</option>
                                    <option value="showcase">🎨 Showcase</option>
                                    <option value="event">📅 Evento</option>
                                </select>
                            </div>

                            {/* Body */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    Conteúdo *
                                </label>
                                <textarea
                                    value={newPostBody}
                                    onChange={(e) => setNewPostBody(e.target.value)}
                                    rows={6}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        resize: 'vertical'
                                    }}
                                    placeholder="Escreve o teu post..."
                                    disabled={submittingPost}
                                />
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowNewPostModal(false)}
                                    disabled={submittingPost}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        cursor: submittingPost ? 'not-allowed' : 'pointer',
                                        opacity: submittingPost ? 0.6 : 1
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingPost}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: 'var(--primary)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: submittingPost ? 'not-allowed' : 'pointer',
                                        opacity: submittingPost ? 0.6 : 1
                                    }}
                                >
                                    {submittingPost ? 'A publicar...' : 'Publicar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupDetailView;
