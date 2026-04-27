'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Habit } from '@/types/habit';
import { HabitCard } from './HabitCard';
import { HabitForm } from './HabitForm';
import {
  createHabit,
  deleteHabit,
  getUserHabits,
  persistToggleCompletion,
  updateHabit,
} from '@/lib/habits';
import { getSession } from '@/lib/auth';

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

type FormMode =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; habit: Habit };

export function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [today, setToday] = useState<string>('');
  const [form, setForm] = useState<FormMode>({ kind: 'closed' });

  const refresh = useCallback((uid: string) => {
    setHabits(getUserHabits(uid));
  }, []);

  useEffect(() => {
    const session = getSession();
    if (!session) return;
    setUserId(session.userId);
    setToday(todayISO());
    refresh(session.userId);
  }, [refresh]);

  const handleCreate = (input: { name: string; description: string }) => {
    createHabit({ userId, name: input.name, description: input.description });
    setForm({ kind: 'closed' });
    refresh(userId);
  };

  const handleEdit = (id: string, input: { name: string; description: string }) => {
    updateHabit(id, input);
    setForm({ kind: 'closed' });
    refresh(userId);
  };

  const handleDelete = (habit: Habit) => {
    deleteHabit(habit.id);
    refresh(userId);
  };

  const handleToggleComplete = (habit: Habit) => {
    persistToggleCompletion(habit.id, today);
    refresh(userId);
  };

  if (!userId) return null;

  return (
    <section className="flex flex-col gap-4">
      {form.kind === 'closed' && (
        <button
          type="button"
          data-testid="create-habit-button"
          onClick={() => setForm({ kind: 'create' })}
          className="self-start rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          New habit
        </button>
      )}

      {form.kind === 'create' && (
        <HabitForm
          onSubmit={handleCreate}
          onCancel={() => setForm({ kind: 'closed' })}
        />
      )}

      {form.kind === 'edit' && (
        <HabitForm
          initial={form.habit}
          onSubmit={(input) => handleEdit(form.habit.id, input)}
          onCancel={() => setForm({ kind: 'closed' })}
        />
      )}

      {habits.length === 0 ? (
        <div
          data-testid="empty-state"
          className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600"
        >
          You don&apos;t have any habits yet. Create your first one to get started.
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {habits.map((h) => (
            <li key={h.id}>
              <HabitCard
                habit={h}
                todayISO={today}
                onToggleComplete={handleToggleComplete}
                onEdit={(habit) => setForm({ kind: 'edit', habit })}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
