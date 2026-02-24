import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Users, MapPin, Crown, Shield, UserPlus, UserMinus,
    Heart, MessageCircle, Eye, Send, X, Plus, MoreVertical, Edit2, Trash2
} from 'lucide-react';
import CommunityAPI from '../services/api';
import { API_CONFIG } from '../config/api';
import TextRenderer from '../components/TextRenderer';
import MentionInput from '../components/MentionInput';

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
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Edit/Delete post
    const [openMenuPostId, setOpenMenuPostId] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editBody, setEditBody] = useState('');
    const [editCategory, setEditCategory] = useState('discussion');
    const [submittingEdit, setSubmittingEdit] = useState(false);

    const currentUserId = 'test-user-001';

    // Check if current user owns the post
    const isOwnPost = (post) => {
        return post.authorId === currentUserId;
    };

    useEffect(() => {
        if (groupId) {
            fetchGroupDetails();
            fetchMembers();
            checkMembership();
        }
    }, [groupId]);

    const fetchGroupDetails = async () => {
        try {
            const response = await fetch(`${API_CONFIG.COMMUNITY_BASE}/api/v1/community/groups/${groupId}`);
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
            const response = await fetch(`${API_CONFIG.COMMUNITY_BASE}/api/v1/community/groups/${groupId}/members`);
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
            const response = await fetch(`${API_CONFIG.COMMUNITY_BASE}/api/v1/community/groups/user/${currentUserId}`);
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

    // Close dropdown menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (openMenuPostId) {
                setOpenMenuPostId(null);
            }
        };

        if (openMenuPostId) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openMenuPostId]);

    const joinGroup = async () => {
        try {
            const token = localStorage.getItem('auth_token');

            const response = await fetch(`${API_CONFIG.COMMUNITY_BASE}/api/v1/community/groups/${groupId}/join`, {
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
            const token = localStorage.getItem('auth_token');

            const response = await fetch(`${API_CONFIG.COMMUNITY_BASE}/api/v1/community/groups/${groupId}/leave`, {
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

    const handleCommentReaction = async (postId, commentId, reactionType) => {
        try {
            await CommunityAPI.toggleCommentReaction(postId, commentId, reactionType);

            // Refresh comments for this post to get updated counts
            const data = await CommunityAPI.getComments(postId);
            setComments(prev => ({ ...prev, [postId]: data.data || [] }));
        } catch (err) {
            console.error('Error toggling comment reaction:', err);
            alert('Erro ao reagir ao comentário');
        }
    };

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
                groupId: groupId,
                image: selectedImage || undefined
            });

            // Reset form and close modal
            setNewPostTitle('');
            setNewPostBody('');
            setNewPostCategory('discussion');
            setSelectedImage(null);
            setImagePreview(null);
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

    const handleEditPost = (post) => {
        setEditingPost(post);
        setEditTitle(post.title);
        setEditBody(post.body);
        setEditCategory(post.category);
        setShowEditModal(true);
        setOpenMenuPostId(null); // Close dropdown
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();

        if (!editTitle.trim() || !editBody.trim()) {
            alert('Título e conteúdo são obrigatórios');
            return;
        }

        setSubmittingEdit(true);
        try {
            await CommunityAPI.updatePost(editingPost.id, {
                title: editTitle.trim(),
                body: editBody.trim(),
                category: editCategory
            });

            // Reset and close
            setShowEditModal(false);
            setEditingPost(null);
            setEditTitle('');
            setEditBody('');
            setEditCategory('discussion');

            // Refresh posts
            fetchPosts();

            alert('Post atualizado com sucesso!');
        } catch (err) {
            console.error('Error updating post:', err);
            alert('Erro ao atualizar post: ' + err.message);
        } finally {
            setSubmittingEdit(false);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!confirm('Tens a certeza que queres eliminar este post?')) {
            return;
        }

        try {
            await CommunityAPI.deletePost(postId);

            // Close dropdown
            setOpenMenuPostId(null);

            // Refresh posts and group details to update counter
            fetchPosts();
            fetchGroupDetails();

            alert('Post eliminado com sucesso!');
        } catch (err) {
            console.error('Error deleting post:', err);
            alert('Erro ao eliminar post: ' + err.message);
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
                        ? `url(${API_CONFIG.COMMUNITY_BASE}${group.coverImage}) center/cover`
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

                                        {/* Three dots menu (only for own posts) */}
                                        {isOwnPost(post) && (
                                            <div style={{ position: 'relative' }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuPostId(
                                                            openMenuPostId === post.id ? null : post.id
                                                        );
                                                    }}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: 'var(--text-muted)',
                                                        cursor: 'pointer',
                                                        padding: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {/* Dropdown menu */}
                                                {openMenuPostId === post.id && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        right: 0,
                                                        backgroundColor: 'rgba(30,30,30,0.98)',
                                                        border: '1px solid var(--border)',
                                                        borderRadius: '8px',
                                                        padding: '8px 0',
                                                        minWidth: '150px',
                                                        zIndex: 100,
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                                    }}>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditPost(post);
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                padding: '10px 16px',
                                                                background: 'none',
                                                                border: 'none',
                                                                color: 'white',
                                                                cursor: 'pointer',
                                                                textAlign: 'left',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                fontSize: '0.9rem'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                        >
                                                            <Edit2 size={16} /> Editar
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeletePost(post.id);
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                padding: '10px 16px',
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#ff4444',
                                                                cursor: 'pointer',
                                                                textAlign: 'left',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                fontSize: '0.9rem'
                                                            }}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,68,68,0.1)'}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                                        >
                                                            <Trash2 size={16} /> Eliminar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Post Content */}
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px' }}>
                                        {post.title}
                                    </h3>
                                    <TextRenderer
                                        text={post.body}
                                        style={{ color: 'var(--text-muted)', marginBottom: '16px' }}
                                    />

                                    {/* Post Image */}
                                    {post.imageUrl && (
                                        <img
                                            src={`${API_CONFIG.COMMUNITY_BASE}${post.imageUrl}`}
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
                                                        <TextRenderer
                                                            text={comment.body}
                                                            style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}
                                                        />

                                                        {/* Reaction buttons for comments */}
                                                        <div style={{
                                                            display: 'flex',
                                                            gap: '12px',
                                                            marginTop: '8px',
                                                            paddingTop: '8px',
                                                            borderTop: '1px solid rgba(255,255,255,0.05)'
                                                        }}>
                                                            <button onClick={() => handleCommentReaction(post.id, comment.id, 'like')} style={{
                                                                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                                                                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', padding: '4px 8px', borderRadius: '4px'
                                                            }} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                                                                👍 {comment.reactions?.like || 0}
                                                            </button>
                                                            <button onClick={() => handleCommentReaction(post.id, comment.id, 'useful')} style={{
                                                                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                                                                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', padding: '4px 8px', borderRadius: '4px'
                                                            }} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                                                                💡 {comment.reactions?.useful || 0}
                                                            </button>
                                                            <button onClick={() => handleCommentReaction(post.id, comment.id, 'thanks')} style={{
                                                                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                                                                display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', padding: '4px 8px', borderRadius: '4px'
                                                            }} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                                                                🙏 {comment.reactions?.thanks || 0}
                                                            </button>
                                                        </div>
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
                    onClick={() => {
                        setShowNewPostModal(false);
                        setNewPostTitle('');
                        setNewPostBody('');
                        setNewPostCategory('discussion');
                        setSelectedImage(null);
                        setImagePreview(null);
                    }}
                >
                    <div
                        className="glass-panel"
                        style={{
                            padding: '32px',
                            maxWidth: '600px',
                            width: '100%',
                            borderRadius: '20px',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Novo Post</h2>
                            <button
                                onClick={() => {
                                    setShowNewPostModal(false);
                                    setNewPostTitle('');
                                    setNewPostBody('');
                                    setNewPostCategory('discussion');
                                    setSelectedImage(null);
                                    setImagePreview(null);
                                }}
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
                                <MentionInput
                                    value={newPostBody}
                                    onChange={setNewPostBody}
                                    placeholder="Escreve o teu post... (usa @username para mencionar)"
                                    minHeight="150px"
                                />
                            </div>

                            {/* Image Upload */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    Imagem (opcional)
                                </label>
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
                                    disabled={submittingPost}
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    Formatos aceitos: JPEG, PNG, GIF, WebP (máx. 5MB)
                                </p>
                            </div>

                            {/* Image Preview */}
                            {imagePreview && (
                                <div style={{ marginBottom: '24px', position: 'relative' }}>
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
                                            padding: '8px 16px',
                                            backgroundColor: 'rgba(255,0,0,0.8)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Remover
                                    </button>
                                </div>
                            )}

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

            {/* Edit Post Modal */}
            {showEditModal && editingPost && (
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
                    onClick={() => {
                        setShowEditModal(false);
                        setEditingPost(null);
                        setEditTitle('');
                        setEditBody('');
                        setEditCategory('discussion');
                    }}
                >
                    <div
                        className="glass-panel"
                        style={{
                            padding: '32px',
                            maxWidth: '600px',
                            width: '100%',
                            borderRadius: '20px',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Editar Post</h2>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingPost(null);
                                    setEditTitle('');
                                    setEditBody('');
                                    setEditCategory('discussion');
                                }}
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

                        <form onSubmit={handleSaveEdit}>
                            {/* Title */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    Título *
                                </label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}
                                    placeholder="Título do post..."
                                    disabled={submittingEdit}
                                />
                            </div>

                            {/* Category */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    Categoria
                                </label>
                                <select
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'white'
                                    }}
                                    disabled={submittingEdit}
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
                                <MentionInput
                                    value={editBody}
                                    onChange={setEditBody}
                                    placeholder="Escreve o teu post... (usa @username para mencionar)"
                                    minHeight="150px"
                                />
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingPost(null);
                                    }}
                                    disabled={submittingEdit}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        cursor: submittingEdit ? 'not-allowed' : 'pointer',
                                        opacity: submittingEdit ? 0.6 : 1
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingEdit}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: 'var(--primary)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        cursor: submittingEdit ? 'not-allowed' : 'pointer',
                                        opacity: submittingEdit ? 0.6 : 1
                                    }}
                                >
                                    {submittingEdit ? 'A guardar...' : 'Guardar'}
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
