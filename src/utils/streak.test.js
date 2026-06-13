import { describe, it, expect } from 'vitest';
import { calculateStreak } from './streak';

describe('Streak Calculation Engine', () => {
  it('should return 0 for empty, null, or undefined entries', () => {
    expect(calculateStreak([])).toBe(0);
    expect(calculateStreak(null)).toBe(0);
    expect(calculateStreak(undefined)).toBe(0);
  });

  it('should return 1 for a single entry logged today', () => {
    const entries = [
      { date: new Date().toISOString() }
    ];
    expect(calculateStreak(entries)).toBe(1);
  });

  it('should return 1 for a single entry logged yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const entries = [
      { date: yesterday.toISOString() }
    ];
    expect(calculateStreak(entries)).toBe(1);
  });

  it('should return 0 if the latest entry is 2 or more days ago', () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const entries = [
      { date: twoDaysAgo.toISOString() }
    ];
    expect(calculateStreak(entries)).toBe(0);
  });

  it('should calculate consecutive days correctly', () => {
    const today = new Date();
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const entries = [
      { date: today.toISOString() },
      { date: yesterday.toISOString() },
      { date: twoDaysAgo.toISOString() },
      { date: threeDaysAgo.toISOString() }
    ];
    expect(calculateStreak(entries)).toBe(4);
  });

  it('should ignore duplicate entries on the same day when counting streak', () => {
    const today = new Date();
    const todaySecond = new Date();
    todaySecond.setHours(today.getHours() - 1);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const entries = [
      { date: today.toISOString() },
      { date: todaySecond.toISOString() },
      { date: yesterday.toISOString() }
    ];
    expect(calculateStreak(entries)).toBe(2);
  });

  it('should stop counting streak when a gap of 2 or more days is encountered', () => {
    const today = new Date();
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Gap: skip 2 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const entries = [
      { date: today.toISOString() },
      { date: yesterday.toISOString() },
      { date: threeDaysAgo.toISOString() }
    ];
    expect(calculateStreak(entries)).toBe(2);
  });
});
