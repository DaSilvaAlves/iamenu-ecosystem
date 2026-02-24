import { useState, useEffect } from 'react';
import CommunityAPI, { Auth } from '../services/api';
import { API_CONFIG } from '../config/api';
import { mockData } from '../services/mockData';

// Type definitions
interface Group {
    id: string;
    name: string;
    description?: string;
    category: 'region' | 'theme' | string;
    type: 'public' | 'private';
    createdBy?: string;
    _count?: {
        memberships?: number;
        posts?: number;
    };
}

interface GroupsViewProps {
    onViewGroup?: (groupId: string) => void;
}

// GroupData shape (mirrors api.ts definition for type compatibility)
interface GroupData {
    name: string;
    description?: string;
    category: string;
    type: string;
    coverImage?: File;
    [key: string]: unknown;
}

const GroupsView = ({ onViewGroup }: GroupsViewProps) => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [userGroups, setUserGroups] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<'all' | 'region' | 'theme'>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [groupCategory, setGroupCategory] = useState('region');
    const [groupType, setGroupType] = useState('public');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const currentUserId = Auth.getUserId() || 'demo-user';

    useEffect(() => {
        fetchGroups();
        fetchUserGroups();
    }, []);

    const fetchGroups = async (): Promise<void> => {
        try {
            const data = await CommunityAPI.getGroups() as { data: Group[] };
            setGroups(data.data || []);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.warn('API unavailable, using mock groups:', message);
            // Fallback to mock data
            setGroups((mockData.groups as unknown as Group[]) || []);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserGroups = async (): Promise<void> => {
        try {
            if (!currentUserId || currentUserId === 'demo-user') {
                setUserGroups([]);
                return;
            }
            const data = await CommunityAPI.getUserGroups(currentUserId) as { data: Group[] };
            setUserGroups((data.data || []).map(g => g.id));
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            console.warn('Could not fetch user groups:', message);
            setUserGroups([]);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Por favor seleciona apenas imagens');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('A imagem deve ter no máximo 5MB');
                return;
            }
            setSelectedImage(file);
            setError('');

            // Create preview
            const reader = new FileReader();
            reader.onloadend = (): void => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (): void => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');

        // Validation
        if (!groupName.trim()) {
            setError('O nome do grupo é obrigatório');
            return;
        }

        setSubmitting(true);
        try {
            const groupData: GroupData = {
                name: groupName.trim(),
                description: groupDescription.trim() || undefined,
                category: groupCategory,
                type: groupType,
                coverImage: selectedImage || undefined
            };

            const result = await CommunityAPI.createGroup(groupData) as { success: boolean };

            if (result.success) {
                // Reset form
                setGroupName('');
                setGroupDescription('');
                setGroupCategory('region');
                setGroupType('public');
                setSelectedImage(null);
                setImagePreview(null);
                setShowCreateModal(false);

                // Success feedback
                alert('Grupo criado com sucesso!');

                // Refresh lists
                await fetchGroups();
                await fetchUserGroups();
            }
        } catch (error: unknown) {
            console.error('Erro ao criar grupo:', error);

            // Handle specific errors
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
                setError('Já existe um grupo com este nome. Escolhe outro nome.');
            } else if (errorMessage.includes('Authentication') || errorMessage.includes('401')) {
                setError('Precisas de estar autenticado para criar um grupo.');
            } else {
                setError(errorMessage || 'Erro ao criar grupo. Tenta novamente.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseModal = (): void => {
        if (submitting) return;
        setShowCreateModal(false);
        setGroupName('');
        setGroupDescription('');
        setGroupCategory('region');
        setGroupType('public');
        setSelectedImage(null);
        setImagePreview(null);
        setError('');
    };

    const joinGroup = async (groupId: string): Promise<void> => {
        try {
            const token = localStorage.getItem('auth_token');

            const response = await fetch(`${API_CONFIG.COMMUNITY_BASE}/api/v1/community/groups/${groupId}/join`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json() as { success: boolean; error?: string };

            if (data.success) {
                alert('Juntaste-te ao grupo!');
                await fetchUserGroups();
                await fetchGroups();
            } else {
                alert(data.error || 'Erro ao juntar-se ao grupo');
            }
        } catch (error: unknown) {
            console.error('Erro ao juntar-se ao grupo:', error);
            alert('Erro ao juntar-se ao grupo');
        }
    };

    const leaveGroup = async (groupId: string): Promise<void> => {
        if (!confirm('Tens a certeza que queres sair deste grupo?')) return;

        try {
            const token = localStorage.getItem('auth_token');

            const response = await fetch(`${API_CONFIG.COMMUNITY_BASE}/api/v1/community/groups/${groupId}/leave`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json() as { success: boolean; error?: string };

            if (data.success) {
                alert('Saíste do grupo');
                await fetchUserGroups();
                await fetchGroups();
            } else {
                alert(data.error || 'Erro ao sair do grupo');
            }
        } catch (error: unknown) {
            console.error('Erro ao sair do grupo:', error);
            alert('Erro ao sair do grupo');
        }
    };

    const filteredGroups = groups.filter((group): boolean => {
        if (filterCategory === 'all') return true;
        return group.category === filterCategory;
    });

    const getCategoryIcon = (category: string): string => {
        if (category === 'region') return '📍';
        if (category === 'theme') return '💡';
        return '🏘️';
    };

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>
                    A carregar grupos...
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>
                        Comunidades
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                        {groups.length} comunidades disponíveis • {userGroups.length} grupos que pertences
                    </p>
                </div>
                <button
                    className="glass-panel"
                    onClick={() => setShowCreateModal(true)}
                    style={{
                        padding: '12px 24px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '1rem',
                    }}
                >
                    + Criar Comunidade
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                <button
                    className="glass-panel"
                    onClick={() => setFilterCategory('all')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '20px',
                        border: filterCategory === 'all' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                        background: filterCategory === 'all' ? 'rgba(0,122,255,0.1)' : 'transparent',
                        color: filterCategory === 'all' ? 'var(--primary)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: '600',
                    }}
                >
                    🌍 Todas ({groups.length})
                </button>
                <button
                    className="glass-panel"
                    onClick={() => setFilterCategory('region')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '20px',
                        border: filterCategory === 'region' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                        background: filterCategory === 'region' ? 'rgba(0,122,255,0.1)' : 'transparent',
                        color: filterCategory === 'region' ? 'var(--primary)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: '600',
                    }}
                >
                    📍 Regiões ({groups.filter(g => g.category === 'region').length})
                </button>
                <button
                    className="glass-panel"
                    onClick={() => setFilterCategory('theme')}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '20px',
                        border: filterCategory === 'theme' ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
                        background: filterCategory === 'theme' ? 'rgba(0,122,255,0.1)' : 'transparent',
                        color: filterCategory === 'theme' ? 'var(--primary)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: '600',
                    }}
                >
                    💡 Temas ({groups.filter(g => g.category === 'theme').length})
                </button>
            </div>

            {/* Groups Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                {filteredGroups.map(group => {
                    const isMember = userGroups.includes(group.id);
                    const isOwner = group.createdBy === currentUserId;

                    return (
                        <div
                            key={group.id}
                            className="glass-panel"
                            style={{
                                padding: '24px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e: React.MouseEvent<HTMLDivElement>): void => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = 'var(--primary)';
                            }}
                            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>): void => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            }}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <span style={{ fontSize: '2rem' }}>{getCategoryIcon(group.category)}</span>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '4px' }}>
                                        {group.name}
                                    </h3>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)',
                                        textTransform: 'uppercase',
                                        fontWeight: '600',
                                    }}>
                                        {group.category === 'region' ? 'Região' : 'Tema'}
                                    </span>
                                </div>
                                {isMember && (
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        background: 'rgba(0,255,0,0.1)',
                                        color: '#00ff00',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                    }}>
                                        {isOwner ? 'OWNER' : 'MEMBRO'}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p style={{
                                color: 'var(--text-muted)',
                                fontSize: '0.9rem',
                                marginBottom: '16px',
                                minHeight: '60px',
                            }}>
                                {group.description || 'Sem descrição'}
                            </p>

                            {/* Stats */}
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        {group._count?.memberships || 0}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Membros
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                        {group._count?.posts || 0}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Posts
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            {!isMember ? (
                                <button
                                    onClick={() => joinGroup(group.id)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    Juntar-me
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => onViewGroup && onViewGroup(group.id)}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            fontSize: '0.95rem',
                                        }}
                                    >
                                        Ver Grupo
                                    </button>
                                    {!isOwner && (
                                        <button
                                            onClick={() => leaveGroup(group.id)}
                                            style={{
                                                padding: '12px 20px',
                                                background: 'rgba(255,0,0,0.1)',
                                                color: '#ff4444',
                                                border: '1px solid rgba(255,0,0,0.2)',
                                                borderRadius: '12px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                fontSize: '0.95rem',
                                            }}
                                        >
                                            Sair
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {filteredGroups.length === 0 && (
                <div style={{
                    padding: '60px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                    <div style={{ fontSize: '1.2rem' }}>
                        Nenhum grupo encontrado nesta categoria
                    </div>
                </div>
            )}

            {/* Create Group Modal */}
            {showCreateModal && (
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
                        overflowY: 'auto',
                        padding: '20px 0'
                    }}
                    onClick={handleCloseModal}
                >
                    <div
                        className="glass-panel"
                        style={{
                            padding: '32px',
                            maxWidth: '600px',
                            width: '90%',
                            borderRadius: '20px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>
                            Criar Nova Comunidade
                        </h2>

                        {/* Error Alert */}
                        {error && (
                            <div style={{
                                padding: '12px 16px',
                                backgroundColor: 'rgba(255,0,0,0.1)',
                                border: '1px solid rgba(255,0,0,0.3)',
                                borderRadius: '8px',
                                color: '#ff4444',
                                marginBottom: '20px',
                                fontSize: '0.9rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleCreateGroup}>
                            {/* Name Field */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    Nome da Comunidade *
                                </label>
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="Ex: Restauradores de Lisboa"
                                    disabled={submitting}
                                />
                            </div>

                            {/* Description Field */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    Descrição
                                </label>
                                <textarea
                                    value={groupDescription}
                                    onChange={(e) => setGroupDescription(e.target.value)}
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        resize: 'vertical',
                                        fontSize: '1rem'
                                    }}
                                    placeholder="Descreve a comunidade..."
                                    disabled={submitting}
                                />
                            </div>

                            {/* Category Field */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    Categoria
                                </label>
                                <select
                                    value={groupCategory}
                                    onChange={(e) => setGroupCategory(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                    disabled={submitting}
                                >
                                    <option value="region">📍 Região</option>
                                    <option value="theme">💡 Tema</option>
                                    <option value="type">🏘️ Tipo</option>
                                </select>
                            </div>

                            {/* Type Field */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    Tipo de Grupo
                                </label>
                                <select
                                    value={groupType}
                                    onChange={(e) => setGroupType(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        fontSize: '1rem'
                                    }}
                                    disabled={submitting}
                                >
                                    <option value="public">Público (todos podem ver e juntar-se)</option>
                                    <option value="private">Privado (apenas por convite)</option>
                                </select>
                            </div>

                            {/* Cover Image Upload */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    Imagem de Capa (opcional)
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
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                    disabled={submitting}
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    Formatos aceitos: JPEG, PNG, GIF, WebP (máx. 5MB)
                                </p>

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div style={{ marginTop: '12px', position: 'relative' }}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                width: '100%',
                                                maxHeight: '200px',
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
                                                padding: '6px 12px',
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
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={submitting}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '8px',
                                        color: 'white',
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                        fontSize: '1rem',
                                        opacity: submitting ? 0.6 : 1
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
                                        fontSize: '1rem',
                                        opacity: submitting ? 0.6 : 1
                                    }}
                                >
                                    {submitting ? 'A criar...' : 'Criar Comunidade'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupsView;
