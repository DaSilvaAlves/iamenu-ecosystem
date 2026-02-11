/**
 * Chat-related type definitions
 */

export const NavigationTab = {
  Home: 'home',
  Community: 'group',
  Messages: 'chat_bubble',
  Jobs: 'work',
  Settings: 'settings'
} as const;

export interface User {
  id: string;
  name: string;
  role?: string;
  avatarUrl: string;
  isOnline?: boolean;
}

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status?: MessageStatus;
}

export interface Chat {
  id: string;
  user: User;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount?: number;
  messages: Message[];
}
