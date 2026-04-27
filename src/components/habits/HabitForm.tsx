'use client';

import { useState } from 'react';
import type { Habit } from '@/types/habit';
import { validateHabitName } from '@/lib/validators';

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

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4"
      noValidate
    >
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
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-base"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="habit-description"
          className="text-sm font-medium text-slate-700"
        >
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-base"
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
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-base"
        >
          <option value="daily">Daily</option>
        </select>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="mt-1 flex gap-2">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
