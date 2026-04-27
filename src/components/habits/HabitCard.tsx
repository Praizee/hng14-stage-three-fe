'use client';

import { useState } from 'react';
import { Check, Flame, Pencil, Trash2 } from 'lucide-react';
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

function streakTone(streak: number): string {
  if (streak >= 14) return 'bg-orange-100 text-orange-800 ring-orange-200';
  if (streak >= 7) return 'bg-amber-100 text-amber-800 ring-amber-200';
  if (streak >= 1) return 'bg-emerald-100 text-emerald-800 ring-emerald-200';
  return 'bg-slate-100 text-slate-600 ring-slate-200';
}

export function HabitCard({ habit, todayISO, onToggleComplete, onEdit, onDelete }: Props) {
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, todayISO);
  const completedToday = habit.completions.includes(todayISO);
  const [confirming, setConfirming] = useState(false);

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`group flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-colors sm:p-5 ${
        completedToday
          ? 'border-emerald-200 bg-emerald-50/60'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="mt-1 text-sm leading-snug text-slate-600">
              {habit.description}
            </p>
          )}
        </div>
        <span
          data-testid={`habit-streak-${slug}`}
          aria-label={`Current streak ${streak}`}
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${streakTone(streak)}`}
        >
          <Flame className="h-3.5 w-3.5" aria-hidden />
          <span>{streak}</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggleComplete(habit)}
          aria-pressed={completedToday}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm transition-colors ${
            completedToday
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800'
              : 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950'
          }`}
        >
          <Check className="h-4 w-4" aria-hidden />
          {completedToday ? 'Completed' : 'Complete'}
        </button>

        <button
          type="button"
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100"
          aria-label={`Edit ${habit.name}`}
        >
          <Pencil className="h-4 w-4" aria-hidden />
          Edit
        </button>

        {!confirming ? (
          <button
            type="button"
            data-testid={`habit-delete-${slug}`}
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 active:bg-red-100"
            aria-label={`Delete ${habit.name}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Delete
          </button>
        ) : (
          <div
            role="group"
            aria-label="Confirm delete"
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-2 py-1"
          >
            <span className="text-xs font-medium text-red-700">Delete this habit?</span>
            <button
              type="button"
              data-testid="confirm-delete-button"
              onClick={() => {
                setConfirming(false);
                onDelete(habit);
              }}
              className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-700 active:bg-red-800"
            >
              Yes, delete
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
