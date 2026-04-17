"use client";

import { FormEvent, useMemo, useState } from "react";
import { WidgetShell } from "@/components/WidgetShell";
import { Habit } from "@/types/dashboard";

type DailyHabitsWidgetProps = {
  habits: Habit[];
  today: string;
  onAddHabit: (title: string) => void;
  onCompleteHabit: (habitId: string) => void;
};

export function DailyHabitsWidget({
  habits,
  today,
  onAddHabit,
  onCompleteHabit,
}: DailyHabitsWidgetProps) {
  const [title, setTitle] = useState("");
  const pending = useMemo(
    () => habits.filter((habit) => habit.lastCompletedOn !== today),
    [habits, today],
  );
  const completed = useMemo(
    () => habits.filter((habit) => habit.lastCompletedOn === today),
    [habits, today],
  );

  function submitHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    onAddHabit(trimmed);
    setTitle("");
  }

  return (
    <WidgetShell
      eyebrow="Daily Habits"
      title="Reset each morning"
      description="Tap a habit once and it is done for today."
      theme="blue"
      icon="habits"
    >
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={submitHabit}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a repeating habit"
          className="soft-input flex-1"
        />
        <button type="submit" className="soft-button">
          Save habit
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-3">
        {pending.length === 0 ? (
          <div className="w-full rounded-xl bg-blue-50/80 px-4 py-4 text-sm text-slate-600 ring-1 ring-blue-100">
            You are done with habits for today. Tomorrow they will reset here.
          </div>
        ) : (
          pending.map((habit) => (
            <button
              key={habit.id}
              type="button"
              onClick={() => onCompleteHabit(habit.id)}
              className="group rounded-full bg-blue-50/85 px-4 py-3 text-left ring-1 ring-blue-100 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_18px_rgba(148,163,184,0.14)]"
            >
              <span className="text-sm font-medium text-slate-700">{habit.title}</span>
              <span className="ml-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600 group-hover:bg-blue-50">
                Done
              </span>
            </button>
          ))
        )}
      </div>

      {completed.length > 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
            Completed today
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {completed.map((habit) => (
              <span key={habit.id} className="rounded-full bg-blue-100/70 px-3 py-2 text-sm font-medium text-slate-700">
                {habit.title}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </WidgetShell>
  );
}
