import { API_CONFIG } from '../config/api';

/**
 * NotificationsPanel Component
 * Dropdown panel showing user notifications
 */
const NotificationsPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const panelRef = useRef(null);

  const API_URL = `${API_CONFIG.COMMUNITY_BASE}/api/v1/community/notifications`;

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}?limit=20`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${API_URL}/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, read: true }))
        );
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'comment':
        return <MessageCircle size={18} className="text-blue-500" />;
      case 'reaction':
        return <Heart size={18} className="text-red-500" />;
      case 'group_join':
        return <Users size={18} className="text-green-500" />;
      default:
        return <Bell size={18} className="text-gray-500" />;
    }
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return 'agora mesmo';
    if (seconds < 3600) return `há ${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `há ${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `há ${Math.floor(seconds / 86400)}d`;
    return new Date(date).toLocaleDateString('pt-PT');
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute top-14 left-0 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Notificações</h3>
        <div className="flex items-center gap-2">
          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Marcar todas como lidas
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            A carregar...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Sem notificações</p>
            <p className="text-sm mt-1">Quando algo acontecer, aparecerá aqui!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50' : ''
                  }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">
                      {notif.title}
                    </p>
                    {notif.body && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notif.body}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTimeAgo(notif.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Marcar como lida"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Unread indicator dot */}
                {!notif.read && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
