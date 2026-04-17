"use client";

import { FormEvent, useState } from "react";
import { WidgetShell } from "@/components/WidgetShell";
import { getNextTaskStep, getTaskProgress } from "@/lib/dashboard";
import { Task } from "@/types/dashboard";

type TasksWidgetProps = {
  tasks: Task[];
  today: string;
  onAddTask: (
    title: string,
    kind: "single" | "multi",
    firstStep: string,
    scheduledFor: string | null,
  ) => void;
  onAddStep: (taskId: string, title: string) => void;
  onCompleteTask: (taskId: string) => void;
  onCompleteStep: (taskId: string, stepId: string) => void;
};

export function TasksWidget({
  tasks,
  today,
  onAddTask,
  onAddStep,
  onCompleteTask,
  onCompleteStep,
}: TasksWidgetProps) {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<"single" | "multi">("single");
  const [firstStep, setFirstStep] = useState("");
  const [markForToday, setMarkForToday] = useState(true);
  const [stepDrafts, setStepDrafts] = useState<Record<string, string>>({});

  function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    onAddTask(trimmed, kind, firstStep.trim(), markForToday ? today : null);
    setTitle("");
    setFirstStep("");
    setKind("single");
    setMarkForToday(true);
  }

  function submitStep(event: FormEvent<HTMLFormElement>, taskId: string) {
    event.preventDefault();
    const draft = stepDrafts[taskId]?.trim();
    if (!draft) {
      return;
    }
    onAddStep(taskId, draft);
    setStepDrafts((current) => ({ ...current, [taskId]: "" }));
  }

  return (
    <WidgetShell
      eyebrow="Tasks"
      title="One-time tasks or tiny step plans"
      description="Keep it simple. Regular tasks can be single and bigger projects can hold steps."
      theme="peach"
      icon="tasks"
    >
      <form className="space-y-3 rounded-xl bg-orange-50/70 p-4 ring-1 ring-orange-100/80" onSubmit={submitTask}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to get done?"
          className="soft-input"
        />
        <div className="grid gap-3 sm:grid-cols-[150px_1fr_auto]">
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value as "single" | "multi")}
            className="soft-input"
          >
            <option value="single">One-time task</option>
            <option value="multi">Multi-step task</option>
          </select>
          <input
            value={firstStep}
            onChange={(event) => setFirstStep(event.target.value)}
            placeholder="Optional first tiny step"
            className="soft-input"
          />
          <button type="submit" className="soft-button">
            Save task
          </button>
        </div>
        <label className="flex items-center gap-3 rounded-xl bg-white/72 px-4 py-3 text-sm text-slate-700 ring-1 ring-orange-100/80">
          <input
            type="checkbox"
            checked={markForToday}
            onChange={(event) => setMarkForToday(event.target.checked)}
          />
          Show this in Today View
        </label>
      </form>

      <div className="mt-6 space-y-4">
        {tasks.length === 0 ? (
          <div className="rounded-[1.3rem] border border-dashed border-orange-200/85 bg-white/65 px-4 py-5 text-sm leading-7 text-slate-600">
            No tasks yet. Add one task, or start with a tiny first step if that feels easier.
          </div>
        ) : null}
        {tasks.map((task) => {
          const nextStep = getNextTaskStep(task);
          const progress = getTaskProgress(task);

          return (
            <div key={task.id} className="rounded-xl border border-orange-100/80 bg-white/78 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-medium text-slate-800">{task.title}</p>
                  {task.scheduledFor === today ? (
                    <span className="mt-2 inline-flex rounded-full bg-orange-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-700">
                      Today
                    </span>
                  ) : null}
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {task.kind === "single"
                      ? task.completed
                        ? "Completed"
                        : "One-time task"
                      : nextStep
                        ? `Next step: ${nextStep.title}`
                        : "All steps complete"}
                  </p>
                </div>
                <div className="min-w-24 text-sm font-semibold text-slate-600">{progress}%</div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-orange-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-300 to-rose-200 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {task.kind === "single" ? (
                <button
                  type="button"
                  onClick={() => onCompleteTask(task.id)}
                  disabled={task.completed}
                  className="soft-button mt-5 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {task.completed ? "Completed" : "Mark done"}
                </button>
              ) : (
                <div className="mt-5 space-y-4">
                  {nextStep ? (
                    <div className="rounded-xl bg-orange-50/70 p-4 ring-1 ring-orange-100">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-600">
                        Just do this one thing
                      </p>
                      <p className="mt-3 text-base font-medium leading-7 text-slate-700">
                        {nextStep.title}
                      </p>
                      <button
                        type="button"
                        onClick={() => onCompleteStep(task.id, nextStep.id)}
                        className="soft-button mt-4"
                      >
                        I did this
                      </button>
                    </div>
                  ) : null}

                  <form
                    className="flex flex-col gap-3 sm:flex-row"
                    onSubmit={(event) => submitStep(event, task.id)}
                  >
                    <input
                      value={stepDrafts[task.id] ?? ""}
                      onChange={(event) =>
                        setStepDrafts((current) => ({
                          ...current,
                          [task.id]: event.target.value,
                        }))
                      }
                      placeholder="Add another tiny step"
                      className="soft-input flex-1"
                    />
                    <button type="submit" className="soft-button-secondary">
                      Add step
                    </button>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </WidgetShell>
  );
}
