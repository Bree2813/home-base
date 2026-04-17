import { Task } from "@/types/tasks";

const stepTemplates = [
  "Open what you need",
  "Spend 5 minutes getting oriented",
  "Do the smallest useful action",
  "Check what is done and what is left",
];

export function createId() {
  return Math.random().toString(36).slice(2, 10);
}

export function buildTask(title: string): Task {
  return {
    id: createId(),
    title,
    createdAt: new Date().toISOString(),
    steps: stepTemplates.map((label, index) => ({
      id: createId(),
      title: `${label}${index === 2 ? ` for "${title}"` : ""}`,
      completed: false,
    })),
  };
}

export function taskProgress(task: Task) {
  if (task.steps.length === 0) {
    return 0;
  }

  const completedCount = task.steps.filter((step) => step.completed).length;
  return Math.round((completedCount / task.steps.length) * 100);
}

export function nextOpenStep(task: Task) {
  return task.steps.find((step) => !step.completed) ?? null;
}

export function remainingStepCount(task: Task) {
  return task.steps.filter((step) => !step.completed).length;
}

export function makeStepSmaller(stepTitle: string, taskTitle: string) {
  const normalized = stepTitle.toLowerCase();

  if (normalized.includes("clean") || normalized.includes("tidy") || normalized.includes("organize")) {
    return normalized.includes("trash") ? "Pick up 3 items" : "Throw away trash";
  }

  if (normalized.includes("trash")) {
    return "Pick up 3 items";
  }

  if (normalized.includes("pick up") || normalized.includes("declutter")) {
    return "Pick up 3 things from one spot";
  }

  if (normalized.includes("write") || normalized.includes("draft")) {
    return "Write one sentence";
  }

  if (normalized.includes("email") || normalized.includes("message")) {
    return "Open the draft and write the first line";
  }

  if (normalized.includes("read") || normalized.includes("study")) {
    return "Read one paragraph";
  }

  if (normalized.includes("open")) {
    return "Tap or click the file you need";
  }

  if (normalized.includes("plan")) {
    return "Write down one next action";
  }

  return `Open what you need for ${taskTitle.toLowerCase()}`;
}
