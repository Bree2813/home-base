type DashboardOverviewProps = {
  message: string;
  visibleWidgets: number;
  completedHabits: number;
  totalHabits: number;
  openTasks: number;
};

export function DashboardOverview({
  message,
  visibleWidgets,
  completedHabits,
  totalHabits,
  openTasks,
}: DashboardOverviewProps) {
  return (
    <section className="app-card overflow-hidden bg-gradient-to-br from-white via-blue-50/82 to-orange-50/82">
      <div className="mb-6 h-1.5 rounded-full bg-gradient-to-r from-blue-300 via-emerald-200 to-orange-200" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600">
        Home Base
      </p>
      <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.05] text-slate-900 sm:text-[2.75rem]">
        A calm dashboard for the moving parts of real life.
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
        Keep habits, tasks, reminders, meals, homeschool plans, and home routines in one soft, easy-to-scan place.
      </p>
      <p className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-700">{message}</p>

      {visibleWidgets === 0 ? (
        <div className="mt-6 rounded-[1.35rem] border border-dashed border-slate-200/85 bg-white/60 px-4 py-4 text-sm leading-7 text-slate-600">
          Start by turning on a few cards below, like Tasks, Habits, or Reminders.
        </div>
      ) : null}

      <div className="mt-9 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-blue-50/88 p-5 shadow-[0_8px_22px_rgba(148,163,184,0.08)] ring-1 ring-blue-100/80">
          <p className="text-sm font-medium text-slate-600">Visible widgets</p>
          <p className="mt-2 text-3xl font-medium text-slate-800">{visibleWidgets}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50/88 p-5 shadow-[0_8px_22px_rgba(148,163,184,0.08)] ring-1 ring-emerald-100/80">
          <p className="text-sm font-medium text-slate-600">Habits done today</p>
          <p className="mt-2 text-3xl font-medium text-slate-800">
            {completedHabits}/{totalHabits}
          </p>
        </div>
        <div className="rounded-2xl bg-orange-50/88 p-5 shadow-[0_8px_22px_rgba(148,163,184,0.08)] ring-1 ring-orange-100/80">
          <p className="text-sm font-medium text-slate-600">Open tasks</p>
          <p className="mt-2 text-3xl font-medium text-slate-800">{openTasks}</p>
        </div>
      </div>
    </section>
  );
}
