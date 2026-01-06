
export type UserRole = 'STAFF' | 'MANAGER';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  position: string;
  avatar: string;
  status?: string;
}

export interface Shift {
  id: string;
  userId: string;
  date: string; // ISO format
  startTime: string;
  endTime: string;
  position: string;
  location: string;
  status: 'PENDING' | 'CONFIRMED' | 'SWAP_REQUESTED';
  tag?: string; // e.g., 'Almoço', 'Jantar'
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: 'ESSENCIAL' | 'FORMAÇÃO';
  isUrgent?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  date: string;
  content: string;
  category: 'IMPORTANTE' | 'FORMAÇÃO' | 'RECONHECIMENTO' | 'OPERACIONAL';
  isPinned?: boolean;
  images?: string[];
  likes: number;
  comments: number;
}
