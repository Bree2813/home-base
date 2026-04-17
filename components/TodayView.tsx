"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import { AppIcon } from "@/components/AppIcon";
import { getNextTaskStep, getTaskProgress } from "@/lib/dashboard";
import { Habit, MealPlanItem, Task, WidgetKey } from "@/types/dashboard";

type TodayReminder = {
  id: string;
  title: string;
  meta: string;
  notes: string;
  tone: "yellow" | "rose" | "blue";
  status?: "overdue" | "today";
};

type FocusCard = {
  title: string;
  context: string;
  action?: string;
  onPress?: () => void;
};

type HomeschoolFocus = {
  subject: string;
  focusTopic: string;
  resources: string;
  notes: string;
};

type TodayViewProps = {
  greeting: string;
  dateLabel: string;
  encouragement: string;
  habits: Habit[];
  todayKey: string;
  tasks: Task[];
  reminders: TodayReminder[];
  meals: MealPlanItem[];
  homeschoolFocus: HomeschoolFocus | null;
  enabledWidgets: WidgetKey[];
  focusCard: FocusCard;
  lowEnergyMode: boolean;
  onToggleLowEnergyMode: () => void;
  onCompleteHabit: (habitId: string) => void;
  onCompleteTask: (taskId: string) => void;
  onCompleteTaskStep: (taskId: string, stepId: string) => void;
  onAddTask: (title: string, firstStep: string) => void;
  onAddReminder: (title: string, notes: string) => void;
  onAddHabit: (title: string) => void;
  onAddMeal: (meal: string, plan: string, ingredients: string) => void;
};

function TodaySection({
  title,
  description,
  accent,
  icon,
  children,
}: {
  title: string;
  description: string;
  accent: string;
  icon: Parameters<typeof AppIcon>[0]["name"];
  children: ReactNode;
}) {
  return (
    <section className="app-card overflow-hidden bg-white/88">
      <div className={`mb-6 h-1.5 rounded-full bg-gradient-to-r ${accent}`} />
      <div className="flex items-start gap-3.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/88 text-slate-700 ring-1 ring-slate-200/80 shadow-[0_10px_24px_rgba(148,163,184,0.08)]">
          <AppIcon name={icon} className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[1.55rem] font-semibold tracking-[-0.02em] text-slate-900">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function SoftEmpty({ children, tint }: { children: ReactNode; tint: string }) {
  return (
    <p className={`rounded-2xl px-4 py-4 text-sm leading-7 text-slate-600 ring-1 ${tint}`}>
      {children}
    </p>
  );
}

export function TodayView({
  greeting,
  dateLabel,
  encouragement,
  habits,
  todayKey,
  tasks,
  reminders,
  meals,
  homeschoolFocus,
  enabledWidgets,
  focusCard,
  lowEnergyMode,
  onToggleLowEnergyMode,
  onCompleteHabit,
  onCompleteTask,
  onCompleteTaskStep,
  onAddTask,
  onAddReminder,
  onAddHabit,
  onAddMeal,
}: TodayViewProps) {
  const [quickAddType, setQuickAddType] = useState<"task" | "reminder" | "habit" | "meal">(
    "task",
  );
  const [taskTitle, setTaskTitle] = useState("");
  const [taskStep, setTaskStep] = useState("");
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderNotes, setReminderNotes] = useState("");
  const [habitTitle, setHabitTitle] = useState("");
  const [mealType, setMealType] = useState("Dinner");
  const [mealPlan, setMealPlan] = useState("");
  const [mealIngredients, setMealIngredients] = useState("");

  const pendingHabits = useMemo(
    () => habits.filter((habit) => habit.lastCompletedOn !== todayKey),
    [habits, todayKey],
  );
  const completedHabits = useMemo(
    () => habits.filter((habit) => habit.lastCompletedOn === todayKey),
    [habits, todayKey],
  );

  function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!taskTitle.trim()) {
      return;
    }
    onAddTask(taskTitle.trim(), taskStep.trim());
    setTaskTitle("");
    setTaskStep("");
  }

  function submitReminder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reminderTitle.trim()) {
      return;
    }
    onAddReminder(reminderTitle.trim(), reminderNotes.trim());
    setReminderTitle("");
    setReminderNotes("");
  }

  function submitHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!habitTitle.trim()) {
      return;
    }
    onAddHabit(habitTitle.trim());
    setHabitTitle("");
  }

  function submitMeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mealPlan.trim()) {
      return;
    }
    onAddMeal(mealType, mealPlan.trim(), mealIngredients.trim());
    setMealPlan("");
    setMealIngredients("");
    setMealType("Dinner");
  }

  return (
    <div className="mx-auto max-w-[780px] space-y-7">
      <section className="app-card overflow-hidden bg-gradient-to-br from-white via-sky-50/82 to-violet-50/80">
        <div className="mb-6 h-1.5 rounded-full bg-gradient-to-r from-sky-300 via-emerald-200 to-violet-200" />
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">
              Today View
            </p>
            <h1 className="mt-4 text-[2.35rem] font-semibold leading-[1.02] tracking-[-0.03em] text-slate-900 sm:text-[3rem]">
              {greeting}
            </h1>
            <p className="mt-3 text-base font-medium text-slate-600">{dateLabel}</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              This view helps you see what matters today without having to sort through the whole dashboard.
            </p>
            </div>
            <button
              type="button"
              onClick={onToggleLowEnergyMode}
              className={
                lowEnergyMode
                  ? "soft-button min-w-[170px]"
                  : "soft-button-secondary min-w-[170px]"
              }
            >
              {lowEnergyMode ? "Low energy mode: on" : "Low energy mode: off"}
            </button>
          </div>

          <div className="rounded-[1.5rem] bg-white/82 p-5 ring-1 ring-white/85 shadow-[0_14px_32px_rgba(148,163,184,0.1)]">
            <p className="text-sm leading-7 text-slate-700">{encouragement}</p>
            {lowEnergyMode ? (
              <div className="mt-3 rounded-[1.1rem] bg-sky-50/75 px-4 py-3 text-sm leading-7 text-slate-600 ring-1 ring-sky-100">
                Showing fewer things, easier next steps, and a softer pace for today.
              </div>
            ) : tasks.length === 0 && reminders.length === 0 && habits.length === 0 ? (
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Start by adding one task, habit, or reminder in Quick add.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="app-card overflow-hidden bg-gradient-to-br from-sky-100/88 via-white to-violet-100/78 shadow-[0_24px_54px_rgba(125,165,255,0.18)]">
        <div className="mb-6 h-1.5 rounded-full bg-gradient-to-r from-sky-300 via-violet-200 to-blue-200" />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">
              Focus Now
            </p>
            <div className="mt-4 rounded-[1.5rem] bg-white/88 p-5 ring-1 ring-sky-100 shadow-[0_16px_34px_rgba(125,165,255,0.12)]">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-700">
                Just do this one thing
              </p>
              <h2 className="mt-3 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-slate-900 sm:text-[2.35rem]">
                {focusCard.title}
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-8 text-slate-650">
                {focusCard.context}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-start">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/92 text-sky-700 ring-1 ring-sky-200 shadow-[0_14px_28px_rgba(125,165,255,0.14)]">
              <AppIcon name="tasks" className="h-5 w-5" />
            </span>
          </div>
        </div>
        {focusCard.action && focusCard.onPress ? (
          <button type="button" className="soft-button mt-6 min-w-[190px]" onClick={focusCard.onPress}>
            {focusCard.action.includes("done") ? "Mark done" : "Start this"}
          </button>
        ) : null}
      </section>

      <TodaySection
        title="Quick add"
        description="Drop one thing into today without opening the full dashboard."
        accent="from-blue-300 via-violet-200 to-emerald-200"
        icon="tasks"
      >
        <div className="mb-5 flex flex-wrap gap-2.5">
          {([
            ["task", "Task"],
            ["reminder", "Reminder"],
            ["habit", "Habit"],
            ["meal", "Meal"],
          ] as const)
            .filter(([type]) => {
              if (type === "task") {
                return enabledWidgets.includes("tasks");
              }
              if (type === "reminder") {
                return enabledWidgets.includes("reminders");
              }
              if (type === "habit") {
                return enabledWidgets.includes("habits");
              }
              return enabledWidgets.includes("meals");
            })
            .map(([type, label]) => (
              <button
                key={type}
                type="button"
                onClick={() => setQuickAddType(type)}
                className={quickAddType === type ? "soft-button" : "soft-button-secondary"}
              >
                {label}
              </button>
            ))}
        </div>

        <div className="rounded-[1.4rem] bg-slate-50/72 p-4 ring-1 ring-slate-200/70">
          {quickAddType === "task" ? (
            <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={submitTask}>
              <input
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                placeholder="Task for today"
                className="soft-input"
              />
              <input
                value={taskStep}
                onChange={(event) => setTaskStep(event.target.value)}
                placeholder="Optional first tiny step"
                className="soft-input"
              />
              <button type="submit" className="soft-button">
                Add task
              </button>
            </form>
          ) : null}

          {quickAddType === "reminder" ? (
            <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={submitReminder}>
              <input
                value={reminderTitle}
                onChange={(event) => setReminderTitle(event.target.value)}
                placeholder="Reminder for today"
                className="soft-input"
              />
              <input
                value={reminderNotes}
                onChange={(event) => setReminderNotes(event.target.value)}
                placeholder="Optional note"
                className="soft-input"
              />
              <button type="submit" className="soft-button">
                Add reminder
              </button>
            </form>
          ) : null}

          {quickAddType === "habit" ? (
            <form className="flex flex-col gap-3 sm:flex-row" onSubmit={submitHabit}>
              <input
                value={habitTitle}
                onChange={(event) => setHabitTitle(event.target.value)}
                placeholder="New daily habit"
                className="soft-input flex-1"
              />
              <button type="submit" className="soft-button">
                Add habit
              </button>
            </form>
          ) : null}

          {quickAddType === "meal" ? (
            <form className="grid gap-3 sm:grid-cols-[140px_1fr_auto]" onSubmit={submitMeal}>
              <select
                value={mealType}
                onChange={(event) => setMealType(event.target.value)}
                className="soft-input"
              >
                {["Breakfast", "Lunch", "Dinner", "Snack"].map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
              <input
                value={mealPlan}
                onChange={(event) => setMealPlan(event.target.value)}
                placeholder="Meal name"
                className="soft-input"
              />
              <button type="submit" className="soft-button">
                Add meal
              </button>
              <input
                value={mealIngredients}
                onChange={(event) => setMealIngredients(event.target.value)}
                placeholder="Ingredients list, comma separated"
                className="soft-input sm:col-span-3"
              />
            </form>
          ) : null}
        </div>
      </TodaySection>

      {enabledWidgets.includes("homeschool") ? (
        <TodaySection
          title="Today's homeschool focus"
          description="A simple pull from this month's homeschool plan so you can see the next learning focus without opening the full planner."
          accent="from-violet-300 via-fuchsia-200 to-violet-200"
          icon="homeschool"
        >
          {homeschoolFocus ? (
            <div className="rounded-[1.4rem] bg-violet-50/78 p-5 ring-1 ring-violet-100 shadow-[0_12px_28px_rgba(167,139,250,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-700">
                {homeschoolFocus.subject}
              </p>
              <p className="mt-3 text-lg font-semibold leading-8 text-slate-900">
                {homeschoolFocus.focusTopic || "Focus to be added"}
              </p>
              {homeschoolFocus.resources ? (
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  <span className="font-medium text-slate-800">Resources:</span>{" "}
                  {homeschoolFocus.resources}
                </p>
              ) : null}
              {homeschoolFocus.notes ? (
                <p className="mt-3 rounded-xl bg-white/78 px-4 py-3 text-sm leading-7 text-slate-600 ring-1 ring-violet-100">
                  {homeschoolFocus.notes}
                </p>
              ) : null}
            </div>
          ) : (
            <SoftEmpty tint="bg-violet-50/70 ring-violet-100">
              No homeschool focus is planned for this month yet. Add one monthly plan and it will show up here.
            </SoftEmpty>
          )}
        </TodaySection>
      ) : null}

      {enabledWidgets.includes("tasks") ? (
        <TodaySection
          title="Today's tasks"
          description="Keep your attention on the next available step instead of the full list."
          accent="from-orange-300 via-rose-200 to-orange-200"
          icon="tasks"
        >
          {tasks.length === 0 ? (
            <SoftEmpty tint="bg-orange-50/70 ring-orange-100">
              No tasks are marked for today yet. Add one in Quick add or from the dashboard.
            </SoftEmpty>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => {
                const nextStep = getNextTaskStep(task);
                const progress = getTaskProgress(task);

                return (
                  <div
                    key={task.id}
                    className="rounded-[1.4rem] bg-white/82 p-5 ring-1 ring-orange-100 shadow-[0_12px_28px_rgba(251,146,60,0.08)]"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-lg font-semibold text-slate-900">{task.title}</p>
                        <p className="mt-2 text-sm text-slate-600">{progress}% complete</p>
                      </div>
                      {task.kind === "single" ? (
                        <button
                          type="button"
                          className="soft-button"
                          onClick={() => onCompleteTask(task.id)}
                        >
                          Mark done
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-orange-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-300 to-rose-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {task.kind === "multi" && nextStep ? (
                      <div className="mt-4 rounded-[1.25rem] bg-orange-50/88 p-4 ring-1 ring-orange-100">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-700">
                          Just do this one thing
                        </p>
                        <p className="mt-3 text-base font-medium leading-7 text-slate-800">
                          {nextStep.title}
                        </p>
                        <button
                          type="button"
                          className="soft-button mt-4"
                          onClick={() => onCompleteTaskStep(task.id, nextStep.id)}
                        >
                          I did this
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </TodaySection>
      ) : null}

      {enabledWidgets.includes("habits") ? (
        <TodaySection
          title="Daily habits"
          description="A small visible reset for the habits that matter today."
          accent="from-sky-300 via-blue-200 to-sky-200"
          icon="habits"
        >
          <div className="mb-5 rounded-[1.35rem] bg-blue-50/78 px-4 py-4 text-sm text-slate-700 ring-1 ring-blue-100 shadow-[0_10px_22px_rgba(96,165,250,0.08)]">
            {completedHabits.length} of {habits.length} done today
          </div>

          {pendingHabits.length === 0 ? (
            <SoftEmpty tint="bg-blue-50/70 ring-blue-100">
              Habits are finished for today. You can leave this section alone now.
            </SoftEmpty>
          ) : (
            <div className="flex flex-wrap gap-3">
              {pendingHabits.map((habit) => (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() => onCompleteHabit(habit.id)}
                  className="rounded-full bg-blue-50/95 px-4 py-3 text-left ring-1 ring-blue-100 shadow-[0_10px_20px_rgba(96,165,250,0.08)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <span className="text-sm font-medium text-slate-700">{habit.title}</span>
                </button>
              ))}
            </div>
          )}

          {completedHabits.length > 0 ? (
            <div className="mt-5 rounded-[1.35rem] border border-dashed border-blue-200/85 bg-white/55 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
                Completed today
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {completedHabits.map((habit) => (
                  <span
                    key={habit.id}
                    className="rounded-full bg-blue-100/80 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {habit.title}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </TodaySection>
      ) : null}

      {enabledWidgets.includes("reminders") ||
      enabledWidgets.includes("bills") ||
      enabledWidgets.includes("appointments") ? (
        <TodaySection
          title="Reminders for today"
          description="Only the things due or happening today."
          accent="from-yellow-300 via-amber-200 to-rose-200"
          icon="reminders"
        >
          {reminders.length === 0 ? (
            <SoftEmpty tint="bg-yellow-50/70 ring-yellow-100">
              Nothing is due today. This space stays quiet until something needs your attention.
            </SoftEmpty>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`flex items-start gap-3 rounded-[1.35rem] p-4 ring-1 ${
                    reminder.tone === "rose"
                      ? "bg-rose-50/72 ring-rose-100"
                      : reminder.tone === "blue"
                        ? "bg-blue-50/72 ring-blue-100"
                        : "bg-yellow-50/72 ring-yellow-100"
                  }`}
                >
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/82 text-slate-700 ring-1 ring-white/85">
                    <AppIcon
                      name={
                        reminder.tone === "rose"
                          ? "bills"
                          : reminder.tone === "blue"
                            ? "appointments"
                            : "reminders"
                      }
                      className="h-3.5 w-3.5"
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-medium text-slate-900">{reminder.title}</p>
                      {reminder.status === "overdue" ? (
                        <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-700">
                          Overdue
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{reminder.meta}</p>
                    {reminder.notes ? (
                      <p className="mt-2 text-sm leading-7 text-slate-600">{reminder.notes}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TodaySection>
      ) : null}

      {enabledWidgets.includes("meals") ? (
        <TodaySection
          title="Meals for today"
          description="Only the meals planned for today, if you want them in view."
          accent="from-emerald-300 via-lime-200 to-emerald-200"
          icon="meals"
        >
          {meals.length === 0 ? (
            <SoftEmpty tint="bg-emerald-50/70 ring-emerald-100">
              No meals are planned for today. Add one only if it would make today easier.
            </SoftEmpty>
          ) : (
            <div className="space-y-3">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="rounded-[1.35rem] bg-emerald-50/72 p-4 ring-1 ring-emerald-100"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    {meal.meal}
                  </p>
                  <p className="mt-2 text-base font-medium text-slate-900">{meal.plan}</p>
                  {meal.ingredients.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {meal.ingredients.map((ingredient) => (
                        <span
                          key={`${meal.id}-${ingredient}`}
                          className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-emerald-100"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </TodaySection>
      ) : null}
    </div>
  );
}
