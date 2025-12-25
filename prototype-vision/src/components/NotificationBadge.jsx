import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

/**
 * NotificationBadge Component
 * Shows a bell icon with unread count badge
 */
const NotificationBadge = ({ onClick, className = '' }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/community/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-white/5 transition-colors ${className}`}
      aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
    >
      <div className="flex items-center gap-2">
        <Bell size={18} className="text-white/60" />
        <span className="text-sm text-white/60">
          Notificações
        </span>
      </div>
      {!loading && unreadCount > 0 && (
        <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBadge;
