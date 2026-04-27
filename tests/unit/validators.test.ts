import { describe, expect, it } from 'vitest';
import { validateHabitName } from '@/lib/validators';

describe('validateHabitName', () => {
  it('returns an error when habit name is empty', () => {
    const r = validateHabitName('   ');
    expect(r.valid).toBe(false);
    expect(r.error).toBe('Habit name is required');
  });

  it('returns an error when habit name exceeds 60 characters', () => {
    const r = validateHabitName('a'.repeat(61));
    expect(r.valid).toBe(false);
    expect(r.error).toBe('Habit name must be 60 characters or fewer');
  });

  it('returns a trimmed value when habit name is valid', () => {
    const r = validateHabitName('  Drink Water  ');
    expect(r.valid).toBe(true);
    expect(r.value).toBe('Drink Water');
    expect(r.error).toBeNull();
  });
});
