import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Bell, MessageSquare, Bookmark, User, X } from 'lucide-react';
import { CommunityAPI, Auth } from '../services/api';

const TopBar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [userProfile, setUserProfile] = useState(null);
    const dropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        loadNotifications();
        loadUserProfile();
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        if (showNotifications) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    const loadNotifications = async () => {
        try {
            const data = await CommunityAPI.getNotifications({ limit: 10 });
            setNotifications(data.data || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (err) {
            console.error('Error loading notifications:', err);
        }
    };

    const loadUserProfile = async () => {
        try {
            const userId = Auth.getUserId();
            if (userId) {
                const profileData = await CommunityAPI.getProfile(userId);
                setUserProfile(profileData.data);
            }
        } catch (err) {
            console.error('Error loading user profile:', err);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await CommunityAPI.markNotificationAsRead(id);
            loadNotifications();
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await CommunityAPI.markAllNotificationsAsRead();
            loadNotifications();
        } catch (err) {
            console.error('Error marking all as read:', err);
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

    const navLinks = [
        { to: '/comunidade', label: 'Home' },
        { to: '/aulas', label: 'Cursos' },
        { to: '/hubs', label: 'Hubs' },
        { to: '/lab', label: 'Chat Comunidade' }
    ];

    return (
        <div style={{
            height: '64px',
            backgroundColor: 'var(--bg-sidebar)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '28px',
                        height: '28px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                    }}>ia</div>
                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>iaMenu Ecosystem [PT]</span>
                </Link>

                <nav style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {navLinks.map(link => (
                        <Link key={link.to} to={link.to} style={{
                            cursor: 'pointer',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            backgroundColor: location.pathname === link.to ? 'rgba(255,255,255,0.05)' : 'transparent',
                            color: location.pathname === link.to ? 'white' : 'inherit',
                            transition: 'all 0.2s'
                        }} className="hover:text-white">
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link to="/pesquisa"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        width: '240px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    className="hover:bg-white/5"
                >
                    <Search size={16} color="var(--text-muted)" />
                    <input
                        placeholder="Pesquisar..."
                        style={{ backgroundColor: 'transparent', border: 'none', color: 'white', fontSize: '0.85rem', outline: 'none', width: '100%', cursor: 'pointer' }}
                        readOnly
                    />
                </Link>

                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
                    {/* Notifications Dropdown - Code remains the same */}
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                         <div
                            onClick={() => setShowNotifications(!showNotifications)}
                            style={{ position: 'relative', cursor: 'pointer' }}
                            className="hover:text-white"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '-4px',
                                    minWidth: '18px',
                                    height: '18px',
                                    backgroundColor: 'var(--primary)',
                                    borderRadius: '10px',
                                    border: '2px solid var(--bg-sidebar)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.65rem',
                                    fontWeight: 'bold',
                                    padding: '0 4px'
                                }}>{unreadCount}</div>
                            )}
                        </div>

                        {showNotifications && (
                            <div style={{
                                position: 'absolute',
                                top: 'calc(100% + 12px)',
                                right: 0,
                                width: '400px',
                                maxHeight: '500px',
                                backgroundColor: 'var(--bg-sidebar)',
                                border: '1px solid var(--border)',
                                borderRadius: '12px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                                overflow: 'hidden',
                                zIndex: 1000
                            }}>
                                <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontWeight: '600', fontSize: '1rem' }}>Notificações</h3>
                                    {unreadCount > 0 && ( <button onClick={handleMarkAllAsRead} style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none' }}> Marcar todas como lidas </button> )}
                                </div>
                                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}> Sem notificações </div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div key={notif.id} onClick={() => !notif.read && handleMarkAsRead(notif.id)} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer', backgroundColor: notif.read ? 'transparent' : 'rgba(255,255,255,0.03)', transition: 'background-color 0.2s' }} className="hover:bg-white/5" >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: notif.read ? 'var(--text-muted)' : 'white' }}> {notif.title} </span>
                                                    {!notif.read && ( <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary)', borderRadius: '50%', marginTop: '4px' }}></div> )}
                                                </div>
                                                {notif.body && ( <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', lineHeight: '1.4' }}> {notif.body} </p> )}
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}> {formatTimeAgo(notif.createdAt)} </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* End Notifications */}

                    <MessageSquare size={20} className="cursor-pointer hover:text-white" />
                    <Bookmark size={20} className="cursor-pointer hover:text-white" />
                    <Link to="/perfil"
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            border: '2px solid rgba(255,255,255,0.1)',
                            transition: 'border-color 0.2s'
                        }}
                        className="hover:border-primary"
                    >
                        {userProfile?.profilePhoto ? (
                            <img
                                src={`http://localhost:3004${userProfile.profilePhoto}`}
                                alt="Profile"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            <User size={18} />
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
