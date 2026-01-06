
import { User, Shift, OnboardingTask, Announcement } from './types';

export const currentUser: User = {
  id: 'u1',
  name: 'João Silva',
  role: 'STAFF',
  position: 'Barman Chefe',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export const staffList: User[] = [
  { ...currentUser },
  {
    id: 'u2',
    name: 'Maria Costa',
    role: 'STAFF',
    position: 'Barman',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'Ativo'
  },
  {
    id: 'u3',
    name: 'Sofia Martins',
    role: 'STAFF',
    position: 'Empregado de Mesa',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }
];

export const mockShifts: Shift[] = [
  {
    id: 's1',
    userId: 'u1',
    date: '2023-10-14',
    startTime: '18:00',
    endTime: '23:30',
    position: 'Barman Chefe',
    location: 'Sala Principal',
    status: 'CONFIRMED',
    tag: 'Jantar'
  },
  {
    id: 's2',
    userId: 'u1',
    date: '2023-10-15',
    startTime: '19:00',
    endTime: '00:00',
    position: 'Barman Secundário',
    location: 'Rooftop',
    status: 'CONFIRMED',
    tag: 'Jantar'
  },
  {
    id: 's3',
    userId: 'u1',
    date: '2023-10-16',
    startTime: '11:00',
    endTime: '15:00',
    position: 'Empregado Mesa',
    location: 'Esplanada',
    status: 'PENDING',
    tag: 'Almoço'
  }
];

export const onboardingTasks: OnboardingTask[] = [
  { id: 't1', title: 'Configurar Perfil', description: 'Adicione foto e dados de contacto.', completed: true, category: 'ESSENCIAL' },
  { id: 't2', title: 'Ler Manual de Conduta', description: 'Regras essenciais da casa.', completed: true, category: 'ESSENCIAL' },
  { id: 't3', title: 'Visita Guiada à Cozinha', description: 'Identificar zonas de preparação e entrega.', completed: false, category: 'ESSENCIAL', isUrgent: true },
  { id: 't4', title: 'Tutorial POS', description: 'Aprenda a registar pedidos e pagamentos.', completed: false, category: 'FORMAÇÃO' },
  { id: 't5', title: 'Protocolos de Higiene', description: 'Quiz rápido sobre segurança alimentar.', completed: false, category: 'FORMAÇÃO' },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: 'Atualização de Horários de Verão',
    author: 'Ricardo Silva',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    date: 'Hoje, 10:30',
    content: 'A partir da próxima semana, entraremos no horário de verão. Por favor verifiquem os novos turnos na secção de escala.',
    category: 'IMPORTANTE',
    isPinned: true,
    likes: 12,
    comments: 3
  },
  {
    id: 'a2',
    title: 'Funcionário do Mês: Sofia! 🎉',
    author: 'Sistema iaMenu',
    authorAvatar: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=64&h=64&q=80',
    date: '2 dias atrás',
    content: 'Parabéns à Sofia pela dedicação excepcional este mês. O seu esforço na gestão da sala cheia no último sábado foi incrível.',
    category: 'RECONHECIMENTO',
    images: ['https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'],
    likes: 45,
    comments: 8
  }
];
