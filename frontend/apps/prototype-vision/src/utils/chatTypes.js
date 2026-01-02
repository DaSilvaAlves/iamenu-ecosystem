/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} avatarUrl
 * @property {boolean} [isOnline]
 */

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} senderId
 * @property {string} text
 * @property {string} timestamp
 * @property {'sent'|'delivered'|'read'} [status]
 */

/**
 * @typedef {Object} Chat
 * @property {string} id
 * @property {User} user
 * @property {string} lastMessage
 * @property {string} lastTimestamp
 * @property {number} [unreadCount]
 * @property {Message[]} messages
 */

export const NavigationTab = {
  Home: 'home',
  Community: 'group',
  Messages: 'chat_bubble',
  Jobs: 'work',
  Settings: 'settings'
};
