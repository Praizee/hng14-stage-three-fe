'use client';

import { useState } from 'react';
import { Save, X } from 'lucide-react';
import type { Habit } from '@/types/habit';
import { validateHabitName } from '@/lib/validators';
import { HABIT_NAME_MAX } from '@/lib/constants';

type Props = {
  initial?: Habit;
  onSubmit: (input: { name: string; description: string }) => void;
  onCancel: () => void;
};

export function HabitForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = validateHabitName(name);
    if (!v.valid) {
      setError(v.error);
      return;
    }
    setError(null);
    onSubmit({ name: v.value, description: description.trim() });
  };

  const remaining = HABIT_NAME_MAX - name.length;
  const isEdit = Boolean(initial);

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      noValidate
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {isEdit ? 'Edit habit' : 'New habit'}
        </h2>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="habit-name" className="text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          id="habit-name"
          type="text"
          required
          data-testid="habit-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base shadow-sm placeholder:text-slate-400 focus:border-slate-900"
          placeholder="e.g. Drink Water"
          maxLength={HABIT_NAME_MAX + 5}
        />
        <p
          className={`text-xs ${remaining < 0 ? 'text-red-600' : 'text-slate-500'}`}
          aria-live="polite"
        >
          {remaining < 0
            ? `${-remaining} characters over the limit`
            : `${remaining} characters remaining`}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="habit-description"
          className="text-sm font-medium text-slate-700"
        >
          Description <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base shadow-sm placeholder:text-slate-400 focus:border-slate-900"
          placeholder="What does this habit look like?"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="habit-frequency"
          className="text-sm font-medium text-slate-700"
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value="daily"
          onChange={() => {
            /* daily-only at this stage */
          }}
          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-base shadow-sm"
        >
          <option value="daily">Daily</option>
        </select>
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <div className="mt-1 flex flex-wrap gap-2">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:bg-slate-950"
        >
          <Save className="h-4 w-4" aria-hidden />
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100"
        >
          <X className="h-4 w-4" aria-hidden />
          Cancel
        </button>
      </div>
    </form>
  );
}
