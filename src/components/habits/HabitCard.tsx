'use client';

import { useState } from 'react';
import type { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';

type Props = {
  habit: Habit;
  todayISO: string;
  onToggleComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export function HabitCard({ habit, todayISO, onToggleComplete, onEdit, onDelete }: Props) {
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, todayISO);
  const completedToday = habit.completions.includes(todayISO);
  const [confirming, setConfirming] = useState(false);

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`flex flex-col gap-3 rounded-lg border p-4 transition-colors ${
        completedToday
          ? 'border-emerald-300 bg-emerald-50'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{habit.name}</h3>
          {habit.description && (
            <p className="mt-0.5 text-sm text-slate-600">{habit.description}</p>
          )}
        </div>
        <span
          data-testid={`habit-streak-${slug}`}
          className="shrink-0 rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white"
          aria-label={`Current streak ${streak}`}
        >
          🔥 {streak}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggleComplete(habit)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
            completedToday
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {completedToday ? 'Completed' : 'Complete'}
        </button>
        <button
          type="button"
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Edit
        </button>
        {!confirming ? (
          <button
            type="button"
            data-testid={`habit-delete-${slug}`}
            onClick={() => setConfirming(true)}
            className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        ) : (
          <>
            <button
              type="button"
              data-testid="confirm-delete-button"
              onClick={() => {
                setConfirming(false);
                onDelete(habit);
              }}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            >
              Confirm delete
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </article>
  );
}
