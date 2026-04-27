import { HABIT_NAME_MAX, PASSWORD_MIN_LENGTH } from './constants';

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

export function validatePassword(password: string): {
  valid: boolean;
  error: string | null;
} {
  const value = password ?? '';
  if (value.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    };
  }
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return {
      valid: false,
      error: 'Password must contain at least one letter and one number',
    };
  }
  return { valid: true, error: null };
}
