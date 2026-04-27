import { HABIT_NAME_MAX } from './constants';

export function validateHabitName(name: string): {
  valid: boolean;
  value: string;
  error: string | null;
} {
  const trimmed = (name ?? '').trim();
  if (trimmed.length === 0) {
    return { valid: false, value: trimmed, error: 'Habit name is required' };
  }
  if (trimmed.length > HABIT_NAME_MAX) {
    return {
      valid: false,
      value: trimmed,
      error: `Habit name must be ${HABIT_NAME_MAX} characters or fewer`,
    };
  }
  return { valid: true, value: trimmed, error: null };
}
