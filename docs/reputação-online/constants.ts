
import { Platform, ResponseStatus, Review, Metric, TopicInsight } from './types';

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'João D.',
    platform: Platform.GOOGLE,
    rating: 1,
    content: 'O serviço foi incrivelmente lento e a comida estava fria quando chegou. Esperava muito melhor pelo preço que pagámos.',
    date: 'há 2 horas',
    status: ResponseStatus.UNANSWERED,
    avatar: 'JD'
  },
  {
    id: '2',
    author: 'Sara M.',
    platform: Platform.TRIPADVISOR,
    rating: 5,
    content: "Adorei a massa! Excelente ambiente, mas o tempo de espera foi um pouco superior ao esperado para uma terça-feira.",
    date: 'há 1 dia',
    status: ResponseStatus.REPLIED,
    response: "Olá Sara, muito obrigado pelas simpáticas palavras! Ficamos felizes por ter gostado da nossa massa...",
    avatar: 'SM'
  },
  {
    id: '3',
    author: 'Mesa 4',
    platform: Platform.PRIVATE,
    rating: 3,
    content: 'A comida chegou um pouco fria à mesa. O empregado foi muito educado, no entanto.',
    date: 'Agora mesmo',
    status: ResponseStatus.UNANSWERED,
    table: 'Mesa 4'
  },
  {
    id: '4',
    author: 'Miguel K.',
    platform: Platform.GOOGLE,
    rating: 4,
    content: 'Bom espaço, mas muito barulhento.',
    date: 'há 3 dias',
    status: ResponseStatus.UNANSWERED,
    avatar: 'MK'
  }
];

export const MOCK_METRICS: Metric[] = [
  { label: 'Nota Média', value: '4.7', trend: 0.2, icon: 'star' },
  { label: 'Total Avaliações', value: '2,450', trend: 5, icon: 'reviews', trendLabel: '%' },
  { label: 'Taxa de Resposta', value: '92%', trend: 0, icon: 'forum', trendLabel: 'Objetivo: 100%' },
  { label: 'Tempo Médio', value: '2h 15m', trend: -10, icon: 'schedule', trendLabel: 'm' }
];

export const TOPIC_INSIGHTS: TopicInsight[] = [
  { topic: 'Serviço', mentions: 12, sentiment: 'positive' },
  { topic: 'Ambiente', mentions: 8, sentiment: 'positive' },
  { topic: 'Qualidade Burger', mentions: 3, sentiment: 'negative' }
];

export const PLATFORM_BREAKDOWN = [
  { name: Platform.GOOGLE, rating: 4.8, count: 120, color: '#FF5500' },
  { name: Platform.YELP, rating: 4.2, count: 45, color: '#FF5500' },
  { name: Platform.TRIPADVISOR, rating: 4.5, count: 28, color: '#FF5500' }
];
