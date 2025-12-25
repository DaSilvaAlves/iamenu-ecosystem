import { useState, useEffect } from 'react';

const GroupDetailView = ({ groupId, onBack }) => {
    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMember, setIsMember] = useState(false);
    const [userRole, setUserRole] = useState(null);
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
        </div>
    );
};

export default GroupDetailView;
