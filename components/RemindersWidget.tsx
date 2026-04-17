"use client";

import { FormEvent, useState } from "react";
import { WidgetShell } from "@/components/WidgetShell";
import { formatDateLabel } from "@/lib/dashboard";
import { Reminder } from "@/types/dashboard";

type RemindersWidgetProps = {
  reminders: Reminder[];
  onAddReminder: (
    title: string,
    dueDate: string,
    recurring: Reminder["recurring"],
    notes: string,
  ) => void;
};

export function RemindersWidget({ reminders, onAddReminder }: RemindersWidgetProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recurring, setRecurring] = useState<Reminder["recurring"]>("none");
  const [notes, setNotes] = useState("");

  function submitReminder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || !dueDate) {
      return;
    }

    onAddReminder(trimmed, dueDate, recurring, notes.trim());
    setTitle("");
    setDueDate("");
    setRecurring("none");
    setNotes("");
  }

  return (
    <WidgetShell
      eyebrow="Reminders"
      title="What is due and when"
      description="Keep recurring responsibilities and one-time due dates visible without overloading the page."
      theme="yellow"
      icon="reminders"
    >
      <form
        className="space-y-4 rounded-2xl bg-yellow-50/80 p-5 ring-1 ring-yellow-100"
        onSubmit={submitReminder}
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Reminder title"
          className="soft-input"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="soft-input"
          />
          <select
            value={recurring}
            onChange={(event) => setRecurring(event.target.value as Reminder["recurring"])}
            className="soft-input"
          >
            <option value="none">One time</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button type="submit" className="soft-button">
            Save reminder
          </button>
        </div>
        <input
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional note"
          className="soft-input"
        />
      </form>

      <div className="mt-7 space-y-3">
        {reminders.length === 0 ? (
          <div className="rounded-[1.3rem] border border-dashed border-yellow-200/85 bg-white/65 px-4 py-5 text-sm leading-7 text-slate-600">
            No reminders yet. Add bills, appointments, or recurring chores you do not want to carry in your head.
          </div>
        ) : null}
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="rounded-2xl bg-yellow-50/70 p-5 ring-1 ring-yellow-100"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-medium text-slate-800">{reminder.title}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {formatDateLabel(reminder.dueDate)}
                  {reminder.recurring !== "none" ? ` - ${reminder.recurring}` : ""}
                </p>
              </div>
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">
                Due
              </span>
            </div>
            {reminder.notes ? (
              <p className="mt-3 text-sm leading-7 text-slate-500">{reminder.notes}</p>
            ) : null}
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}
