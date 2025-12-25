/**
 * Achievements Configuration
 * Defines all available badges and their unlock conditions
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
  xpReward: number;
}

export interface UserStats {
  postsCount: number;
  commentsCount: number;
  reactionsReceived: number;
  totalXP?: number;
  level?: number;
}

/**
 * All available achievements
 */
export const ACHIEVEMENTS: Achievement[] = [
  // First Steps
  {
    id: 'first-post',
    name: 'Primeiros Passos',
    description: 'Criou o primeiro post',
    icon: '🎉',
    condition: (stats) => stats.postsCount >= 1,
    xpReward: 10
  },
  {
    id: 'first-comment',
    name: 'Conversador',
    description: 'Fez o primeiro comentário',
    icon: '💬',
    condition: (stats) => stats.commentsCount >= 1,
    xpReward: 5
  },
  {
    id: 'first-reaction',
    name: 'Apreciador',
    description: 'Recebeu a primeira reação',
    icon: '👍',
    condition: (stats) => stats.reactionsReceived >= 1,
    xpReward: 5
  },

  // Post Milestones
  {
    id: 'posts-5',
    name: 'Autor Iniciante',
    description: 'Criou 5 posts',
    icon: '📝',
    condition: (stats) => stats.postsCount >= 5,
    xpReward: 25
  },
  {
    id: 'posts-10',
    name: 'Autor Regular',
    description: 'Criou 10 posts',
    icon: '✍️',
    condition: (stats) => stats.postsCount >= 10,
    xpReward: 50
  },
  {
    id: 'posts-25',
    name: 'Autor Experiente',
    description: 'Criou 25 posts',
    icon: '📚',
    condition: (stats) => stats.postsCount >= 25,
    xpReward: 100
  },
  {
    id: 'posts-50',
    name: 'Autor Prolífico',
    description: 'Criou 50 posts',
    icon: '🏆',
    condition: (stats) => stats.postsCount >= 50,
    xpReward: 250
  },

  // Comment Milestones
  {
    id: 'comments-10',
    name: 'Comentador Ativo',
    description: 'Fez 10 comentários',
    icon: '💭',
    condition: (stats) => stats.commentsCount >= 10,
    xpReward: 25
  },
  {
    id: 'comments-50',
    name: 'Comentador Assíduo',
    description: 'Fez 50 comentários',
    icon: '🗣️',
    condition: (stats) => stats.commentsCount >= 50,
    xpReward: 100
  },
  {
    id: 'comments-100',
    name: 'Mestre dos Comentários',
    description: 'Fez 100 comentários',
    icon: '🎤',
    condition: (stats) => stats.commentsCount >= 100,
    xpReward: 200
  },

  // Popularity Milestones
  {
    id: 'reactions-10',
    name: 'Popular',
    description: 'Recebeu 10 reações',
    icon: '⭐',
    condition: (stats) => stats.reactionsReceived >= 10,
    xpReward: 50
  },
  {
    id: 'reactions-50',
    name: 'Muito Popular',
    description: 'Recebeu 50 reações',
    icon: '🌟',
    condition: (stats) => stats.reactionsReceived >= 50,
    xpReward: 150
  },
  {
    id: 'reactions-100',
    name: 'Influencer',
    description: 'Recebeu 100 reações',
    icon: '💫',
    condition: (stats) => stats.reactionsReceived >= 100,
    xpReward: 300
  },

  // Combined Achievements
  {
    id: 'active-member',
    name: 'Membro Ativo',
    description: 'Criou 5 posts e fez 10 comentários',
    icon: '🔥',
    condition: (stats) => stats.postsCount >= 5 && stats.commentsCount >= 10,
    xpReward: 75
  },
  {
    id: 'community-hero',
    name: 'Herói da Comunidade',
    description: 'Criou 20 posts, fez 50 comentários e recebeu 30 reações',
    icon: '🦸',
    condition: (stats) => stats.postsCount >= 20 && stats.commentsCount >= 50 && stats.reactionsReceived >= 30,
    xpReward: 500
  },
];

/**
 * Calculate user level based on total XP
 * Formula: level = floor(sqrt(totalXP / 100)) + 1
 */
export function calculateLevel(totalXP: number): number {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

/**
 * Calculate XP needed for next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  return (currentLevel * currentLevel) * 100;
}

/**
 * Calculate XP needed for current level
 */
export function getXPForCurrentLevel(currentLevel: number): number {
  if (currentLevel <= 1) return 0;
  return ((currentLevel - 1) * (currentLevel - 1)) * 100;
}

/**
 * Calculate total XP from user stats (base XP without badges)
 */
export function calculateBaseXP(stats: UserStats): number {
  return (stats.postsCount * 10) + (stats.commentsCount * 2) + (stats.reactionsReceived * 5);
}

/**
 * Get unlocked achievements for a user
 */
export function getUnlockedAchievements(stats: UserStats): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => achievement.condition(stats));
}

/**
 * Calculate total XP including badge bonuses
 */
export function calculateTotalXP(stats: UserStats, unlockedBadges: string[]): number {
  const baseXP = calculateBaseXP(stats);
  const badgeXP = ACHIEVEMENTS
    .filter(a => unlockedBadges.includes(a.id))
    .reduce((sum, a) => sum + a.xpReward, 0);

  return baseXP + badgeXP;
}
