import { describe, expect, it } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

const TODAY = '2026-04-27';
const YESTERDAY = '2026-04-26';
const TWO_DAYS_AGO = '2026-04-25';
const THREE_DAYS_AGO = '2026-04-24';

describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], TODAY)).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak([YESTERDAY, TWO_DAYS_AGO], TODAY)).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    expect(
      calculateCurrentStreak([THREE_DAYS_AGO, TWO_DAYS_AGO, YESTERDAY, TODAY], TODAY),
    ).toBe(4);
  });

  it('ignores duplicate completion dates', () => {
    expect(
      calculateCurrentStreak([TODAY, TODAY, YESTERDAY, YESTERDAY], TODAY),
    ).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    expect(calculateCurrentStreak([TODAY, TWO_DAYS_AGO], TODAY)).toBe(1);
  });
});
