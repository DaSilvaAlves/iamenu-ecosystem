/**
 * Gamification Logic Tests
 * US-1.1.1 - Sprint 1 Quality Assurance
 *
 * Tests for: XP calculation, Level progression, Achievement unlocking
 * Coverage Target: 100% branch coverage for achievements.ts
 */

import {
  calculateLevel,
  getXPForNextLevel,
  getXPForCurrentLevel,
  calculateBaseXP,
  getUnlockedAchievements,
  calculateTotalXP,
  ACHIEVEMENTS,
  UserStats,
} from '../src/config/achievements';

describe('Gamification: Level Calculation', () => {
  /**
   * Formula: level = floor(sqrt(totalXP / 100)) + 1
   * Level 1: 0-99 XP
   * Level 2: 100-399 XP
   * Level 3: 400-899 XP
   * Level 4: 900-1599 XP
   */

  describe('calculateLevel', () => {
    it('GIVEN 0 XP WHEN calculateLevel THEN returns level 1', () => {
      // Arrange
      const totalXP = 0;

      // Act
      const level = calculateLevel(totalXP);

      // Assert
      expect(level).toBe(1);
    });

    it('GIVEN 99 XP WHEN calculateLevel THEN returns level 1 (boundary)', () => {
      const level = calculateLevel(99);
      expect(level).toBe(1);
    });

    it('GIVEN 100 XP WHEN calculateLevel THEN returns level 2', () => {
      // sqrt(100/100) = 1, floor(1) + 1 = 2
      const level = calculateLevel(100);
      expect(level).toBe(2);
    });

    it('GIVEN 400 XP WHEN calculateLevel THEN returns level 3', () => {
      // sqrt(400/100) = 2, floor(2) + 1 = 3
      const level = calculateLevel(400);
      expect(level).toBe(3);
    });

    it('GIVEN 900 XP WHEN calculateLevel THEN returns level 4', () => {
      // sqrt(900/100) = 3, floor(3) + 1 = 4
      const level = calculateLevel(900);
      expect(level).toBe(4);
    });

    it('GIVEN 1600 XP WHEN calculateLevel THEN returns level 5', () => {
      const level = calculateLevel(1600);
      expect(level).toBe(5);
    });

    it('GIVEN intermediate XP (250) WHEN calculateLevel THEN returns correct level', () => {
      // sqrt(250/100) = 1.58, floor(1.58) + 1 = 2
      const level = calculateLevel(250);
      expect(level).toBe(2);
    });
  });

  describe('getXPForNextLevel', () => {
    it('GIVEN level 1 WHEN getXPForNextLevel THEN returns 100 XP', () => {
      // Formula: (level * level) * 100 = 1 * 1 * 100 = 100
      const xpNeeded = getXPForNextLevel(1);
      expect(xpNeeded).toBe(100);
    });

    it('GIVEN level 2 WHEN getXPForNextLevel THEN returns 400 XP', () => {
      const xpNeeded = getXPForNextLevel(2);
      expect(xpNeeded).toBe(400);
    });

    it('GIVEN level 5 WHEN getXPForNextLevel THEN returns 2500 XP', () => {
      const xpNeeded = getXPForNextLevel(5);
      expect(xpNeeded).toBe(2500);
    });
  });

  describe('getXPForCurrentLevel', () => {
    it('GIVEN level 1 WHEN getXPForCurrentLevel THEN returns 0 XP', () => {
      const xpNeeded = getXPForCurrentLevel(1);
      expect(xpNeeded).toBe(0);
    });

    it('GIVEN level 2 WHEN getXPForCurrentLevel THEN returns 100 XP', () => {
      // Formula: ((level-1)^2) * 100 = 1 * 100 = 100
      const xpNeeded = getXPForCurrentLevel(2);
      expect(xpNeeded).toBe(100);
    });

    it('GIVEN level 3 WHEN getXPForCurrentLevel THEN returns 400 XP', () => {
      const xpNeeded = getXPForCurrentLevel(3);
      expect(xpNeeded).toBe(400);
    });
  });
});

describe('Gamification: XP Calculation', () => {
  /**
   * Formula: (posts * 10) + (comments * 2) + (reactions * 5)
   */

  describe('calculateBaseXP', () => {
    it('GIVEN zero activity WHEN calculateBaseXP THEN returns 0', () => {
      const stats: UserStats = {
        postsCount: 0,
        commentsCount: 0,
        reactionsReceived: 0,
      };

      const xp = calculateBaseXP(stats);

      expect(xp).toBe(0);
    });

    it('GIVEN 1 post WHEN calculateBaseXP THEN returns 10 XP', () => {
      const stats: UserStats = {
        postsCount: 1,
        commentsCount: 0,
        reactionsReceived: 0,
      };

      const xp = calculateBaseXP(stats);

      expect(xp).toBe(10);
    });

    it('GIVEN 1 comment WHEN calculateBaseXP THEN returns 2 XP', () => {
      const stats: UserStats = {
        postsCount: 0,
        commentsCount: 1,
        reactionsReceived: 0,
      };

      const xp = calculateBaseXP(stats);

      expect(xp).toBe(2);
    });

    it('GIVEN 1 reaction received WHEN calculateBaseXP THEN returns 5 XP', () => {
      const stats: UserStats = {
        postsCount: 0,
        commentsCount: 0,
        reactionsReceived: 1,
      };

      const xp = calculateBaseXP(stats);

      expect(xp).toBe(5);
    });

    it('GIVEN mixed activity WHEN calculateBaseXP THEN returns correct total', () => {
      const stats: UserStats = {
        postsCount: 2,   // 20 XP
        commentsCount: 5, // 10 XP
        reactionsReceived: 3, // 15 XP
      };

      const xp = calculateBaseXP(stats);

      expect(xp).toBe(45); // 20 + 10 + 15
    });

    it('GIVEN high activity WHEN calculateBaseXP THEN handles large numbers', () => {
      const stats: UserStats = {
        postsCount: 100,    // 1000 XP
        commentsCount: 500,  // 1000 XP
        reactionsReceived: 200, // 1000 XP
      };

      const xp = calculateBaseXP(stats);

      expect(xp).toBe(3000);
    });
  });

  describe('calculateTotalXP', () => {
    it('GIVEN no badges WHEN calculateTotalXP THEN returns only base XP', () => {
      const stats: UserStats = {
        postsCount: 1,
        commentsCount: 0,
        reactionsReceived: 0,
      };

      const totalXP = calculateTotalXP(stats, []);

      expect(totalXP).toBe(10); // Just base XP
    });

    it('GIVEN first-post badge WHEN calculateTotalXP THEN adds 10 XP bonus', () => {
      const stats: UserStats = {
        postsCount: 1,
        commentsCount: 0,
        reactionsReceived: 0,
      };

      const totalXP = calculateTotalXP(stats, ['first-post']);

      expect(totalXP).toBe(20); // 10 base + 10 badge
    });

    it('GIVEN multiple badges WHEN calculateTotalXP THEN adds all bonuses', () => {
      const stats: UserStats = {
        postsCount: 1,
        commentsCount: 1,
        reactionsReceived: 1,
      };

      // Base: 10 + 2 + 5 = 17
      // Badges: first-post(10) + first-comment(5) + first-reaction(5) = 20
      const totalXP = calculateTotalXP(stats, ['first-post', 'first-comment', 'first-reaction']);

      expect(totalXP).toBe(37);
    });

    it('GIVEN invalid badge ID WHEN calculateTotalXP THEN ignores it', () => {
      const stats: UserStats = {
        postsCount: 1,
        commentsCount: 0,
        reactionsReceived: 0,
      };

      const totalXP = calculateTotalXP(stats, ['invalid-badge', 'first-post']);

      expect(totalXP).toBe(20); // Only first-post bonus applied
    });
  });
});

describe('Gamification: Achievement Unlocking', () => {
  describe('getUnlockedAchievements', () => {
    it('GIVEN zero activity WHEN getUnlockedAchievements THEN returns empty array', () => {
      const stats: UserStats = {
        postsCount: 0,
        commentsCount: 0,
        reactionsReceived: 0,
      };

      const unlocked = getUnlockedAchievements(stats);

      expect(unlocked).toHaveLength(0);
    });

    it('GIVEN 1 post WHEN getUnlockedAchievements THEN unlocks first-post', () => {
      const stats: UserStats = {
        postsCount: 1,
        commentsCount: 0,
        reactionsReceived: 0,
      };

      const unlocked = getUnlockedAchievements(stats);

      expect(unlocked.map(a => a.id)).toContain('first-post');
    });

    it('GIVEN 1 comment WHEN getUnlockedAchievements THEN unlocks first-comment', () => {
      const stats: UserStats = {
        postsCount: 0,
        commentsCount: 1,
        reactionsReceived: 0,
      };

      const unlocked = getUnlockedAchievements(stats);

      expect(unlocked.map(a => a.id)).toContain('first-comment');
    });

    it('GIVEN 1 reaction WHEN getUnlockedAchievements THEN unlocks first-reaction', () => {
      const stats: UserStats = {
        postsCount: 0,
        commentsCount: 0,
        reactionsReceived: 1,
      };

      const unlocked = getUnlockedAchievements(stats);

      expect(unlocked.map(a => a.id)).toContain('first-reaction');
    });

    it('GIVEN 5 posts WHEN getUnlockedAchievements THEN unlocks posts-5 milestone', () => {
      const stats: UserStats = {
        postsCount: 5,
        commentsCount: 0,
        reactionsReceived: 0,
      };

      const unlocked = getUnlockedAchievements(stats);
      const ids = unlocked.map(a => a.id);

      expect(ids).toContain('first-post');
      expect(ids).toContain('posts-5');
      expect(ids).not.toContain('posts-10');
    });

    it('GIVEN active member stats WHEN getUnlockedAchievements THEN unlocks combined achievement', () => {
      // active-member requires: 5 posts AND 10 comments
      const stats: UserStats = {
        postsCount: 5,
        commentsCount: 10,
        reactionsReceived: 0,
      };

      const unlocked = getUnlockedAchievements(stats);
      const ids = unlocked.map(a => a.id);

      expect(ids).toContain('active-member');
    });

    it('GIVEN community hero stats WHEN getUnlockedAchievements THEN unlocks highest achievement', () => {
      // community-hero requires: 20 posts, 50 comments, 30 reactions
      const stats: UserStats = {
        postsCount: 20,
        commentsCount: 50,
        reactionsReceived: 30,
      };

      const unlocked = getUnlockedAchievements(stats);
      const ids = unlocked.map(a => a.id);

      expect(ids).toContain('community-hero');
      expect(ids).toContain('active-member');
      expect(ids).toContain('posts-10');
    });

    it('GIVEN boundary case (4 posts) WHEN getUnlockedAchievements THEN does NOT unlock posts-5', () => {
      const stats: UserStats = {
        postsCount: 4,
        commentsCount: 0,
        reactionsReceived: 0,
      };

      const unlocked = getUnlockedAchievements(stats);
      const ids = unlocked.map(a => a.id);

      expect(ids).toContain('first-post');
      expect(ids).not.toContain('posts-5');
    });
  });
});

describe('Gamification: Achievement Configuration', () => {
  it('GIVEN ACHIEVEMENTS array WHEN checking structure THEN all have required fields', () => {
    ACHIEVEMENTS.forEach(achievement => {
      expect(achievement.id).toBeDefined();
      expect(achievement.name).toBeDefined();
      expect(achievement.description).toBeDefined();
      expect(achievement.icon).toBeDefined();
      expect(achievement.condition).toBeInstanceOf(Function);
      expect(achievement.xpReward).toBeGreaterThan(0);
    });
  });

  it('GIVEN ACHIEVEMENTS array WHEN checking IDs THEN all are unique', () => {
    const ids = ACHIEVEMENTS.map(a => a.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });

  it('GIVEN ACHIEVEMENTS array WHEN checking count THEN has expected number', () => {
    // Based on achievements.ts: 15 achievements defined
    expect(ACHIEVEMENTS.length).toBe(15);
  });
});

describe('Gamification: Integration Scenarios', () => {
  it('GIVEN new user journey WHEN progressing THEN XP and level increase correctly', () => {
    // Day 1: First post
    let stats: UserStats = { postsCount: 1, commentsCount: 0, reactionsReceived: 0 };
    let unlocked = getUnlockedAchievements(stats);
    let totalXP = calculateTotalXP(stats, unlocked.map(a => a.id));

    expect(totalXP).toBe(20); // 10 base + 10 badge
    expect(calculateLevel(totalXP)).toBe(1);

    // Week 1: Active user
    stats = { postsCount: 5, commentsCount: 10, reactionsReceived: 5 };
    unlocked = getUnlockedAchievements(stats);
    totalXP = calculateTotalXP(stats, unlocked.map(a => a.id));

    // Base: 50 + 20 + 25 = 95
    // Badges: first-post(10) + first-comment(5) + first-reaction(5) + posts-5(25) + comments-10(25) + active-member(75) = 145
    // Total: 95 + 145 = 240
    expect(totalXP).toBe(240);
    expect(calculateLevel(totalXP)).toBe(2);
  });

  it('GIVEN power user WHEN maxed activity THEN reaches high level', () => {
    const stats: UserStats = {
      postsCount: 50,
      commentsCount: 100,
      reactionsReceived: 100,
    };

    const unlocked = getUnlockedAchievements(stats);
    const totalXP = calculateTotalXP(stats, unlocked.map(a => a.id));

    // Should have many achievements and high XP
    expect(unlocked.length).toBeGreaterThan(10);
    expect(totalXP).toBeGreaterThan(1500);
    expect(calculateLevel(totalXP)).toBeGreaterThanOrEqual(4);
  });
});
