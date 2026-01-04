
export enum Platform {
  GOOGLE = 'Google',
  TRIPADVISOR = 'TripAdvisor',
  PRIVATE = 'Privado',
  YELP = 'Yelp'
}

export enum ResponseStatus {
  UNANSWERED = 'Sem resposta',
  REPLIED = 'Respondida',
  PENDING = 'Pendente'
}

export enum Tone {
  PROFESSIONAL = 'Profissional',
  FRIENDLY = 'Amigável',
  APOLOGETIC = 'Empático'
}

export interface Review {
  id: string;
  author: string;
  platform: Platform;
  rating: number;
  content: string;
  date: string;
  status: ResponseStatus;
  response?: string;
  avatar?: string;
  table?: string;
}

export interface Metric {
  label: string;
  value: string | number;
  trend: number;
  icon: string;
  trendLabel?: string;
}

export interface TopicInsight {
  topic: string;
  mentions: number;
  sentiment: 'positive' | 'negative';
}
