import type { Habit } from '@/types/habit';
import { STORAGE_KEYS } from './constants';
import { readJSON, writeJSON } from './storage';

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const has = habit.completions.includes(date);
  const next = has
    ? habit.completions.filter((d) => d !== date)
    : Array.from(new Set([...habit.completions, date]));
  return { ...habit, completions: next };
}

export function loadAllHabits(): Habit[] {
  return readJSON<Habit[]>(STORAGE_KEYS.habits, []);
}

export function saveAllHabits(habits: Habit[]): void {
  writeJSON(STORAGE_KEYS.habits, habits);
}

export function getUserHabits(userId: string): Habit[] {
  return loadAllHabits().filter((h) => h.userId === userId);
}

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createHabit(input: {
  userId: string;
  name: string;
  description: string;
}): Habit {
  const habit: Habit = {
    id: uid(),
    userId: input.userId,
    name: input.name,
    description: input.description,
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    completions: [],
  };
  saveAllHabits([...loadAllHabits(), habit]);
  return habit;
}

export function updateHabit(
  id: string,
  patch: { name?: string; description?: string },
): Habit | null {
  const all = loadAllHabits();
  const idx = all.findIndex((h) => h.id === id);
  if (idx === -1) return null;
  const current = all[idx];
  const updated: Habit = {
    ...current,
    name: patch.name ?? current.name,
    description: patch.description ?? current.description,
    frequency: 'daily',
  };
  all[idx] = updated;
  saveAllHabits(all);
  return updated;
}

export function deleteHabit(id: string): void {
  saveAllHabits(loadAllHabits().filter((h) => h.id !== id));
}

export function persistToggleCompletion(id: string, date: string): Habit | null {
  const all = loadAllHabits();
  const idx = all.findIndex((h) => h.id === id);
  if (idx === -1) return null;
  const updated = toggleHabitCompletion(all[idx], date);
  all[idx] = updated;
  saveAllHabits(all);
  return updated;
}
