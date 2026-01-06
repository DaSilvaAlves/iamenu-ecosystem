
import { PostCategory, PainCategory, Impact } from './types';

export const HUBS = [
  { id: 'h1', name: 'Hub Algarve', description: 'Restaurantes & Foodservice Algarve', region: 'Algarve', memberCount: 124 },
  { id: 'h2', name: 'Hub Lisboa', description: 'Lisboa & Vale do Tejo Innovation', region: 'Lisboa', memberCount: 450 },
  { id: 'h3', name: 'Hub Norte', description: 'Culinária e Negócios Porto & Norte', region: 'Porto', memberCount: 320 },
];

export const MOCK_USER = {
  id: 'u1',
  name: 'Chef Ricardo',
  avatar: 'https://picsum.photos/id/64/200/200',
  role: 'Dono & Chef',
  restaurant: 'O Pescador',
  hub: 'h1',
  isModerator: true
};

export const MOCK_POSTS = [
  {
    id: 'p1',
    author: { name: 'Ana Costa', avatar: 'https://picsum.photos/id/65/200/200', restaurant: 'Bistro 22' },
    category: PostCategory.EVENTO,
    title: 'Workshop de Mixologia - Lisboa',
    content: 'Não percam o próximo workshop no Hub Lisboa. Vamos explorar novas tendências para o verão de 2024. Inscrições abertas!',
    timestamp: '5h atrás',
    likes: 45,
    commentsCount: 18,
    imageUrl: 'https://picsum.photos/id/42/800/400',
    isPinned: true
  },
  {
    id: 'p2',
    author: { name: 'Miguel Santos', avatar: 'https://picsum.photos/id/88/200/200', restaurant: 'Café Central' },
    category: PostCategory.DUVIDA,
    title: 'POS System: Qual recomendam?',
    content: 'Estamos a pensar trocar o nosso sistema de POS. Qual é o melhor para integrar com Uber Eats e Glovo sem dores de cabeça?',
    timestamp: '1d atrás',
    likes: 8,
    commentsCount: 23
  }
];

export const REGIONS = ['Algarve', 'Norte', 'Lisboa & Vale do Tejo', 'Centro', 'Alentejo'];
