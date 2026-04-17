"use client";

import { FormEvent, useState } from "react";

type TaskComposerProps = {
  onAddTask: (title: string) => void;
  onAddStep: (taskId: string, title: string) => void;
  selectedTaskId: string | null;
};

export function TaskComposer({
  onAddTask,
  onAddStep,
  selectedTaskId,
}: TaskComposerProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [stepTitle, setStepTitle] = useState("");

  function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = taskTitle.trim();
    if (!trimmed) {
      return;
    }

    onAddTask(trimmed);
    setTaskTitle("");
  }

  function submitStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedTaskId) {
      return;
    }

    const trimmed = stepTitle.trim();
    if (!trimmed) {
      return;
    }

    onAddStep(selectedTaskId, trimmed);
    setStepTitle("");
  }

  return (
    <div className="space-y-5 rounded-4xl bg-white/90 p-6 shadow-soft ring-1 ring-black/5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
          Start Small
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          Capture the big thing on your mind
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          Add one task, then break it down into steps that feel easy to start.
        </p>
      </div>

      <form className="space-y-3" onSubmit={submitTask}>
        <label className="block text-sm font-medium text-ink" htmlFor="task-title">
          Big task
        </label>
        <input
          id="task-title"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
          placeholder="Example: Finish my science project"
          className="w-full rounded-2xl border border-ink/10 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10"
        />
        <button
          type="submit"
          className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
        >
          Add task
        </button>
      </form>

      <form className="space-y-3" onSubmit={submitStep}>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-ink" htmlFor="step-title">
            Add a tiny next step
          </label>
          <span className="text-xs text-ink/55">
            {selectedTaskId ? "Attached to selected task" : "Select a task first"}
          </span>
        </div>
        <input
          id="step-title"
          value={stepTitle}
          onChange={(event) => setStepTitle(event.target.value)}
          placeholder="Example: Open the rubric and highlight what matters"
          disabled={!selectedTaskId}
          className="w-full rounded-2xl border border-ink/10 bg-canvas px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!selectedTaskId}
          className="w-full rounded-2xl bg-coral px-4 py-3 text-sm font-semibold text-white transition hover:bg-coral/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add step
        </button>
      </form>
    </div>
  );
}
