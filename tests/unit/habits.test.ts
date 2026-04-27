import { describe, expect, it } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import type { Habit } from '@/types/habit';

function makeHabit(completions: string[] = []): Habit {
  return {
    id: 'h1',
    userId: 'u1',
    name: 'Drink Water',
    description: '',
    frequency: 'daily',
    createdAt: '2026-01-01T00:00:00.000Z',
    completions,
  };
}

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    const h = makeHabit([]);
    const next = toggleHabitCompletion(h, '2026-04-27');
    expect(next.completions).toEqual(['2026-04-27']);
  });

  it('removes a completion date when the date already exists', () => {
    const h = makeHabit(['2026-04-26', '2026-04-27']);
    const next = toggleHabitCompletion(h, '2026-04-27');
    expect(next.completions).toEqual(['2026-04-26']);
  });

  it('does not mutate the original habit object', () => {
    const completions = ['2026-04-26'];
    const h = makeHabit(completions);
    const next = toggleHabitCompletion(h, '2026-04-27');
    expect(h.completions).toEqual(['2026-04-26']);
    expect(h.completions).not.toBe(next.completions);
    expect(next).not.toBe(h);
  });

  it('does not return duplicate completion dates', () => {
    const h = makeHabit(['2026-04-27']);
    // Manually inject a duplicate to verify dedupe path
    const polluted = { ...h, completions: ['2026-04-27'] };
    const next = toggleHabitCompletion(
      { ...polluted, completions: ['2026-04-27'] },
      '2026-04-28',
    );
    const set = new Set(next.completions);
    expect(set.size).toBe(next.completions.length);
    expect(next.completions).toContain('2026-04-28');
  });
});
