import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HabitList } from '@/components/habits/HabitList';
import { STORAGE_KEYS } from '@/lib/constants';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace, push: replace, refresh: vi.fn() }),
}));

const TODAY_USER = { userId: 'u1', email: 'a@b.com' };

function seedSession() {
  window.localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(TODAY_USER));
}

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

beforeEach(() => {
  replace.mockClear();
  window.localStorage.clear();
  seedSession();
});

describe('habit form', () => {
  it('shows a validation error when habit name is empty', async () => {
    render(<HabitList />);
    await userEvent.click(await screen.findByTestId('create-habit-button'));
    await userEvent.click(screen.getByTestId('habit-save-button'));

    expect(await screen.findByRole('alert')).toHaveTextContent('Habit name is required');
    const habits = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.habits) || '[]');
    expect(habits).toHaveLength(0);
  });

  it('creates a new habit and renders it in the list', async () => {
    render(<HabitList />);
    await userEvent.click(await screen.findByTestId('create-habit-button'));
    await userEvent.type(screen.getByTestId('habit-name-input'), 'Drink Water');
    await userEvent.type(
      screen.getByTestId('habit-description-input'),
      'Two liters per day',
    );
    await userEvent.click(screen.getByTestId('habit-save-button'));

    expect(await screen.findByTestId('habit-card-drink-water')).toBeInTheDocument();
    const habits = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.habits) || '[]');
    expect(habits).toHaveLength(1);
    expect(habits[0]).toMatchObject({
      userId: 'u1',
      name: 'Drink Water',
      description: 'Two liters per day',
      frequency: 'daily',
    });
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const original = {
      id: 'h1',
      userId: 'u1',
      name: 'Drink Water',
      description: 'old',
      frequency: 'daily' as const,
      createdAt: '2026-01-01T00:00:00.000Z',
      completions: ['2026-01-02'],
    };
    window.localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify([original]));

    render(<HabitList />);
    await userEvent.click(await screen.findByTestId('habit-edit-drink-water'));

    const nameInput = screen.getByTestId('habit-name-input') as HTMLInputElement;
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Hydrate');
    await userEvent.click(screen.getByTestId('habit-save-button'));

    expect(await screen.findByTestId('habit-card-hydrate')).toBeInTheDocument();
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.habits) || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0]).toMatchObject({
      id: 'h1',
      userId: 'u1',
      createdAt: '2026-01-01T00:00:00.000Z',
      completions: ['2026-01-02'],
      frequency: 'daily',
      name: 'Hydrate',
    });
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const habit = {
      id: 'h1',
      userId: 'u1',
      name: 'Drink Water',
      description: '',
      frequency: 'daily' as const,
      createdAt: '2026-01-01T00:00:00.000Z',
      completions: [],
    };
    window.localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify([habit]));

    render(<HabitList />);
    await userEvent.click(await screen.findByTestId('habit-delete-drink-water'));

    // Habit still present until confirm
    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument();
    let stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.habits) || '[]');
    expect(stored).toHaveLength(1);

    await userEvent.click(screen.getByTestId('confirm-delete-button'));

    expect(screen.queryByTestId('habit-card-drink-water')).not.toBeInTheDocument();
    stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.habits) || '[]');
    expect(stored).toHaveLength(0);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('toggles completion and updates the streak display', async () => {
    const habit = {
      id: 'h1',
      userId: 'u1',
      name: 'Drink Water',
      description: '',
      frequency: 'daily' as const,
      createdAt: '2026-01-01T00:00:00.000Z',
      completions: [],
    };
    window.localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify([habit]));

    render(<HabitList />);
    const card = await screen.findByTestId('habit-card-drink-water');
    expect(within(card).getByTestId('habit-streak-drink-water')).toHaveTextContent('0');

    await userEvent.click(within(card).getByTestId('habit-complete-drink-water'));
    expect(within(card).getByTestId('habit-streak-drink-water')).toHaveTextContent('1');

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.habits) || '[]');
    expect(stored[0].completions).toEqual([todayISO()]);

    await userEvent.click(within(card).getByTestId('habit-complete-drink-water'));
    expect(within(card).getByTestId('habit-streak-drink-water')).toHaveTextContent('0');
  });
});
