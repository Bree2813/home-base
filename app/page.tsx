"use client";

import { useEffect, useMemo, useState } from "react";
import { AppointmentsWidget } from "@/components/AppointmentsWidget";
import { BillsWidget } from "@/components/BillsWidget";
import { DashboardCustomizer } from "@/components/DashboardCustomizer";
import { DashboardOverview } from "@/components/DashboardOverview";
import { DailyHabitsWidget } from "@/components/DailyHabitsWidget";
import { EncouragementCard } from "@/components/EncouragementCard";
import { HomeschoolPlannerWidget } from "@/components/HomeschoolPlannerWidget";
import { InventoryWidget } from "@/components/InventoryWidget";
import { MealPlanWidget } from "@/components/MealPlanWidget";
import { ProjectsWidget } from "@/components/ProjectsWidget";
import { RemindersWidget } from "@/components/RemindersWidget";
import { SimpleListWidget } from "@/components/SimpleListWidget";
import { TasksWidget } from "@/components/TasksWidget";
import { TodayView } from "@/components/TodayView";
import {
  addMissingGroceries,
  createId,
  createInitialDashboardState,
  formatLongDateLabel,
  getDashboardMessage,
  getEncouragementDeck,
  getGreetingForTime,
  getHabitCounts,
  getHomeschoolSummary,
  getMonthName,
  getNextTaskStep,
  getSortedReminders,
  getWeekdayName,
  isReminderDueOnDate,
  normalizeDashboardState,
  parseIngredientList,
  todayKey,
} from "@/lib/dashboard";
import {
  DashboardState,
  HomeschoolCalendarEntry,
  HomeschoolChild,
  HomeschoolAttendanceEntry,
  HomeschoolMonthPlan,
  HomeschoolProject,
  HomeschoolSchoolYearPlan,
  HomeschoolSubject,
  HomeschoolUnitPlan,
  HomeschoolYearPlan,
  InventoryItem,
  Reminder,
  WidgetKey,
} from "@/types/dashboard";

const storageKey = "focus-dashboard.state";
const viewStorageKey = "focus-dashboard.view";
const lowEnergyStorageKey = "focus-dashboard.low-energy";

type ChecklistKey =
  | "groceryItems"
  | "cleaningItems"
  | "animalItems"
  | "workItems"
  | "collegeItems";

type InventoryKey =
  | "pantryItems"
  | "fridgeItems"
  | "cleaningSupplyItems"
  | "paperGoodsItems"
  | "animalInventoryItems";

type AppView = "today" | "dashboard";

export default function Home() {
  const [state, setState] = useState<DashboardState>(createInitialDashboardState);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activeView, setActiveView] = useState<AppView>("today");
  const [lowEnergyMode, setLowEnergyMode] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    const savedView = window.localStorage.getItem(viewStorageKey);
    const savedLowEnergyMode = window.localStorage.getItem(lowEnergyStorageKey);
    if (raw) {
      try {
        setState(normalizeDashboardState(JSON.parse(raw)));
      } catch {
        window.localStorage.removeItem(storageKey);
        setState(createInitialDashboardState());
      }
    }
    if (savedView === "today" || savedView === "dashboard") {
      setActiveView(savedView);
    }
    if (savedLowEnergyMode === "true" || savedLowEnergyMode === "false") {
      setLowEnergyMode(savedLowEnergyMode === "true");
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [hasLoaded, state]);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }
    window.localStorage.setItem(viewStorageKey, activeView);
  }, [activeView, hasLoaded]);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }
    window.localStorage.setItem(lowEnergyStorageKey, String(lowEnergyMode));
  }, [hasLoaded, lowEnergyMode]);

  const today = todayKey();
  const habitCounts = getHabitCounts(state.habits);
  const dashboardMessage = useMemo(() => getDashboardMessage(state), [state]);
  const homeschoolSummary = useMemo(() => getHomeschoolSummary(state), [state]);
  const openTasks = state.tasks.filter((task) => !task.completed).length;
  const sortedReminders = useMemo(() => getSortedReminders(state.reminders), [state.reminders]);
  const encouragementDeck = useMemo(
    () => getEncouragementDeck(state.encouragementStyle, state.encouragementMessages),
    [state.encouragementMessages, state.encouragementStyle],
  );
  const encouragementMessage =
    encouragementDeck[state.encouragementIndex % Math.max(encouragementDeck.length, 1)] ??
    dashboardMessage;

  function toggleWidget(widget: WidgetKey) {
    setState((current) => ({
      ...current,
      enabledWidgets: current.enabledWidgets.includes(widget)
        ? current.enabledWidgets.filter((entry) => entry !== widget)
        : [...current.enabledWidgets, widget],
    }));
  }

  function addHabit(title: string) {
    setState((current) => ({
      ...current,
      habits: [...current.habits, { id: createId(), title, lastCompletedOn: null }],
    }));
  }

  function completeHabit(habitId: string) {
    setState((current) => ({
      ...current,
      habits: current.habits.map((habit) =>
        habit.id === habitId ? { ...habit, lastCompletedOn: today } : habit,
      ),
    }));
  }

  function addTask(
    title: string,
    kind: "single" | "multi",
    firstStep: string,
    scheduledFor: string | null,
  ) {
    setState((current) => ({
      ...current,
      tasks: [
        {
          id: createId(),
          title,
          kind,
          completed: false,
          scheduledFor,
          steps:
            kind === "multi" && firstStep
              ? [{ id: createId(), title: firstStep, completed: false }]
              : [],
        },
        ...current.tasks,
      ],
    }));
  }

  function addTaskStep(taskId: string, title: string) {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              kind: "multi",
              steps: [...task.steps, { id: createId(), title, completed: false }],
            }
          : task,
      ),
    }));
  }

  function completeTask(taskId: string) {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task,
      ),
    }));
  }

  function completeTaskStep(taskId: string, stepId: string) {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const nextStep = task.steps.find((step) => !step.completed);
        if (nextStep?.id !== stepId) {
          return task;
        }

        const steps = task.steps.map((step) =>
          step.id === stepId ? { ...step, completed: true } : step,
        );

        return {
          ...task,
          steps,
          completed: steps.length > 0 && steps.every((step) => step.completed),
        };
      }),
    }));
  }

  function addReminder(
    title: string,
    dueDate: string,
    recurring: Reminder["recurring"],
    notes: string,
  ) {
    setState((current) => ({
      ...current,
      reminders: [{ id: createId(), title, dueDate, recurring, notes }, ...current.reminders],
    }));
  }

  function addChecklistItem(key: ChecklistKey, title: string) {
    setState((current) => ({
      ...current,
      [key]: [...current[key], { id: createId(), title, checked: false }],
    }));
  }

  function saveChecklistItem(key: ChecklistKey, itemId: string, title: string) {
    setState((current) => ({
      ...current,
      [key]: current[key].map((item) =>
        item.id === itemId ? { ...item, title } : item,
      ),
    }));
  }

  function removeChecklistItem(key: ChecklistKey, itemId: string) {
    setState((current) => ({
      ...current,
      [key]: current[key].filter((item) => item.id !== itemId),
    }));
  }

  function toggleChecklistItem(key: ChecklistKey, itemId: string) {
    setState((current) => ({
      ...current,
      [key]: current[key].map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item,
      ),
    }));
  }

  function addMeal(day: string, meal: string, plan: string, ingredientsInput: string) {
    const ingredients = parseIngredientList(ingredientsInput);

    setState((current) => {
      const nextMeals = [
        ...current.mealPlans,
        { id: createId(), day, meal, plan, ingredients },
      ];

      return {
        ...current,
        mealPlans: nextMeals,
        groceryItems: current.autoSyncGroceries
          ? addMissingGroceries(current.groceryItems, ingredients)
          : current.groceryItems,
      };
    });
  }

  function toggleAutoSyncGroceries() {
    setState((current) => {
      const nextValue = !current.autoSyncGroceries;
      return {
        ...current,
        autoSyncGroceries: nextValue,
        groceryItems: nextValue
          ? addMissingGroceries(
              current.groceryItems,
              current.mealPlans.flatMap((meal) => meal.ingredients),
            )
          : current.groceryItems,
      };
    });
  }

  function addBill(title: string, amount: string, dueDate: string) {
    setState((current) => ({
      ...current,
      billItems: [...current.billItems, { id: createId(), title, amount, dueDate, paid: false }],
    }));
  }

  function toggleBillPaid(billId: string) {
    setState((current) => ({
      ...current,
      billItems: current.billItems.map((bill) =>
        bill.id === billId ? { ...bill, paid: !bill.paid } : bill,
      ),
    }));
  }

  function addAppointment(title: string, when: string, details: string) {
    setState((current) => ({
      ...current,
      appointments: [...current.appointments, { id: createId(), title, when, details }],
    }));
  }

  function saveHomeschoolSubject(entry: Omit<HomeschoolSubject, "id">, editingId?: string) {
    setState((current) => ({
      ...current,
      homeschoolSubjects: editingId
        ? current.homeschoolSubjects.map((subject) =>
            subject.id === editingId ? { ...subject, ...entry } : subject,
          )
        : [...current.homeschoolSubjects, { id: createId(), ...entry }],
    }));
  }

  function removeHomeschoolSubject(subjectId: string) {
    setState((current) => ({
      ...current,
      homeschoolSubjects: current.homeschoolSubjects.filter(
        (subject) => subject.id !== subjectId,
      ),
    }));
  }

  function addHomeschoolYearPlan(entry: Omit<HomeschoolYearPlan, "id">) {
    setState((current) => ({
      ...current,
      homeschoolYearPlans: [...current.homeschoolYearPlans, { id: createId(), ...entry }],
    }));
  }

  function saveHomeschoolMonthPlan(
    entry: Omit<HomeschoolMonthPlan, "id">,
    editingId?: string,
  ) {
    setState((current) => ({
      ...current,
      homeschoolMonthPlans: editingId
        ? current.homeschoolMonthPlans.map((plan) =>
            plan.id === editingId ? { ...plan, ...entry } : plan,
          )
        : [...current.homeschoolMonthPlans, { id: createId(), ...entry }],
    }));
  }

  function removeHomeschoolMonthPlan(planId: string) {
    setState((current) => ({
      ...current,
      homeschoolMonthPlans: current.homeschoolMonthPlans.filter(
        (plan) => plan.id !== planId,
      ),
    }));
  }

  function addHomeschoolUnitPlan(entry: Omit<HomeschoolUnitPlan, "id">) {
    setState((current) => ({
      ...current,
      homeschoolUnitPlans: [...current.homeschoolUnitPlans, { id: createId(), ...entry }],
    }));
  }

  function addHomeschoolChild(entry: Omit<HomeschoolChild, "id">) {
    const childId = createId();
    setState((current) => ({
      ...current,
      homeschoolChildren: [...current.homeschoolChildren, { id: childId, ...entry }],
      selectedHomeschoolChildId: childId,
    }));
  }

  function selectHomeschoolChild(childId: string) {
    setState((current) => ({
      ...current,
      selectedHomeschoolChildId: childId,
    }));
  }

  function addHomeschoolSchoolYear(entry: Omit<HomeschoolSchoolYearPlan, "id">) {
    setState((current) => ({
      ...current,
      homeschoolSchoolYears: [...current.homeschoolSchoolYears, { id: createId(), ...entry }],
      selectedHomeschoolSchoolYear: entry.schoolYear,
    }));
  }

  function selectHomeschoolSchoolYear(schoolYear: string) {
    setState((current) => ({
      ...current,
      selectedHomeschoolSchoolYear: schoolYear,
    }));
  }

  function saveHomeschoolCalendarEntry(
    entry: Omit<HomeschoolCalendarEntry, "id">,
    editingId?: string,
  ) {
    setState((current) => ({
      ...current,
      homeschoolCalendarEntries: editingId
        ? current.homeschoolCalendarEntries.map((calendarEntry) =>
            calendarEntry.id === editingId ? { ...calendarEntry, ...entry } : calendarEntry,
          )
        : [...current.homeschoolCalendarEntries, { id: createId(), ...entry }],
    }));
  }

  function removeHomeschoolCalendarEntry(entryId: string) {
    setState((current) => ({
      ...current,
      homeschoolCalendarEntries: current.homeschoolCalendarEntries.filter(
        (entry) => entry.id !== entryId,
      ),
    }));
  }

  function addHomeschoolAttendance(entry: Omit<HomeschoolAttendanceEntry, "id">) {
    setState((current) => ({
      ...current,
      homeschoolAttendance: [
        { id: createId(), ...entry },
        ...current.homeschoolAttendance.filter(
          (item) => !(item.childId === entry.childId && item.date === entry.date),
        ),
      ],
    }));
  }

  function removeHomeschoolAttendance(attendanceId: string) {
    setState((current) => ({
      ...current,
      homeschoolAttendance: current.homeschoolAttendance.filter(
        (entry) => entry.id !== attendanceId,
      ),
    }));
  }

  function saveInventoryItem(
    key: InventoryKey,
    entry: Omit<InventoryItem, "id">,
    editingId?: string,
  ) {
    setState((current) => ({
      ...current,
      [key]: editingId
        ? current[key].map((item) =>
            item.id === editingId ? { ...item, ...entry } : item,
          )
        : [...current[key], { id: createId(), ...entry }],
    }));
  }

  function removeInventoryItem(key: InventoryKey, itemId: string) {
    setState((current) => ({
      ...current,
      [key]: current[key].filter((item) => item.id !== itemId),
    }));
  }

  function saveProject(entry: Omit<HomeschoolProject, "id">, editingId?: string) {
    setState((current) => ({
      ...current,
      homeschoolProjects: editingId
        ? current.homeschoolProjects.map((project) =>
            project.id === editingId ? { ...project, ...entry } : project,
          )
        : [...current.homeschoolProjects, { id: createId(), ...entry }],
    }));
  }

  function removeProject(projectId: string) {
    setState((current) => ({
      ...current,
      homeschoolProjects: current.homeschoolProjects.filter(
        (project) => project.id !== projectId,
      ),
    }));
  }

  function nextEncouragementMessage() {
    setState((current) => ({
      ...current,
      encouragementIndex:
        (current.encouragementIndex + 1) %
        Math.max(
          getEncouragementDeck(current.encouragementStyle, current.encouragementMessages).length,
          1,
        ),
    }));
  }

  function changeEncouragementMode(mode: DashboardState["encouragementStyle"]) {
    setState((current) => ({
      ...current,
      encouragementStyle: mode,
      encouragementIndex: 0,
    }));
  }

  function addEncouragementMessage(message: string) {
    setState((current) => {
      const normalized = message.trim();
      const exists = current.encouragementMessages.some(
        (entry) => entry.trim().toLowerCase() === normalized.toLowerCase(),
      );
      if (exists) {
        return current;
      }
      return {
        ...current,
        encouragementMessages: [...current.encouragementMessages, normalized],
      };
    });
  }

  function removeEncouragementMessage(message: string) {
    setState((current) => ({
      ...current,
      encouragementMessages: current.encouragementMessages.filter((entry) => entry !== message),
      encouragementIndex: 0,
    }));
  }

  const widgetViews: Record<WidgetKey, React.ReactNode> = {
    habits: (
      <DailyHabitsWidget
        habits={state.habits}
        today={today}
        onAddHabit={addHabit}
        onCompleteHabit={completeHabit}
      />
    ),
    tasks: (
      <TasksWidget
        tasks={state.tasks}
        today={today}
        onAddTask={addTask}
        onAddStep={addTaskStep}
        onCompleteTask={completeTask}
        onCompleteStep={completeTaskStep}
      />
    ),
    reminders: <RemindersWidget reminders={sortedReminders} onAddReminder={addReminder} />,
    homeschool: (
      <HomeschoolPlannerWidget
        children={state.homeschoolChildren}
        selectedChildId={state.selectedHomeschoolChildId}
        schoolYears={state.homeschoolSchoolYears}
        selectedSchoolYear={state.selectedHomeschoolSchoolYear}
        calendarEntries={state.homeschoolCalendarEntries.filter(
          (entry) => entry.schoolYear === state.selectedHomeschoolSchoolYear,
        )}
        subjects={state.homeschoolSubjects.filter(
          (entry) => entry.childId === state.selectedHomeschoolChildId,
        )}
        yearlyPlans={state.homeschoolYearPlans.filter(
          (entry) => entry.childId === state.selectedHomeschoolChildId,
        )}
        monthlyPlans={state.homeschoolMonthPlans.filter(
          (entry) => entry.childId === state.selectedHomeschoolChildId,
        )}
        unitPlans={state.homeschoolUnitPlans.filter(
          (entry) => entry.childId === state.selectedHomeschoolChildId,
        )}
        attendanceEntries={state.homeschoolAttendance.filter(
          (entry) => entry.childId === state.selectedHomeschoolChildId,
        )}
        projects={state.homeschoolProjects.filter(
          (entry) => entry.childId === state.selectedHomeschoolChildId,
        )}
        onAddChild={addHomeschoolChild}
        onSelectChild={selectHomeschoolChild}
        onAddSchoolYear={addHomeschoolSchoolYear}
        onSelectSchoolYear={selectHomeschoolSchoolYear}
        onSaveCalendarEntry={saveHomeschoolCalendarEntry}
        onRemoveCalendarEntry={removeHomeschoolCalendarEntry}
        onSaveSubject={saveHomeschoolSubject}
        onRemoveSubject={removeHomeschoolSubject}
        onSaveMonthPlan={saveHomeschoolMonthPlan}
        onRemoveMonthPlan={removeHomeschoolMonthPlan}
        onSaveProject={saveProject}
        onRemoveProject={removeProject}
        onAddYearPlan={addHomeschoolYearPlan}
        onAddUnitPlan={addHomeschoolUnitPlan}
        onAddAttendance={addHomeschoolAttendance}
        onRemoveAttendance={removeHomeschoolAttendance}
      />
    ),
    meals: (
      <MealPlanWidget
        meals={state.mealPlans}
        autoSyncGroceries={state.autoSyncGroceries}
        onToggleAutoSync={toggleAutoSyncGroceries}
        onAddMeal={addMeal}
      />
    ),
    groceries: (
      <SimpleListWidget
        eyebrow="Groceries"
        title="Groceries"
        description="A calm grocery list that can optionally sync from meal ingredients."
        items={state.groceryItems}
        addLabel="Add grocery item"
        theme="green"
        icon="groceries"
        onAddItem={(title) => addChecklistItem("groceryItems", title)}
        onToggleItem={(itemId) => toggleChecklistItem("groceryItems", itemId)}
        onSaveItem={(itemId, title) => saveChecklistItem("groceryItems", itemId, title)}
        onRemoveItem={(itemId) => removeChecklistItem("groceryItems", itemId)}
      />
    ),
    pantry: (
      <InventoryWidget
        eyebrow="Pantry"
        title="Pantry"
        description="A simple pantry list with quantities and an easy low-stock flag."
        theme="yellow"
        icon="pantry"
        sections={[
          {
            key: "pantryItems",
            title: "Pantry",
            description: "Shelf-stable food, snacks, and dry goods.",
            items: state.pantryItems,
          },
        ]}
        onSaveItem={(sectionKey, entry, editingId) =>
          saveInventoryItem(sectionKey as InventoryKey, entry, editingId)
        }
        onRemoveItem={(sectionKey, itemId) =>
          removeInventoryItem(sectionKey as InventoryKey, itemId)
        }
      />
    ),
    cleaning: (
      <InventoryWidget
        eyebrow="Cleaning"
        title="Cleaning supplies"
        description="Keep track of soap, detergent, sprays, and other cleaning basics."
        theme="rose"
        icon="cleaning"
        sections={[
          {
            key: "cleaningSupplyItems",
            title: "Cleaning supplies",
            description: "Soap, detergent, sprays, and laundry basics.",
            items: state.cleaningSupplyItems,
          },
        ]}
        onSaveItem={(sectionKey, entry, editingId) =>
          saveInventoryItem(sectionKey as InventoryKey, entry, editingId)
        }
        onRemoveItem={(sectionKey, itemId) =>
          removeInventoryItem(sectionKey as InventoryKey, itemId)
        }
      />
    ),
    household: (
      <InventoryWidget
        eyebrow="Household"
        title="Household items"
        description="Paper goods and everyday home supplies in one clean list."
        theme="blue"
        icon="household"
        sections={[
          {
            key: "paperGoodsItems",
            title: "Household items",
            description: "Paper goods, bathroom supplies, and other home basics.",
            items: state.paperGoodsItems,
          },
        ]}
        onSaveItem={(sectionKey, entry, editingId) =>
          saveInventoryItem(sectionKey as InventoryKey, entry, editingId)
        }
        onRemoveItem={(sectionKey, itemId) =>
          removeInventoryItem(sectionKey as InventoryKey, itemId)
        }
      />
    ),
    animals: (
      <InventoryWidget
        eyebrow="Animals"
        title="Animal feed"
        description="Track feed and other essentials with a quick low-stock warning."
        theme="green"
        icon="animals"
        sections={[
          {
            key: "animalInventoryItems",
            title: "Animal feed",
            description: "Feed and simple supply amounts for pets or farm animals.",
            items: state.animalInventoryItems,
          },
        ]}
        onSaveItem={(sectionKey, entry, editingId) =>
          saveInventoryItem(sectionKey as InventoryKey, entry, editingId)
        }
        onRemoveItem={(sectionKey, itemId) =>
          removeInventoryItem(sectionKey as InventoryKey, itemId)
        }
      />
    ),
    bills: (
      <BillsWidget bills={state.billItems} onAddBill={addBill} onTogglePaid={toggleBillPaid} />
    ),
    appointments: (
      <AppointmentsWidget
        appointments={state.appointments}
        onAddAppointment={addAppointment}
      />
    ),
    projects: (
      <ProjectsWidget
        selectedChildId={state.selectedHomeschoolChildId}
        projects={state.homeschoolProjects.filter(
          (entry) => entry.childId === state.selectedHomeschoolChildId,
        )}
        onSaveProject={saveProject}
        onRemoveProject={removeProject}
      />
    ),
    work: (
      <SimpleListWidget
        eyebrow="Work"
        title="Work dashboard"
        description="Optional work tasks and follow-ups when you want them in view."
        items={state.workItems}
        addLabel="Add work item"
        theme="peach"
        icon="work"
        onAddItem={(title) => addChecklistItem("workItems", title)}
        onToggleItem={(itemId) => toggleChecklistItem("workItems", itemId)}
      />
    ),
    college: (
      <SimpleListWidget
        eyebrow="College"
        title="College dashboard"
        description="Optional coursework and study items in the same calm system."
        items={state.collegeItems}
        addLabel="Add college item"
        theme="lavender"
        icon="college"
        onAddItem={(title) => addChecklistItem("collegeItems", title)}
        onToggleItem={(itemId) => toggleChecklistItem("collegeItems", itemId)}
      />
    ),
  };

  const baseTodayTasks = state.enabledWidgets.includes("tasks")
    ? state.tasks.filter((task) => !task.completed && task.scheduledFor === today)
    : [];
  const baseTodayReminders = [
    ...(state.enabledWidgets.includes("reminders")
      ? state.reminders
          .filter((reminder) => isReminderDueOnDate(reminder, today))
          .map((reminder) => ({
            id: `reminder-${reminder.id}`,
            title: reminder.title,
            meta: reminder.recurring === "none" ? "Reminder" : `Reminder - ${reminder.recurring}`,
            notes: reminder.notes,
            tone: "yellow" as const,
            status: reminder.dueDate < today ? ("overdue" as const) : ("today" as const),
          }))
      : []),
    ...(state.enabledWidgets.includes("bills")
      ? state.billItems
          .filter((bill) => !bill.paid && bill.dueDate <= today)
          .map((bill) => ({
            id: `bill-${bill.id}`,
            title: bill.title,
            meta: `Bill${bill.amount ? ` - ${bill.amount}` : ""}`,
            notes: bill.dueDate < today ? "Overdue" : "Due today",
            tone: "rose" as const,
            status: bill.dueDate < today ? ("overdue" as const) : ("today" as const),
          }))
      : []),
    ...(state.enabledWidgets.includes("appointments")
      ? state.appointments
          .filter((appointment) => appointment.when.slice(0, 10) === today)
          .map((appointment) => ({
            id: `appointment-${appointment.id}`,
            title: appointment.title,
            meta: "Appointment",
            notes: `${appointment.when.replace("T", " ")}${appointment.details ? ` - ${appointment.details}` : ""}`,
            tone: "blue" as const,
            status: "today" as const,
          }))
      : []),
  ];
  const baseTodayMeals = state.enabledWidgets.includes("meals")
    ? state.mealPlans.filter((meal) => meal.day === getWeekdayName(today))
    : [];
  const taskEaseScore = (task: (typeof baseTodayTasks)[number]) => {
    const nextStep = getNextTaskStep(task);
    const nextStepLength = nextStep?.title.trim().length ?? 999;
    return (task.kind === "single" ? 0 : 100) + nextStepLength;
  };
  const sortedTodayTasks = [...baseTodayTasks].sort((left, right) => taskEaseScore(left) - taskEaseScore(right));
  const sortedTodayReminders = [
    ...baseTodayReminders.filter((reminder) => reminder.status === "overdue"),
    ...baseTodayReminders.filter((reminder) => reminder.status !== "overdue"),
  ];
  const todayTasks = lowEnergyMode ? sortedTodayTasks.slice(0, 2) : sortedTodayTasks;
  const todayReminders = lowEnergyMode ? sortedTodayReminders.slice(0, 2) : sortedTodayReminders;
  const todayMeals = lowEnergyMode ? baseTodayMeals.slice(0, 1) : baseTodayMeals;
  const visibleHabits =
    state.enabledWidgets.includes("habits") && lowEnergyMode
      ? [...state.habits.filter((habit) => habit.lastCompletedOn !== today), ...state.habits.filter((habit) => habit.lastCompletedOn === today)].slice(0, 3)
      : state.enabledWidgets.includes("habits")
        ? state.habits
        : [];
  const todayEncouragement = lowEnergyMode
    ? "Low energy is enough. You do not need to do everything today. Let this page stay small, gentle, and doable."
    : encouragementMessage;
  const currentMonthName = getMonthName(today);
  const homeschoolFocus = state.enabledWidgets.includes("homeschool")
    ? state.homeschoolMonthPlans.find(
        (entry) =>
          entry.childId === state.selectedHomeschoolChildId &&
          entry.month === currentMonthName &&
          (entry.focusTopic || entry.subject),
      )
    : undefined;
  const overdueReminder = sortedTodayReminders.find((reminder) => reminder.status === "overdue");
  const dueTodaySingleTask = sortedTodayTasks.find(
    (task) => task.kind === "single" && !task.completed,
  );
  const nextTaskEntry = sortedTodayTasks
    .map((task) => ({ task, step: getNextTaskStep(task) }))
    .find((entry) => entry.task.kind === "multi" && entry.step !== null);
  const pendingHabit = state.enabledWidgets.includes("habits")
    ? state.habits.find((habit) => habit.lastCompletedOn !== today)
    : undefined;
  const focusCard = overdueReminder
    ? {
        title: overdueReminder.title,
        context: `Overdue - ${overdueReminder.meta}`,
      }
    : dueTodaySingleTask
      ? {
          title: dueTodaySingleTask.title,
          context: "Task marked for today",
          action: "Mark task done",
          onPress: () => completeTask(dueTodaySingleTask.id),
        }
      : nextTaskEntry?.step
        ? {
            title: nextTaskEntry.step.title,
            context: nextTaskEntry.task.title,
            action: "Mark this step done",
            onPress: () => completeTaskStep(nextTaskEntry.task.id, nextTaskEntry.step!.id),
          }
        : pendingHabit
          ? {
              title: pendingHabit.title,
              context: "Daily habit",
              action: "Mark habit done",
              onPress: () => completeHabit(pendingHabit.id),
            }
          : {
              title: "Nothing urgent is pulling on you right now.",
              context: "You can take today one gentle step at a time.",
            };

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[900px] space-y-8">
        <nav className="app-card bg-white/85">
          <div className="flex flex-wrap gap-3">
            {(["today", "dashboard"] as const).map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setActiveView(view)}
                className={activeView === view ? "soft-button" : "soft-button-secondary"}
              >
                {view === "today" ? "Today View" : "Dashboard"}
              </button>
            ))}
          </div>
        </nav>

        {activeView === "today" ? (
          <TodayView
            greeting={getGreetingForTime()}
            dateLabel={formatLongDateLabel(today)}
            encouragement={todayEncouragement}
            habits={visibleHabits}
            todayKey={today}
            tasks={todayTasks}
            reminders={todayReminders}
            meals={todayMeals}
            homeschoolFocus={
              homeschoolFocus
                ? {
                    subject: homeschoolFocus.subject,
                    focusTopic: homeschoolFocus.focusTopic,
                    resources: homeschoolFocus.resources,
                    notes: homeschoolFocus.notes,
                  }
                : null
            }
            enabledWidgets={state.enabledWidgets}
            focusCard={focusCard}
            lowEnergyMode={lowEnergyMode}
            onToggleLowEnergyMode={() => setLowEnergyMode((current) => !current)}
            onCompleteHabit={completeHabit}
            onCompleteTask={completeTask}
            onCompleteTaskStep={completeTaskStep}
            onAddTask={(title, firstStep) =>
              addTask(title, firstStep ? "multi" : "single", firstStep, today)
            }
            onAddReminder={(title, notes) => addReminder(title, today, "none", notes)}
            onAddHabit={addHabit}
            onAddMeal={(meal, plan, ingredients) =>
              addMeal(getWeekdayName(today), meal, plan, ingredients)
            }
          />
        ) : (
          <>
            <DashboardOverview
              message={dashboardMessage}
              visibleWidgets={state.enabledWidgets.length}
              completedHabits={habitCounts.done}
              totalHabits={habitCounts.total}
              openTasks={openTasks}
            />

            <div className="space-y-8">
              <DashboardCustomizer enabledWidgets={state.enabledWidgets} onToggle={toggleWidget} />
              <EncouragementCard
                message={encouragementMessage}
                mode={state.encouragementStyle}
                customMessages={state.encouragementMessages}
                onNextMessage={nextEncouragementMessage}
                onModeChange={changeEncouragementMode}
                onAddMessage={addEncouragementMessage}
                onRemoveMessage={removeEncouragementMessage}
              />
            </div>

            {state.enabledWidgets.length === 0 ? (
              <section className="app-card border-dashed text-center">
                <h2 className="text-2xl font-medium text-slate-800">No widgets are visible yet</h2>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Turn on a few cards above and this space will fill in one calm section at a time.
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  Start with `Tasks`, `Habits`, or `Reminders` if you want the simplest first setup.
                </p>
              </section>
            ) : (
              <section className="space-y-8">
                {state.enabledWidgets.map((widget) => (
                  <div key={widget}>{widgetViews[widget]}</div>
                ))}
              </section>
            )}

            {state.enabledWidgets.includes("homeschool") ? (
              <section className="app-card bg-white/80">
                <p className="text-sm text-slate-600">
                  Homeschool snapshot: {homeschoolSummary.children} child
                  {homeschoolSummary.children === 1 ? "" : "ren"},{" "}
                  {homeschoolSummary.selectedChildName || "choose a child in the homeschool planner"},{" "}
                  {homeschoolSummary.thisMonthFocusItems} focus item
                  {homeschoolSummary.thisMonthFocusItems === 1 ? "" : "s"} this month, and{" "}
                  {homeschoolSummary.attendanceThisMonth} attendance day
                  {homeschoolSummary.attendanceThisMonth === 1 ? "" : "s"} this month.
                </p>
                {homeschoolSummary.nextPlanningItem ? (
                  <p className="mt-3 text-sm text-slate-500">
                    Next homeschool planning item: {homeschoolSummary.nextPlanningItem}
                  </p>
                ) : null}
                {homeschoolSummary.upcomingCalendarItem ? (
                  <p className="mt-2 text-sm text-slate-500">
                    Upcoming homeschool event: {homeschoolSummary.upcomingCalendarItem.title || homeschoolSummary.upcomingCalendarItem.type} on{" "}
                    {homeschoolSummary.upcomingCalendarItem.date}
                  </p>
                ) : null}
              </section>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
