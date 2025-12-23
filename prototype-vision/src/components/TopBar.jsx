import React from 'react';
import { Search, Bell, MessageSquare, Bookmark, User } from 'lucide-react';

const TopBar = () => {
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                </div>

                <nav style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {['Home', 'Cursos', 'Hubs', 'Leaderboard'].map(item => (
                        <span key={item} style={{
                            cursor: 'pointer',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            backgroundColor: item === 'Home' ? 'rgba(255,255,255,0.05)' : 'transparent',
                            color: item === 'Home' ? 'white' : 'inherit',
                            transition: 'all 0.2s'
                        }} className="hover:text-white">
                            {item}
                        </span>
                    ))}
                </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    width: '240px'
                }}>
                    <Search size={16} color="var(--text-muted)" />
                    <input
                        placeholder="Pesquisar..."
                        style={{ backgroundColor: 'transparent', border: 'none', color: 'white', fontSize: '0.85rem', outline: 'none', width: '100%' }}
                        readOnly
                    />
                </div>

                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
                    <div style={{ position: 'relative', cursor: 'pointer' }} className="hover:text-white">
                        <Bell size={20} />
                        <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', backgroundColor: 'var(--primary)', borderRadius: '50%', border: '2px solid var(--bg-sidebar)' }}></div>
                    </div>
                    <MessageSquare size={20} className="cursor-pointer hover:text-white" />
                    <Bookmark size={20} className="cursor-pointer hover:text-white" />
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
                        <User size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
