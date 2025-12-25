import { useState, useEffect } from 'react';

const GroupsView = ({ onViewGroup }) => {
    const [groups, setGroups] = useState([]);
    const [userGroups, setUserGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('all'); // 'all', 'region', 'theme'
    const [showCreateModal, setShowCreateModal] = useState(false);
    const currentUserId = 'test-user-001';

    useEffect(() => {
        fetchGroups();
        fetchUserGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/v1/community/groups');
            const data = await response.json();
            if (data.success) {
                setGroups(data.data);
            }
        } catch (error) {
            console.error('Erro ao carregar grupos:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserGroups = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/v1/community/groups/user/${currentUserId}`);
            const data = await response.json();
            if (data.success) {
                setUserGroups(data.data.map(g => g.id));
            }
        } catch (error) {
            console.error('Erro ao carregar grupos do utilizador:', error);
        }
    };

    const joinGroup = async (groupId) => {
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
                fetchUserGroups();
                fetchGroups();
            } else {
                alert(data.error || 'Erro ao juntar-se ao grupo');
            }
        } catch (error) {
            console.error('Erro ao juntar-se ao grupo:', error);
            alert('Erro ao juntar-se ao grupo');
        }
    };

    const leaveGroup = async (groupId) => {
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
                fetchUserGroups();
                fetchGroups();
            } else {
                alert(data.error || 'Erro ao sair do grupo');
            }
        } catch (error) {
            console.error('Erro ao sair do grupo:', error);
            alert('Erro ao sair do grupo');
        }
    };

    const filteredGroups = groups.filter(group => {
        if (filterCategory === 'all') return true;
        return group.category === filterCategory;
    });

    const getCategoryIcon = (category) => {
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
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.borderColor = 'var(--primary)';
                            }}
                            onMouseLeave={(e) => {
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

            {/* Create Group Modal (placeholder) */}
            {showCreateModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                    onClick={() => setShowCreateModal(false)}
                >
                    <div
                        className="glass-panel"
                        style={{
                            padding: '32px',
                            borderRadius: '20px',
                            maxWidth: '500px',
                            width: '90%',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ marginBottom: '16px' }}>Criar Nova Comunidade</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                            Modal de criação em desenvolvimento...
                        </p>
                        <button
                            onClick={() => setShowCreateModal(false)}
                            style={{
                                padding: '12px 24px',
                                background: 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                            }}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupsView;
