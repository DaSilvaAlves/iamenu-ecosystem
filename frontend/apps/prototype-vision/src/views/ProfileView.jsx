import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Calendar, Edit, Camera, X } from 'lucide-react';
import { CommunityAPI, Auth } from '../services/api';

const ProfileView = ({ userId }) => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    // Use test user ID if not provided (must match the JWT token userId)
    const currentUserId = userId || 'test-user-001';

    useEffect(() => {
        loadProfile();
    }, [currentUserId]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const [profileData, statsData, postsData] = await Promise.all([
                CommunityAPI.getProfile(currentUserId),
                CommunityAPI.getUserStats(currentUserId),
                CommunityAPI.getUserPosts(currentUserId, { limit: 10 })
            ]);

            setProfile(profileData.data);
            setStats(statsData.data);
            setPosts(postsData.data || []);

            // Check if it's own profile (in real app, compare with logged user)
            setIsOwnProfile(true); // For now, always true in test mode

            setError(null);
        } catch (err) {
            console.error('Error loading profile:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)' }}>A carregar perfil...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ color: '#ff6b6b' }}>Erro: {error}</div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}
        >
            {/* Cover Photo & Avatar */}
            <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', marginBottom: '24px' }}>
                {/* Cover Photo */}
                <div style={{
                    height: '240px',
                    background: profile?.coverPhoto
                        ? `url(http://localhost:3004${profile.coverPhoto}) center/cover`
                        : 'linear-gradient(135deg, var(--primary) 0%, #667eea 100%)',
                    position: 'relative'
                }}>
                    {isOwnProfile && (
                        <button
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                padding: '8px 16px',
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '8px',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer'
                            }}
                            onClick={() => setShowEditModal(true)}
                        >
                            <Edit size={16} /> Editar Perfil
                        </button>
                    )}
                </div>

                {/* Avatar & Basic Info */}
                <div style={{ padding: '0 32px 24px', marginTop: '-60px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
                        {/* Avatar */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: '4px solid var(--bg-primary)',
                            background: profile?.profilePhoto
                                ? `url(http://localhost:3004${profile.profilePhoto}) center/cover`
                                : 'var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            flexShrink: 0,
                            position: 'relative',
                            zIndex: 10
                        }}>
                            {!profile?.profilePhoto && '👤'}
                        </div>

                        {/* Name & Info */}
                        <div style={{ flex: 1, paddingTop: '40px' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '4px' }}>
                                {profile?.restaurantName || 'Restaurador'}
                            </h1>
                            {profile?.username && (
                                <div style={{ fontSize: '0.95rem', color: 'var(--primary)', marginBottom: '8px' }}>
                                    @{profile.username}
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                {profile?.restaurantType && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Briefcase size={16} />
                                        {profile.restaurantType}
                                    </div>
                                )}
                                {(profile?.locationCity || profile?.locationRegion) && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={16} />
                                        {profile.locationCity}{profile.locationCity && profile.locationRegion && ', '}{profile.locationRegion}
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Calendar size={16} />
                                    Membro desde {formatDate(profile?.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    {profile?.bio && (
                        <p style={{ marginTop: '24px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                            {profile.bio}
                        </p>
                    )}
                </div>
            </div>

            {/* Level & XP */}
            <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Nível {stats?.level || 1}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '12px' }}>
                            {stats?.totalXP || 0} XP
                        </span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {stats?.xpProgress || 0} / {stats?.xpNeeded || 100} XP para nível {(stats?.level || 1) + 1}
                    </span>
                </div>
                {/* XP Progress Bar */}
                <div style={{
                    height: '12px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '6px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        height: '100%',
                        width: `${Math.min(100, ((stats?.xpProgress || 0) / (stats?.xpNeeded || 100)) * 100)}%`,
                        background: 'linear-gradient(90deg, var(--primary) 0%, #f59e0b 100%)',
                        transition: 'width 0.5s ease'
                    }} />
                </div>
            </div>

            {/* Badges */}
            {stats?.unlockedBadges && stats.unlockedBadges.length > 0 && (
                <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>
                        Badges Desbloqueados ({stats.unlockedBadges.length})
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {stats.unlockedBadges.map(badge => (
                            <div
                                key={badge.id}
                                className="glass-panel"
                                style={{
                                    padding: '12px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    cursor: 'help'
                                }}
                                title={badge.description}
                            >
                                <span style={{ fontSize: '1.5rem' }}>{badge.icon}</span>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{badge.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        +{badge.xpReward} XP
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {stats?.postsCount || 0}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Posts</div>
                </div>
                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {stats?.commentsCount || 0}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comentários</div>
                </div>
                <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {stats?.reactionsReceived || 0}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Reações Recebidas</div>
                </div>
            </div>

            {/* Posts */}
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
                    Posts Recentes
                </h2>

                {posts.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-muted)' }}>Ainda não há posts</div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {posts.map(post => (
                            <div key={post.id} className="glass-panel" style={{ padding: '20px' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '8px' }}>
                                    {post.title}
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
                                    {post.body.slice(0, 200)}{post.body.length > 200 && '...'}
                                </p>
                                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                    <span>{post._count?.comments || 0} comentários</span>
                                    <span>•</span>
                                    <span>{formatDate(post.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <EditProfileModal
                    profile={profile}
                    onClose={() => setShowEditModal(false)}
                    onSave={(updatedProfile) => {
                        setProfile(updatedProfile);
                        setShowEditModal(false);
                        loadProfile(); // Reload to get fresh data
                    }}
                    userId={currentUserId}
                />
            )}
        </motion.div>
    );
};

// Edit Profile Modal Component
const EditProfileModal = ({ profile, onClose, onSave, userId }) => {
    const [formData, setFormData] = useState({
        username: profile?.username || '',
        restaurantName: profile?.restaurantName || '',
        locationCity: profile?.locationCity || '',
        locationRegion: profile?.locationRegion || '',
        restaurantType: profile?.restaurantType || '',
        bio: profile?.bio || ''
    });
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [usernameError, setUsernameError] = useState('');

    // Validate username: only alphanumeric and underscore
    const validateUsername = (username) => {
        if (!username) {
            setUsernameError('');
            return true;
        }
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            setUsernameError('Username só pode conter letras, números e underscore (_)');
            return false;
        }
        if (username.length < 3) {
            setUsernameError('Username deve ter pelo menos 3 caracteres');
            return false;
        }
        if (username.length > 20) {
            setUsernameError('Username deve ter no máximo 20 caracteres');
            return false;
        }
        setUsernameError('');
        return true;
    };

    const handleUsernameChange = (e) => {
        const newUsername = e.target.value;
        setFormData({ ...formData, username: newUsername });
        validateUsername(newUsername);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate username before submitting
        if (!validateUsername(formData.username)) {
            return;
        }

        setSubmitting(true);

        try {
            const updateData = { ...formData };
            if (profilePhoto) updateData.profilePhoto = profilePhoto;
            if (coverPhoto) updateData.coverPhoto = coverPhoto;

            const result = await CommunityAPI.updateProfile(userId, updateData);
            onSave(result.data);
        } catch (err) {
            alert('Erro ao atualizar perfil: ' + err.message);
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
            <div className="glass-panel" style={{
                padding: '32px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
                margin: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Editar Perfil</h2>
                    <button onClick={onClose} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'white' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                            Username <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>(para menções @)</span>
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={handleUsernameChange}
                            placeholder="ex: chef_mario"
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: `1px solid ${usernameError ? '#ff6b6b' : 'var(--border)'}`,
                                borderRadius: '8px',
                                color: 'white'
                            }}
                        />
                        {usernameError && (
                            <div style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '6px' }}>
                                {usernameError}
                            </div>
                        )}
                        {!usernameError && formData.username && (
                            <div style={{ color: '#51cf66', fontSize: '0.8rem', marginTop: '6px' }}>
                                ✓ Username válido
                            </div>
                        )}
                    </div>

                    {/* Restaurant Name */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Nome do Restaurante</label>
                        <input
                            type="text"
                            value={formData.restaurantName}
                            onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                        />
                    </div>

                    {/* Location */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Cidade</label>
                            <input
                                type="text"
                                value={formData.locationCity}
                                onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Região</label>
                            <input
                                type="text"
                                value={formData.locationRegion}
                                onChange={(e) => setFormData({ ...formData, locationRegion: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                            />
                        </div>
                    </div>

                    {/* Restaurant Type */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Tipo de Restaurante</label>
                        <select
                            value={formData.restaurantType}
                            onChange={(e) => setFormData({ ...formData, restaurantType: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'white'
                            }}
                        >
                            <option value="">Selecionar...</option>
                            <option value="Tradicional">Tradicional</option>
                            <option value="Contemporâneo">Contemporâneo</option>
                            <option value="Fusion">Fusion</option>
                            <option value="Fast Food">Fast Food</option>
                            <option value="Pizzaria">Pizzaria</option>
                            <option value="Sushi">Sushi</option>
                            <option value="Vegetariano">Vegetariano</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>

                    {/* Bio */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'white',
                                resize: 'vertical'
                            }}
                            placeholder="Conta-nos sobre o teu restaurante..."
                        />
                    </div>

                    {/* Profile Photo */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                            <Camera size={16} style={{ display: 'inline', marginRight: '6px' }} />
                            Foto de Perfil
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilePhoto(e.target.files[0])}
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
                    </div>

                    {/* Cover Photo */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                            <Camera size={16} style={{ display: 'inline', marginRight: '6px' }} />
                            Foto de Capa
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverPhoto(e.target.files[0])}
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
                    </div>

                    {/* Buttons */}
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
                            {submitting ? 'A guardar...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileView;
