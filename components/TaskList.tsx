"use client";

import { ProgressBar } from "@/components/ProgressBar";
import { nextOpenStep, remainingStepCount, taskProgress } from "@/lib/tasks";
import { Task } from "@/types/tasks";

type TaskListProps = {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onCompleteStep: (taskId: string, stepId: string) => void;
  onStuck: (taskId: string, stepId: string) => void;
};

export function TaskList({
  tasks,
  selectedTaskId,
  onSelectTask,
  onCompleteStep,
  onStuck,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-4xl border border-dashed border-ink/15 bg-white/60 p-8 text-center">
        <h3 className="text-xl font-semibold text-ink">No tasks yet</h3>
        <p className="mt-2 text-sm leading-6 text-ink/65">
          Add one task and the app will help you turn it into something approachable.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {tasks.map((task) => {
        const progress = taskProgress(task);
        const activeStep = nextOpenStep(task);
        const isSelected = task.id === selectedTaskId;
        const remainingCount = remainingStepCount(task);

        return (
          <section
            key={task.id}
            className={`rounded-4xl p-6 shadow-soft ring-1 transition ${
              isSelected ? "bg-white ring-coral/40" : "bg-white/85 ring-black/5"
            }`}
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => onSelectTask(task.id)}
                  className="text-left"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
                    Task
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-ink">{task.title}</h3>
                </button>
                <p className="text-sm text-ink/65">
                  {remainingCount === 0
                    ? "Complete"
                    : `${remainingCount} small ${remainingCount === 1 ? "step" : "steps"} left`}
                </p>
              </div>

              <div className="w-full max-w-xs">
                <ProgressBar value={progress} />
              </div>
            </div>

            {isSelected ? (
              <div className="mt-6">
                {activeStep ? (
                  <div className="rounded-[2rem] border border-coral/30 bg-gradient-to-br from-coral/8 via-white to-butter/20 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
                      Just do this one thing
                    </p>
                    <p className="mt-4 text-2xl font-semibold leading-10 text-ink">
                      {activeStep.title}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-ink/65">
                      Nothing else needs your attention right now.
                    </p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => onCompleteStep(task.id, activeStep.id)}
                        className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
                      >
                        I did this
                      </button>
                      <button
                        type="button"
                        onClick={() => onStuck(task.id, activeStep.id)}
                        className="rounded-2xl border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-canvas"
                      >
                        Stuck? Make it smaller
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[2rem] border border-mint/40 bg-mint/20 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink/60">
                      All done
                    </p>
                    <p className="mt-3 text-xl font-semibold text-ink">
                      You finished every step for this task.
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
