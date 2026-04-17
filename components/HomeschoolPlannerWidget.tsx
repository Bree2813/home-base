"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";
import { WidgetShell } from "@/components/WidgetShell";
import { getSchoolYearStart, todayKey } from "@/lib/dashboard";
import {
  HomeschoolAttendanceEntry,
  HomeschoolAttendanceStatus,
  HomeschoolCalendarEntry,
  HomeschoolCalendarEntryType,
  HomeschoolChild,
  HomeschoolMonthPlan,
  HomeschoolProject,
  HomeschoolSchoolYearPlan,
  HomeschoolSubject,
  HomeschoolUnitPlan,
  HomeschoolYearPlan,
} from "@/types/dashboard";

type HomeschoolPlannerWidgetProps = {
  children: HomeschoolChild[];
  selectedChildId: string | null;
  schoolYears: HomeschoolSchoolYearPlan[];
  selectedSchoolYear: string;
  calendarEntries: HomeschoolCalendarEntry[];
  subjects: HomeschoolSubject[];
  yearlyPlans: HomeschoolYearPlan[];
  monthlyPlans: HomeschoolMonthPlan[];
  unitPlans: HomeschoolUnitPlan[];
  attendanceEntries: HomeschoolAttendanceEntry[];
  projects: HomeschoolProject[];
  onAddChild: (entry: Omit<HomeschoolChild, "id">) => void;
  onSelectChild: (childId: string) => void;
  onAddSchoolYear: (entry: Omit<HomeschoolSchoolYearPlan, "id">) => void;
  onSelectSchoolYear: (schoolYear: string) => void;
  onSaveCalendarEntry: (
    entry: Omit<HomeschoolCalendarEntry, "id">,
    editingId?: string,
  ) => void;
  onRemoveCalendarEntry: (entryId: string) => void;
  onSaveSubject: (entry: Omit<HomeschoolSubject, "id">, editingId?: string) => void;
  onRemoveSubject: (subjectId: string) => void;
  onSaveMonthPlan: (entry: Omit<HomeschoolMonthPlan, "id">, editingId?: string) => void;
  onRemoveMonthPlan: (planId: string) => void;
  onSaveProject: (entry: Omit<HomeschoolProject, "id">, editingId?: string) => void;
  onRemoveProject: (projectId: string) => void;
  onAddYearPlan: (entry: Omit<HomeschoolYearPlan, "id">) => void;
  onAddUnitPlan: (entry: Omit<HomeschoolUnitPlan, "id">) => void;
  onAddAttendance: (entry: Omit<HomeschoolAttendanceEntry, "id">) => void;
  onRemoveAttendance: (attendanceId: string) => void;
};

type SubjectDraft = {
  editingId?: string;
  subject: string;
  curriculumName: string;
  gradeLevel: string;
  notes: string;
};

type MonthDraft = {
  editingId?: string;
  month: string;
  subject: string;
  focusTopic: string;
  resources: string;
  notes: string;
};

type ProjectDraft = {
  editingId?: string;
  name: string;
  neededSupplies: string;
  ownedSupplies: string;
  notes: string;
};

type CalendarDraft = {
  editingId?: string;
  date: string;
  type: HomeschoolCalendarEntryType;
  title: string;
  notes: string;
};

function PlannerSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] bg-white/88 p-5 shadow-[0_16px_32px_rgba(148,163,184,0.1)] ring-1 ring-violet-100/70">
      <div className="flex items-start gap-3">
        <span className="mt-1 h-10 w-1.5 rounded-full bg-gradient-to-b from-violet-200 via-fuchsia-200 to-violet-100" />
        <div>
          <h3 className="text-[1.15rem] font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SummaryPill({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-[1.1rem] bg-white/92 px-4 py-3 text-sm text-slate-700 shadow-[0_8px_18px_rgba(148,163,184,0.08)] ring-1 ring-violet-100/80">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-violet-200 bg-gradient-to-br from-violet-50/95 via-white to-fuchsia-50/70 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function resetSubjectDraft(): SubjectDraft {
  return {
    editingId: undefined,
    subject: "",
    curriculumName: "",
    gradeLevel: "",
    notes: "",
  };
}

function resetMonthDraft(): MonthDraft {
  return {
    editingId: undefined,
    month: "September",
    subject: "",
    focusTopic: "",
    resources: "",
    notes: "",
  };
}

function resetProjectDraft(): ProjectDraft {
  return {
    editingId: undefined,
    name: "",
    neededSupplies: "",
    ownedSupplies: "",
    notes: "",
  };
}

function resetCalendarDraft(): CalendarDraft {
  return {
    editingId: undefined,
    date: todayKey(),
    type: "school day",
    title: "",
    notes: "",
  };
}

const attendanceStatuses: HomeschoolAttendanceStatus[] = [
  "school day completed",
  "light learning day",
  "field trip",
  "sick day",
  "day off",
];

const calendarTypes: HomeschoolCalendarEntryType[] = [
  "school day",
  "holiday",
  "break",
  "field trip",
  "day off",
  "special event",
];

const calendarTone: Record<HomeschoolCalendarEntryType, string> = {
  "school day": "bg-sky-100/95 text-sky-800 ring-1 ring-sky-200/80",
  holiday: "bg-rose-100/95 text-rose-800 ring-1 ring-rose-200/80",
  break: "bg-amber-100/95 text-amber-800 ring-1 ring-amber-200/80",
  "field trip": "bg-emerald-100/95 text-emerald-800 ring-1 ring-emerald-200/80",
  "day off": "bg-slate-100/95 text-slate-800 ring-1 ring-slate-200/80",
  "special event": "bg-violet-100/95 text-violet-800 ring-1 ring-violet-200/80",
};

const schoolMonths = [
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
];

export function HomeschoolPlannerWidget({
  children,
  selectedChildId,
  schoolYears,
  selectedSchoolYear,
  calendarEntries,
  subjects,
  yearlyPlans,
  monthlyPlans,
  unitPlans,
  attendanceEntries,
  projects,
  onAddChild,
  onSelectChild,
  onAddSchoolYear,
  onSelectSchoolYear,
  onSaveCalendarEntry,
  onRemoveCalendarEntry,
  onSaveSubject,
  onRemoveSubject,
  onSaveMonthPlan,
  onRemoveMonthPlan,
  onSaveProject,
  onRemoveProject,
  onAddYearPlan,
  onAddUnitPlan,
  onAddAttendance,
  onRemoveAttendance,
}: HomeschoolPlannerWidgetProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"planner" | "attendance" | "year">("planner");
  const [showExtraPlanning, setShowExtraPlanning] = useState(false);
  const [childDraft, setChildDraft] = useState({ name: "", gradeLevel: "", notes: "" });
  const [subjectDraft, setSubjectDraft] = useState<SubjectDraft>(resetSubjectDraft);
  const [monthDraft, setMonthDraft] = useState<MonthDraft>(resetMonthDraft);
  const [projectDraft, setProjectDraft] = useState<ProjectDraft>(resetProjectDraft);
  const [calendarDraft, setCalendarDraft] = useState<CalendarDraft>(resetCalendarDraft);
  const [attendanceForm, setAttendanceForm] = useState({
    date: todayKey(),
    status: "school day completed" as HomeschoolAttendanceStatus,
    notes: "",
  });
  const [scheduleCopyMessage, setScheduleCopyMessage] = useState("");
  const [schoolYearForm, setSchoolYearForm] = useState({
    schoolYear: selectedSchoolYear || "2026-2027",
    startDate: getSchoolYearStart(todayKey()),
    endDate: `${Number(getSchoolYearStart(todayKey()).slice(0, 4)) + 1}-05-31`,
  });
  const [yearForm, setYearForm] = useState({
    subject: "",
    yearlyGoals: "",
    curriculumResource: "",
    notes: "",
  });
  const [unitForm, setUnitForm] = useState({
    unitTitle: "",
    subject: "",
    objectives: "",
    activities: "",
    materials: "",
    notes: "",
  });

  const selectedChild = children.find((child) => child.id === selectedChildId) ?? null;
  const selectedSchoolYearConfig =
    schoolYears.find((entry) => entry.schoolYear === selectedSchoolYear) ?? null;
  const plannedSchoolDays = calendarEntries.filter((entry) => entry.type === "school day").length;
  const remainingSchoolDays = calendarEntries.filter(
    (entry) => entry.type === "school day" && entry.date >= todayKey(),
  ).length;
  const sharedScheduleCount = calendarEntries.filter((entry) =>
    ["holiday", "break", "field trip", "day off", "special event"].includes(entry.type),
  ).length;

  const summary = useMemo(() => {
    const today = todayKey();
    const schoolYearStart = selectedSchoolYearConfig?.startDate || getSchoolYearStart(today);
    const schoolYearEnd =
      selectedSchoolYearConfig?.endDate ||
      `${Number(schoolYearStart.slice(0, 4)) + 1}-07-31`;
    const currentMonthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      new Date(`${today}T00:00:00`),
    );
    const monthFocusItems = monthlyPlans.filter((entry) => entry.month === currentMonthName);
    const attendedToday = attendanceEntries.some((entry) => entry.date === today);
    const upcomingCalendar = [...calendarEntries]
      .filter((entry) => entry.date >= today)
      .sort((left, right) => left.date.localeCompare(right.date))[0];

    return {
      children: children.length,
      childName: selectedChild?.name ?? "",
      subjects: subjects.length,
      attendanceThisMonth: attendanceEntries.filter((entry) =>
        entry.date.startsWith(today.slice(0, 7)),
      ).length,
      attendanceThisYear: attendanceEntries.filter(
        (entry) => entry.date >= schoolYearStart && entry.date <= schoolYearEnd,
      ).length,
      monthFocusItems,
      attendedToday,
      upcomingCalendar,
    };
  }, [attendanceEntries, calendarEntries, children.length, monthlyPlans, selectedChild?.name, selectedSchoolYearConfig?.endDate, selectedSchoolYearConfig?.startDate, subjects.length]);

  function submitChild(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!childDraft.name.trim()) {
      return;
    }

    onAddChild({
      name: childDraft.name.trim(),
      gradeLevel: childDraft.gradeLevel.trim(),
      notes: childDraft.notes.trim(),
    });
    setChildDraft({ name: "", gradeLevel: "", notes: "" });
  }

  function submitSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedChildId || !subjectDraft.subject.trim()) {
      return;
    }

    onSaveSubject(
      {
        childId: selectedChildId,
        subject: subjectDraft.subject.trim(),
        curriculumName: subjectDraft.curriculumName.trim(),
        gradeLevel: subjectDraft.gradeLevel.trim(),
        notes: subjectDraft.notes.trim(),
        materialsNeeded: "",
      },
      subjectDraft.editingId,
    );

    setSubjectDraft(resetSubjectDraft());
  }

  function submitMonthPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedChildId || !monthDraft.subject.trim()) {
      return;
    }

    onSaveMonthPlan(
      {
        childId: selectedChildId,
        month: monthDraft.month,
        subject: monthDraft.subject.trim(),
        focusTopic: monthDraft.focusTopic.trim(),
        resources: monthDraft.resources.trim(),
        notes: monthDraft.notes.trim(),
      },
      monthDraft.editingId,
    );

    setMonthDraft(resetMonthDraft());
  }

  function submitProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedChildId || !projectDraft.name.trim()) {
      return;
    }

    onSaveProject(
      {
        childId: selectedChildId,
        name: projectDraft.name.trim(),
        category: "",
        neededSupplies: projectDraft.neededSupplies.trim(),
        ownedSupplies: projectDraft.ownedSupplies.trim(),
        notes: projectDraft.notes.trim(),
        targetDate: "",
      },
      projectDraft.editingId,
    );

    setProjectDraft(resetProjectDraft());
  }

  function submitAttendance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedChildId || !attendanceForm.date) {
      return;
    }

    onAddAttendance({
      childId: selectedChildId,
      date: attendanceForm.date,
      status: attendanceForm.status,
      notes: attendanceForm.notes.trim(),
    });

    setAttendanceForm({
      date: todayKey(),
      status: "school day completed",
      notes: "",
    });
  }

  function submitSchoolYear(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!schoolYearForm.schoolYear.trim() || !schoolYearForm.startDate || !schoolYearForm.endDate) {
      return;
    }

    onAddSchoolYear({
      schoolYear: schoolYearForm.schoolYear.trim(),
      startDate: schoolYearForm.startDate,
      endDate: schoolYearForm.endDate,
    });
  }

  function submitCalendarEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!calendarDraft.date || !selectedSchoolYear) {
      return;
    }

    onSaveCalendarEntry(
      {
        schoolYear: selectedSchoolYear,
        date: calendarDraft.date,
        type: calendarDraft.type,
        title: calendarDraft.title.trim(),
        notes: calendarDraft.notes.trim(),
      },
      calendarDraft.editingId,
    );

    setCalendarDraft(resetCalendarDraft());
  }

  function submitYearPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedChildId || !yearForm.subject.trim()) {
      return;
    }

    onAddYearPlan({
      childId: selectedChildId,
      subject: yearForm.subject.trim(),
      yearlyGoals: yearForm.yearlyGoals.trim(),
      curriculumResource: yearForm.curriculumResource.trim(),
      notes: yearForm.notes.trim(),
    });

    setYearForm({ subject: "", yearlyGoals: "", curriculumResource: "", notes: "" });
  }

  function submitUnitPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedChildId || !unitForm.unitTitle.trim() || !unitForm.subject.trim()) {
      return;
    }

    onAddUnitPlan({
      childId: selectedChildId,
      unitTitle: unitForm.unitTitle.trim(),
      subject: unitForm.subject.trim(),
      objectives: unitForm.objectives.trim(),
      activities: unitForm.activities.trim(),
      materials: unitForm.materials.trim(),
      notes: unitForm.notes.trim(),
    });

    setUnitForm({
      unitTitle: "",
      subject: "",
      objectives: "",
      activities: "",
      materials: "",
      notes: "",
    });
  }

  function markTodayAttended() {
    if (!selectedChildId) {
      return;
    }

    onAddAttendance({
      childId: selectedChildId,
      date: todayKey(),
      status: "school day completed",
      notes: "",
    });
  }

  function copyHolidayScheduleToAllChildren() {
    if (children.length === 0) {
      setScheduleCopyMessage("Add a child first, and this shared year schedule will follow them too.");
      return;
    }

    if (sharedScheduleCount === 0) {
      setScheduleCopyMessage("Add a holiday, break, or special date first, then it will be shared across every child.");
      return;
    }

    setScheduleCopyMessage(
      `Done. ${sharedScheduleCount} shared year-planning item${sharedScheduleCount === 1 ? "" : "s"} already apply to all ${children.length} child${children.length === 1 ? "" : "ren"}.`,
    );
  }

  return (
    <WidgetShell
      eyebrow="Homeschool"
      title="Homeschool planner"
      description="A calm, family-friendly place for multiple children, curriculum plans, attendance, and the school year at a glance."
      theme="lavender"
      icon="homeschool"
    >
      <div className="rounded-[1.7rem] bg-gradient-to-br from-violet-50/95 via-white to-fuchsia-50/82 p-6 shadow-[0_18px_36px_rgba(148,163,184,0.12)] ring-1 ring-violet-100/80">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-600">
              Homeschool summary
            </p>
            <p className="mt-2 text-[1.45rem] font-semibold tracking-tight text-slate-900">
              {selectedChild ? `${selectedChild.name}'s calm planning space` : "A calm homeschool home base"}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              See the big picture first, then open the details only when you want to plan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="soft-button-secondary self-start"
          >
            {expanded ? "Hide homeschool details" : "Open homeschool planner"}
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryPill label="children" value={summary.children} />
          <SummaryPill label="selected child" value={summary.childName || "Choose a child"} />
          <SummaryPill label="subjects" value={summary.subjects} />
          <SummaryPill label="attendance this month" value={summary.attendanceThisMonth} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[1.4rem] bg-white/86 p-4 ring-1 ring-violet-100/80">
            <p className="text-sm font-semibold text-slate-800">This month at a glance</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {summary.monthFocusItems.length > 0
                ? summary.monthFocusItems
                    .slice(0, 2)
                    .map((entry) => `${entry.subject}: ${entry.focusTopic || "Focus to be added"}`)
                    .join(" | ")
                : "Monthly focus items will show up here once you add them."}
            </p>
          </div>
          <div className="rounded-[1.4rem] bg-white/86 p-4 ring-1 ring-violet-100/80">
            <p className="text-sm font-semibold text-slate-800">Upcoming homeschool rhythm</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {summary.upcomingCalendar
                ? `${summary.upcomingCalendar.title || summary.upcomingCalendar.type} on ${summary.upcomingCalendar.date}`
                : "Add holidays, breaks, or special days and they will show up here."}
            </p>
          </div>
        </div>
      </div>

      {expanded ? (
        <div className="mt-5 space-y-5">
          <PlannerSection
            title="Children"
            description="Add each child once, then switch between them with one tap."
          >
            {children.length === 0 ? (
              <EmptyState
                title="No children added yet"
                description="Start with one child profile, and this planner will give each child their own calm place for curriculum, attendance, and year planning."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {children.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => onSelectChild(child.id)}
                    className={
                      selectedChildId === child.id
                        ? "rounded-[1.35rem] border border-violet-200 bg-gradient-to-br from-violet-100 via-white to-fuchsia-100 px-4 py-4 text-left shadow-[0_14px_26px_rgba(167,139,250,0.16)] transition hover:-translate-y-0.5"
                        : "rounded-[1.35rem] border border-white/80 bg-white/88 px-4 py-4 text-left shadow-[0_10px_20px_rgba(148,163,184,0.08)] transition hover:-translate-y-0.5 hover:border-violet-100"
                    }
                  >
                    <p className="text-base font-semibold text-slate-900">{child.name}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {child.gradeLevel || "Grade level can be added later"}
                    </p>
                    {child.notes ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {child.notes}
                      </p>
                    ) : null}
                    {selectedChildId === child.id ? (
                      <span className="mt-3 inline-flex rounded-full bg-violet-200/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-800">
                        Selected
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            )}

            <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={submitChild}>
              <input
                className="soft-input"
                placeholder="Child name"
                value={childDraft.name}
                onChange={(event) =>
                  setChildDraft((current) => ({ ...current, name: event.target.value }))
                }
              />
              <input
                className="soft-input"
                placeholder="Grade level"
                value={childDraft.gradeLevel}
                onChange={(event) =>
                  setChildDraft((current) => ({ ...current, gradeLevel: event.target.value }))
                }
              />
              <textarea
                className="soft-input min-h-24 sm:col-span-2"
                placeholder="Optional notes"
                value={childDraft.notes}
                onChange={(event) =>
                  setChildDraft((current) => ({ ...current, notes: event.target.value }))
                }
              />
              <button type="submit" className="soft-button sm:col-span-2">
                Add child
              </button>
            </form>
          </PlannerSection>

          {selectedChild ? (
            <>
              <div className="rounded-[1.4rem] bg-white/72 p-2 shadow-[0_10px_24px_rgba(148,163,184,0.08)] ring-1 ring-violet-100/80">
                <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={
                    activeTab === "planner"
                      ? "rounded-2xl bg-violet-200/85 px-4 py-3 text-sm font-semibold text-violet-900 shadow-[0_10px_22px_rgba(167,139,250,0.16)]"
                      : "rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white/80"
                  }
                  onClick={() => setActiveTab("planner")}
                >
                  Curriculum Planner
                </button>
                <button
                  type="button"
                  className={
                    activeTab === "attendance"
                      ? "rounded-2xl bg-violet-200/85 px-4 py-3 text-sm font-semibold text-violet-900 shadow-[0_10px_22px_rgba(167,139,250,0.16)]"
                      : "rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white/80"
                  }
                  onClick={() => setActiveTab("attendance")}
                >
                  Attendance
                </button>
                <button
                  type="button"
                  className={
                    activeTab === "year"
                      ? "rounded-2xl bg-violet-200/85 px-4 py-3 text-sm font-semibold text-violet-900 shadow-[0_10px_22px_rgba(167,139,250,0.16)]"
                      : "rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white/80"
                  }
                  onClick={() => setActiveTab("year")}
                >
                  Year at a Glance
                </button>
                </div>
              </div>

              {activeTab === "planner" ? (
                <>
                  <PlannerSection
                    title="Subject list"
                    description={`Curriculum notes and subject plans for ${selectedChild.name}.`}
                  >
                    <form className="grid gap-3 sm:grid-cols-2" onSubmit={submitSubject}>
                      <input
                        className="soft-input"
                        placeholder="Subject"
                        value={subjectDraft.subject}
                        onChange={(event) =>
                          setSubjectDraft((current) => ({ ...current, subject: event.target.value }))
                        }
                      />
                      <input
                        className="soft-input"
                        placeholder="Curriculum name"
                        value={subjectDraft.curriculumName}
                        onChange={(event) =>
                          setSubjectDraft((current) => ({
                            ...current,
                            curriculumName: event.target.value,
                          }))
                        }
                      />
                      <input
                        className="soft-input"
                        placeholder="Grade level"
                        value={subjectDraft.gradeLevel}
                        onChange={(event) =>
                          setSubjectDraft((current) => ({ ...current, gradeLevel: event.target.value }))
                        }
                      />
                      <div className="hidden sm:block" />
                      <textarea
                        className="soft-input min-h-24 sm:col-span-2"
                        placeholder="Notes"
                        value={subjectDraft.notes}
                        onChange={(event) =>
                          setSubjectDraft((current) => ({ ...current, notes: event.target.value }))
                        }
                      />
                      <div className="flex gap-3 sm:col-span-2 sm:justify-end">
                        {subjectDraft.editingId ? (
                          <button
                            type="button"
                            className="soft-button-secondary"
                            onClick={() => setSubjectDraft(resetSubjectDraft())}
                          >
                            Cancel
                          </button>
                        ) : null}
                        <button type="submit" className="soft-button">
                          {subjectDraft.editingId ? "Save subject" : "Add subject"}
                        </button>
                      </div>
                    </form>

                    <div className="mt-4 space-y-3">
                      {subjects.length === 0 ? (
                        <p className="text-sm leading-6 text-slate-500">
                          No subjects yet for {selectedChild.name}. Start with one and keep it light.
                        </p>
                      ) : null}

                      {subjects.map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-2xl bg-violet-50/80 p-4 ring-1 ring-violet-100"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-base font-medium text-slate-900">{entry.subject}</p>
                              <p className="mt-1 text-sm text-slate-600">
                                {entry.curriculumName || "No curriculum listed yet"}
                                {entry.gradeLevel ? ` - ${entry.gradeLevel}` : ""}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="soft-button-secondary"
                                onClick={() =>
                                  setSubjectDraft({
                                    editingId: entry.id,
                                    subject: entry.subject,
                                    curriculumName: entry.curriculumName,
                                    gradeLevel: entry.gradeLevel,
                                    notes: entry.notes,
                                  })
                                }
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="soft-button-secondary"
                                onClick={() => onRemoveSubject(entry.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          {entry.notes ? (
                            <p className="mt-3 text-sm leading-7 text-slate-600">{entry.notes}</p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </PlannerSection>

                  <PlannerSection
                    title="Monthly planning"
                    description="Keep the current month easy to scan and gentle to adjust."
                  >
                    <form className="grid gap-3 sm:grid-cols-2" onSubmit={submitMonthPlan}>
                      <select
                        className="soft-input"
                        value={monthDraft.month}
                        onChange={(event) =>
                          setMonthDraft((current) => ({ ...current, month: event.target.value }))
                        }
                      >
                        {schoolMonths.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <input
                        className="soft-input"
                        placeholder="Subject"
                        value={monthDraft.subject}
                        onChange={(event) =>
                          setMonthDraft((current) => ({ ...current, subject: event.target.value }))
                        }
                      />
                      <input
                        className="soft-input sm:col-span-2"
                        placeholder="Focus or topic"
                        value={monthDraft.focusTopic}
                        onChange={(event) =>
                          setMonthDraft((current) => ({ ...current, focusTopic: event.target.value }))
                        }
                      />
                      <input
                        className="soft-input sm:col-span-2"
                        placeholder="Resources"
                        value={monthDraft.resources}
                        onChange={(event) =>
                          setMonthDraft((current) => ({ ...current, resources: event.target.value }))
                        }
                      />
                      <textarea
                        className="soft-input min-h-24 sm:col-span-2"
                        placeholder="Notes"
                        value={monthDraft.notes}
                        onChange={(event) =>
                          setMonthDraft((current) => ({ ...current, notes: event.target.value }))
                        }
                      />
                      <div className="flex gap-3 sm:col-span-2 sm:justify-end">
                        {monthDraft.editingId ? (
                          <button
                            type="button"
                            className="soft-button-secondary"
                            onClick={() => setMonthDraft(resetMonthDraft())}
                          >
                            Cancel
                          </button>
                        ) : null}
                        <button type="submit" className="soft-button">
                          {monthDraft.editingId ? "Save month plan" : "Add month plan"}
                        </button>
                      </div>
                    </form>

                    <div className="mt-4 space-y-3">
                      {monthlyPlans.length === 0 ? (
                        <p className="text-sm leading-6 text-slate-500">
                          No monthly plans yet for {selectedChild.name}.
                        </p>
                      ) : null}
                      {monthlyPlans.map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-2xl bg-violet-50/76 p-4 ring-1 ring-violet-100"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-700">
                                {entry.month}
                              </p>
                              <p className="mt-2 text-base font-medium text-slate-900">{entry.subject}</p>
                              <p className="mt-2 text-sm leading-7 text-slate-700">
                                {entry.focusTopic || "No focus yet"}
                              </p>
                              {entry.resources ? (
                                <p className="mt-2 text-sm leading-7 text-slate-600">
                                  <span className="font-medium text-slate-800">Resources:</span>{" "}
                                  {entry.resources}
                                </p>
                              ) : null}
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="soft-button-secondary"
                                onClick={() =>
                                  setMonthDraft({
                                    editingId: entry.id,
                                    month: entry.month,
                                    subject: entry.subject,
                                    focusTopic: entry.focusTopic,
                                    resources: entry.resources,
                                    notes: entry.notes,
                                  })
                                }
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="soft-button-secondary"
                                onClick={() => onRemoveMonthPlan(entry.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          {entry.notes ? (
                            <p className="mt-3 rounded-xl bg-white/72 px-3 py-3 text-sm leading-7 text-slate-600 ring-1 ring-violet-100">
                              {entry.notes}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </PlannerSection>

                  <PlannerSection
                    title="Projects and crafts"
                    description="Keep hands-on projects attached to the current child without clutter."
                  >
                    <form className="grid gap-3 sm:grid-cols-2" onSubmit={submitProject}>
                      <input
                        className="soft-input sm:col-span-2"
                        placeholder="Project name"
                        value={projectDraft.name}
                        onChange={(event) =>
                          setProjectDraft((current) => ({ ...current, name: event.target.value }))
                        }
                      />
                      <input
                        className="soft-input sm:col-span-2"
                        placeholder="Supplies needed"
                        value={projectDraft.neededSupplies}
                        onChange={(event) =>
                          setProjectDraft((current) => ({
                            ...current,
                            neededSupplies: event.target.value,
                          }))
                        }
                      />
                      <input
                        className="soft-input sm:col-span-2"
                        placeholder="Supplies already owned"
                        value={projectDraft.ownedSupplies}
                        onChange={(event) =>
                          setProjectDraft((current) => ({
                            ...current,
                            ownedSupplies: event.target.value,
                          }))
                        }
                      />
                      <textarea
                        className="soft-input min-h-24 sm:col-span-2"
                        placeholder="Notes"
                        value={projectDraft.notes}
                        onChange={(event) =>
                          setProjectDraft((current) => ({ ...current, notes: event.target.value }))
                        }
                      />
                      <div className="flex gap-3 sm:col-span-2 sm:justify-end">
                        {projectDraft.editingId ? (
                          <button
                            type="button"
                            className="soft-button-secondary"
                            onClick={() => setProjectDraft(resetProjectDraft())}
                          >
                            Cancel
                          </button>
                        ) : null}
                        <button type="submit" className="soft-button">
                          {projectDraft.editingId ? "Save project" : "Add project"}
                        </button>
                      </div>
                    </form>

                    <div className="mt-4 space-y-3">
                      {projects.length === 0 ? (
                        <p className="text-sm leading-6 text-slate-500">
                          No projects yet for {selectedChild.name}.
                        </p>
                      ) : null}
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="rounded-2xl bg-violet-50/76 p-4 ring-1 ring-violet-100"
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-base font-medium text-slate-900">{project.name}</p>
                              {project.neededSupplies ? (
                                <p className="mt-2 text-sm leading-7 text-slate-600">
                                  <span className="font-medium text-slate-800">Needed:</span>{" "}
                                  {project.neededSupplies}
                                </p>
                              ) : null}
                              {project.ownedSupplies ? (
                                <p className="mt-1 text-sm leading-7 text-slate-600">
                                  <span className="font-medium text-slate-800">Owned:</span>{" "}
                                  {project.ownedSupplies}
                                </p>
                              ) : null}
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="soft-button-secondary"
                                onClick={() =>
                                  setProjectDraft({
                                    editingId: project.id,
                                    name: project.name,
                                    neededSupplies: project.neededSupplies,
                                    ownedSupplies: project.ownedSupplies,
                                    notes: project.notes,
                                  })
                                }
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="soft-button-secondary"
                                onClick={() => onRemoveProject(project.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          {project.notes ? (
                            <p className="mt-3 text-sm leading-7 text-slate-600">{project.notes}</p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </PlannerSection>

                  <PlannerSection
                    title="Optional extra planning"
                    description="Only open this if you want a little more detail for the year or a special unit."
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm leading-6 text-slate-600">
                        These sections stay tucked away so the main planner can stay light.
                      </p>
                      <button
                        type="button"
                        className="soft-button-secondary"
                        onClick={() => setShowExtraPlanning((current) => !current)}
                      >
                        {showExtraPlanning ? "Hide extra planning" : "Show extra planning"}
                      </button>
                    </div>

                    {showExtraPlanning ? (
                      <div className="mt-4 space-y-5">
                        <div className="rounded-2xl bg-violet-50/70 p-4 ring-1 ring-violet-100">
                          <p className="text-base font-medium text-slate-900">Yearly overview</p>
                          <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={submitYearPlan}>
                            <input
                              className="soft-input"
                              placeholder="Subject"
                              value={yearForm.subject}
                              onChange={(event) =>
                                setYearForm((current) => ({ ...current, subject: event.target.value }))
                              }
                            />
                            <input
                              className="soft-input"
                              placeholder="Main curriculum or resource"
                              value={yearForm.curriculumResource}
                              onChange={(event) =>
                                setYearForm((current) => ({
                                  ...current,
                                  curriculumResource: event.target.value,
                                }))
                              }
                            />
                            <textarea
                              className="soft-input min-h-24 sm:col-span-2"
                              placeholder="Yearly goals"
                              value={yearForm.yearlyGoals}
                              onChange={(event) =>
                                setYearForm((current) => ({ ...current, yearlyGoals: event.target.value }))
                              }
                            />
                            <textarea
                              className="soft-input min-h-24 sm:col-span-2"
                              placeholder="Notes"
                              value={yearForm.notes}
                              onChange={(event) =>
                                setYearForm((current) => ({ ...current, notes: event.target.value }))
                              }
                            />
                            <button type="submit" className="soft-button sm:col-span-2">
                              Add yearly note
                            </button>
                          </form>

                          <div className="mt-4 space-y-3">
                            {yearlyPlans.map((entry) => (
                              <div
                                key={entry.id}
                                className="rounded-2xl bg-white/85 p-4 ring-1 ring-violet-100"
                              >
                                <p className="text-base font-medium text-slate-900">{entry.subject}</p>
                                <p className="mt-2 text-sm leading-7 text-slate-600">{entry.yearlyGoals}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl bg-violet-50/70 p-4 ring-1 ring-violet-100">
                          <p className="text-base font-medium text-slate-900">Unit plans</p>
                          <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={submitUnitPlan}>
                            <input
                              className="soft-input"
                              placeholder="Unit title"
                              value={unitForm.unitTitle}
                              onChange={(event) =>
                                setUnitForm((current) => ({ ...current, unitTitle: event.target.value }))
                              }
                            />
                            <input
                              className="soft-input"
                              placeholder="Subject"
                              value={unitForm.subject}
                              onChange={(event) =>
                                setUnitForm((current) => ({ ...current, subject: event.target.value }))
                              }
                            />
                            <textarea
                              className="soft-input min-h-24 sm:col-span-2"
                              placeholder="Objectives"
                              value={unitForm.objectives}
                              onChange={(event) =>
                                setUnitForm((current) => ({ ...current, objectives: event.target.value }))
                              }
                            />
                            <textarea
                              className="soft-input min-h-24 sm:col-span-2"
                              placeholder="Activities"
                              value={unitForm.activities}
                              onChange={(event) =>
                                setUnitForm((current) => ({ ...current, activities: event.target.value }))
                              }
                            />
                            <input
                              className="soft-input sm:col-span-2"
                              placeholder="Materials"
                              value={unitForm.materials}
                              onChange={(event) =>
                                setUnitForm((current) => ({ ...current, materials: event.target.value }))
                              }
                            />
                            <textarea
                              className="soft-input min-h-24 sm:col-span-2"
                              placeholder="Notes"
                              value={unitForm.notes}
                              onChange={(event) =>
                                setUnitForm((current) => ({ ...current, notes: event.target.value }))
                              }
                            />
                            <button type="submit" className="soft-button sm:col-span-2">
                              Add unit plan
                            </button>
                          </form>
                        </div>
                      </div>
                    ) : null}
                  </PlannerSection>
                </>
              ) : null}

              {activeTab === "attendance" ? (
                <PlannerSection
                  title="Attendance"
                  description={`Simple attendance tracking for ${selectedChild.name}.`}
                >
                  <div className="mb-4 flex flex-col gap-3 rounded-2xl bg-violet-50/76 p-4 ring-1 ring-violet-100 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">Quick mark for today</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {summary.attendedToday
                          ? "Today is already marked."
                          : "Tap once to record a homeschool day for today."}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="soft-button"
                      onClick={markTodayAttended}
                      disabled={summary.attendedToday}
                    >
                      {summary.attendedToday ? "Marked today" : "Mark today attended"}
                    </button>
                  </div>

                  <form className="grid gap-3 sm:grid-cols-2" onSubmit={submitAttendance}>
                    <input
                      type="date"
                      className="soft-input"
                      value={attendanceForm.date}
                      onChange={(event) =>
                        setAttendanceForm((current) => ({ ...current, date: event.target.value }))
                      }
                    />
                    <select
                      className="soft-input"
                      value={attendanceForm.status}
                      onChange={(event) =>
                        setAttendanceForm((current) => ({
                          ...current,
                          status: event.target.value as HomeschoolAttendanceStatus,
                        }))
                      }
                    >
                      {attendanceStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <textarea
                      className="soft-input min-h-24 sm:col-span-2"
                      placeholder="Optional notes for the day"
                      value={attendanceForm.notes}
                      onChange={(event) =>
                        setAttendanceForm((current) => ({ ...current, notes: event.target.value }))
                      }
                    />
                    <button type="submit" className="soft-button sm:col-span-2">
                      Save attendance
                    </button>
                  </form>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-violet-50/70 p-4 ring-1 ring-violet-100">
                      <p className="text-sm font-medium text-slate-700">Attendance this month</p>
                      <p className="mt-2 text-3xl font-medium text-slate-900">
                        {summary.attendanceThisMonth}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-violet-50/70 p-4 ring-1 ring-violet-100">
                      <p className="text-sm font-medium text-slate-700">Attendance this school year</p>
                      <p className="mt-2 text-3xl font-medium text-slate-900">
                        {summary.attendanceThisYear}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {attendanceEntries.length === 0 ? (
                      <p className="text-sm leading-6 text-slate-500">
                        No attendance logged yet for {selectedChild.name}. Use the quick button above when you finish a school day.
                      </p>
                    ) : null}
                    {attendanceEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-2xl bg-violet-50/76 p-4 ring-1 ring-violet-100"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-base font-medium text-slate-900">{entry.date}</p>
                            <p className="mt-1 text-sm text-slate-600">{entry.status}</p>
                            {entry.notes ? (
                              <p className="mt-2 text-sm leading-7 text-slate-600">{entry.notes}</p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            className="soft-button-secondary"
                            onClick={() => onRemoveAttendance(entry.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </PlannerSection>
              ) : null}

              {activeTab === "year" ? (
                <>
                  <PlannerSection
                    title="School year planning"
                    description="Choose a school year, set the dates, and keep holidays or events visible without making the app feel rigid."
                  >
                    <div className="mb-4 flex flex-wrap gap-2">
                      {schoolYears.map((entry) => (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => onSelectSchoolYear(entry.schoolYear)}
                          className={
                            selectedSchoolYear === entry.schoolYear
                              ? "rounded-full bg-violet-200/85 px-4 py-2.5 text-sm font-semibold text-violet-900 shadow-[0_10px_22px_rgba(167,139,250,0.14)]"
                              : "rounded-full bg-white/90 px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-violet-100 transition hover:bg-violet-50/80"
                          }
                        >
                          {entry.schoolYear}
                        </button>
                      ))}
                    </div>

                    <form className="grid gap-3 sm:grid-cols-3" onSubmit={submitSchoolYear}>
                      <input
                        className="soft-input"
                        placeholder="School year"
                        value={schoolYearForm.schoolYear}
                        onChange={(event) =>
                          setSchoolYearForm((current) => ({
                            ...current,
                            schoolYear: event.target.value,
                          }))
                        }
                      />
                      <input
                        type="date"
                        className="soft-input"
                        value={schoolYearForm.startDate}
                        onChange={(event) =>
                          setSchoolYearForm((current) => ({
                            ...current,
                            startDate: event.target.value,
                          }))
                        }
                      />
                      <input
                        type="date"
                        className="soft-input"
                        value={schoolYearForm.endDate}
                        onChange={(event) =>
                          setSchoolYearForm((current) => ({
                            ...current,
                            endDate: event.target.value,
                          }))
                        }
                      />
                      <button type="submit" className="soft-button sm:col-span-3">
                        Save school year dates
                      </button>
                    </form>

                    {selectedSchoolYearConfig ? (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-[1.35rem] bg-sky-50/90 p-4 ring-1 ring-sky-100">
                          <p className="text-sm font-medium text-slate-700">Start date</p>
                          <p className="mt-2 text-base font-medium text-slate-900">
                            {selectedSchoolYearConfig.startDate}
                          </p>
                        </div>
                        <div className="rounded-[1.35rem] bg-rose-50/88 p-4 ring-1 ring-rose-100">
                          <p className="text-sm font-medium text-slate-700">End date</p>
                          <p className="mt-2 text-base font-medium text-slate-900">
                            {selectedSchoolYearConfig.endDate}
                          </p>
                        </div>
                        <div className="rounded-[1.35rem] bg-violet-50/88 p-4 ring-1 ring-violet-100">
                          <p className="text-sm font-medium text-slate-700">Planned school days</p>
                          <p className="mt-2 text-2xl font-semibold text-slate-900">
                            {plannedSchoolDays}
                          </p>
                        </div>
                        <div className="rounded-[1.35rem] bg-amber-50/90 p-4 ring-1 ring-amber-100">
                          <p className="text-sm font-medium text-slate-700">Remaining school days</p>
                          <p className="mt-2 text-2xl font-semibold text-slate-900">
                            {remainingSchoolDays}
                          </p>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-4 rounded-[1.35rem] bg-gradient-to-br from-violet-50/95 via-white to-fuchsia-50/75 p-4 ring-1 ring-violet-100/80">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Shared family schedule
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            Holidays, breaks, field trips, and special year dates in this calendar are shared across all children so you only need to enter them once.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="soft-button self-start"
                          onClick={copyHolidayScheduleToAllChildren}
                        >
                          Copy holiday/break schedule to all children
                        </button>
                      </div>
                      {scheduleCopyMessage ? (
                        <p className="mt-3 text-sm leading-6 text-violet-800">
                          {scheduleCopyMessage}
                        </p>
                      ) : null}
                    </div>

                    <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={submitCalendarEntry}>
                      <input
                        type="date"
                        className="soft-input"
                        value={calendarDraft.date}
                        onChange={(event) =>
                          setCalendarDraft((current) => ({ ...current, date: event.target.value }))
                        }
                      />
                      <select
                        className="soft-input"
                        value={calendarDraft.type}
                        onChange={(event) =>
                          setCalendarDraft((current) => ({
                            ...current,
                            type: event.target.value as HomeschoolCalendarEntryType,
                          }))
                        }
                      >
                        {calendarTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <input
                        className="soft-input sm:col-span-2"
                        placeholder="Title or label"
                        value={calendarDraft.title}
                        onChange={(event) =>
                          setCalendarDraft((current) => ({ ...current, title: event.target.value }))
                        }
                      />
                      <textarea
                        className="soft-input min-h-24 sm:col-span-2"
                        placeholder="Optional notes"
                        value={calendarDraft.notes}
                        onChange={(event) =>
                          setCalendarDraft((current) => ({ ...current, notes: event.target.value }))
                        }
                      />
                      <button type="submit" className="soft-button sm:col-span-2">
                        {calendarDraft.editingId ? "Save calendar item" : "Add year-planning item"}
                      </button>
                    </form>
                  </PlannerSection>

                  <PlannerSection
                    title="Year at a glance"
                    description="A soft monthly overview for school days, breaks, holidays, field trips, and special events."
                  >
                    <div className="mb-5 flex flex-wrap gap-2">
                      {calendarTypes.map((type) => (
                        <span
                          key={type}
                          className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${calendarTone[type]}`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {schoolMonths.map((month) => {
                        const monthEntries = calendarEntries.filter((entry) => {
                          const entryMonth = new Intl.DateTimeFormat("en-US", {
                            month: "long",
                          }).format(new Date(`${entry.date}T00:00:00`));
                          return entryMonth === month;
                        });

                        return (
                          <div
                            key={month}
                            className="rounded-[1.45rem] bg-gradient-to-br from-violet-50/95 via-white to-fuchsia-50/70 p-4 shadow-[0_12px_24px_rgba(148,163,184,0.08)] ring-1 ring-violet-100/80"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-base font-semibold text-slate-900">{month}</p>
                              <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-violet-100/80">
                                {monthEntries.length} item{monthEntries.length === 1 ? "" : "s"}
                              </span>
                            </div>
                            <div className="mt-3 space-y-2">
                              {monthEntries.length === 0 ? (
                                <div className="rounded-[1.1rem] border border-dashed border-violet-200 bg-white/72 p-3 text-sm text-slate-500">
                                  Nothing planned yet for this month.
                                </div>
                              ) : (
                                monthEntries.map((entry) => (
                                  <div
                                    key={entry.id}
                                    className="rounded-[1.15rem] bg-white/88 p-3.5 shadow-[0_8px_18px_rgba(148,163,184,0.08)] ring-1 ring-violet-100/80"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                          {entry.title || entry.type}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-slate-500">
                                          {entry.date}
                                        </p>
                                      </div>
                                      <div className="flex flex-col items-end gap-2">
                                        <span
                                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${calendarTone[entry.type]}`}
                                        >
                                          {entry.type}
                                        </span>
                                        <button
                                          type="button"
                                          className="soft-button-secondary px-3 py-2 text-xs"
                                          onClick={() => onRemoveCalendarEntry(entry.id)}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                    {entry.notes ? (
                                      <p className="mt-2 text-sm leading-6 text-slate-600">
                                        {entry.notes}
                                      </p>
                                    ) : null}
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </PlannerSection>
                </>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}
    </WidgetShell>
  );
}

