"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import type { Habit } from "@/types/habit";
import { HabitCard } from "./HabitCard";
import { HabitForm } from "./HabitForm";
import {
  createHabit,
  deleteHabit,
  getUserHabits,
  persistToggleCompletion,
  updateHabit,
} from "@/lib/habits";
import { getSession } from "@/lib/auth";

function todayISO(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

type FormMode =
  | { kind: "closed" }
  | { kind: "create" }
  | { kind: "edit"; habit: Habit };

export function HabitList() {
  const [userId] = useState<string>(() => getSession()?.userId ?? "");
  const [today] = useState<string>(() => todayISO());
  const [habits, setHabits] = useState<Habit[]>(() => {
    const s = getSession();
    return s ? getUserHabits(s.userId) : [];
  });
  const [form, setForm] = useState<FormMode>({ kind: "closed" });

  const refresh = () => {
    if (!userId) return;
    setHabits(getUserHabits(userId));
  };

  const handleCreate = (input: { name: string; description: string }) => {
    createHabit({ userId, name: input.name, description: input.description });
    setForm({ kind: "closed" });
    refresh();
  };

  const handleEdit = (
    id: string,
    input: { name: string; description: string },
  ) => {
    updateHabit(id, input);
    setForm({ kind: "closed" });
    refresh();
  };

  const handleDelete = (habit: Habit) => {
    deleteHabit(habit.id);
    refresh();
  };

  const handleToggleComplete = (habit: Habit) => {
    persistToggleCompletion(habit.id, today);
    refresh();
  };

  if (!userId) return null;

  return (
    <section className="flex flex-col gap-4">
      {form.kind === "closed" && (
        <button
          type="button"
          data-testid="create-habit-button"
          onClick={() => setForm({ kind: "create" })}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 active:bg-slate-950"
        >
          <Plus className="h-4 w-4" aria-hidden />
          New habit
        </button>
      )}

      {form.kind === "create" && (
        <HabitForm
          onSubmit={handleCreate}
          onCancel={() => setForm({ kind: "closed" })}
        />
      )}

      {form.kind === "edit" && (
        <HabitForm
          initial={form.habit}
          onSubmit={(input) => handleEdit(form.habit.id, input)}
          onCancel={() => setForm({ kind: "closed" })}
        />
      )}

      {habits.length === 0 ? (
        <div
          data-testid="empty-state"
          className="rounded-xl border border-dashed border-slate-300 bg-white p-8 py-20 text-center"
        >
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-slate-900">No habits yet</p>
            <p className="text-sm text-slate-600">
              Create your first habit and start a streak today.
            </p>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {habits.map((h) => (
            <li key={h.id}>
              <HabitCard
                habit={h}
                todayISO={today}
                onToggleComplete={handleToggleComplete}
                onEdit={(habit) => setForm({ kind: "edit", habit })}
                onDelete={handleDelete}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

