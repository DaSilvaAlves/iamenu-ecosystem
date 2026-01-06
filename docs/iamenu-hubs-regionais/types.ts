
export enum PostCategory {
  DICA = 'Dica',
  DUVIDA = 'Dúvida',
  SHOWCASE = 'Showcase',
  EVENTO = 'Evento',
  GERAL = 'Geral'
}

export enum PainCategory {
  MARGEM = 'Margem',
  STAFF = 'Staff',
  CLIENTES = 'Clientes',
  DELIVERY = 'Delivery',
  TECH = 'Tech'
}

export enum Impact {
  LOW = 'Baixo',
  MEDIUM = 'Médio',
  HIGH = 'Alto'
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  restaurant: string;
  hub: string;
  isModerator?: boolean;
}

export interface Hub {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  region: string;
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    restaurant: string;
  };
  category: PostCategory;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  imageUrl?: string;
  isPinned?: boolean;
  link?: string;
  poll?: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'LINK' | 'DOC' | 'XLSX';
  url: string;
  category: string;
}

export interface Feedback {
  id: string;
  category: PainCategory;
  description: string;
  impact: Impact;
  authorId: string;
  timestamp: string;
}
