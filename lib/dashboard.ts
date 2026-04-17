import { IconName } from "@/components/AppIcon";
import {
  AppointmentItem,
  BillItem,
  ChecklistItem,
  DashboardState,
  EncouragementStyle,
  Habit,
  HomeschoolCalendarEntry,
  HomeschoolCalendarEntryType,
  HomeschoolChild,
  HomeschoolAttendanceEntry,
  HomeschoolAttendanceStatus,
  HomeschoolMonthPlan,
  HomeschoolProject,
  HomeschoolSchoolYearPlan,
  HomeschoolSubject,
  HomeschoolUnitPlan,
  HomeschoolYearPlan,
  InventoryItem,
  MealPlanItem,
  Reminder,
  Task,
  WidgetKey,
} from "@/types/dashboard";

export function createId() {
  return Math.random().toString(36).slice(2, 10);
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export const widgetCatalog: Array<{
  key: WidgetKey;
  title: string;
  description: string;
  icon: IconName;
}> = [
  { key: "habits", title: "Daily Habits", description: "Gentle daily repeats that reset tomorrow.", icon: "habits" },
  { key: "tasks", title: "Tasks", description: "One-time tasks and tiny step breakdowns.", icon: "tasks" },
  { key: "reminders", title: "Reminders", description: "Due dates and recurring responsibilities.", icon: "reminders" },
  { key: "homeschool", title: "Homeschool", description: "Curriculum and learning plans in one place.", icon: "homeschool" },
  { key: "meals", title: "Meals", description: "Simple meal planning with optional grocery sync.", icon: "meals" },
  { key: "groceries", title: "Groceries", description: "Groceries tied to meals and daily needs.", icon: "groceries" },
  { key: "pantry", title: "Pantry", description: "Pantry and fridge inventory at a glance.", icon: "pantry" },
  { key: "cleaning", title: "Cleaning Supplies", description: "Cleaning and paper goods inventory.", icon: "cleaning" },
  { key: "household", title: "Household Items", description: "Paper goods and simple home restocks.", icon: "household" },
  { key: "animals", title: "Animals", description: "Animal feed, meds, and supplies in one place.", icon: "animals" },
  { key: "bills", title: "Bills", description: "Bill organizer with due dates and paid status.", icon: "bills" },
  { key: "appointments", title: "Appointments", description: "Upcoming visits and important times.", icon: "appointments" },
  { key: "projects", title: "Projects / Crafts", description: "Homeschool projects and supply planning.", icon: "projects" },
  { key: "work", title: "Work", description: "Optional work priorities and follow-ups.", icon: "work" },
  { key: "college", title: "College", description: "Optional study and assignment tracking.", icon: "college" },
];

const standardEncouragements = [
  "Small steps still count. You only need to do the next kind thing for yourself.",
  "A calm plan is enough for today. Let the dashboard hold the details.",
  "You do not have to finish everything to make today meaningful.",
  "Gentle progress is real progress. Pick one thing, then breathe.",
];

const christianEncouragements = [
  "Take the next small step with peace. God is near and steadying you. \"God is within her, she will not fall.\" Psalm 46:5",
  "You do not have to carry the whole day alone. \"Cast all your anxiety on him because he cares for you.\" 1 Peter 5:7",
  "Grace is here for ordinary tasks too. \"My grace is sufficient for you.\" 2 Corinthians 12:9",
  "A quiet, faithful step is enough for now. \"The Lord will fight for you; you need only to be still.\" Exodus 14:14",
];

function makeHabit(title: string): Habit {
  return { id: createId(), title, lastCompletedOn: null };
}

function makeTask(title: string, kind: "single" | "multi", steps: string[] = []): Task {
  return {
    id: createId(),
    title,
    kind,
    completed: false,
    scheduledFor: null,
    steps: steps.map((step) => ({
      id: createId(),
      title: step,
      completed: false,
    })),
  };
}

function makeReminder(
  title: string,
  dueDate: string,
  recurring: Reminder["recurring"],
  notes = "",
): Reminder {
  return { id: createId(), title, dueDate, recurring, notes };
}

function makeChecklistItem(title: string): ChecklistItem {
  return { id: createId(), title, checked: false };
}

function makeMeal(day: string, meal: string, plan: string, ingredients: string[] = []): MealPlanItem {
  return { id: createId(), day, meal, plan, ingredients };
}

function makeInventoryItem(
  name: string,
  quantity: string,
  lowStock = false,
  notes = "",
): InventoryItem {
  return { id: createId(), name, quantity, lowStock, notes };
}

function makeBill(title: string, amount: string, dueDate: string): BillItem {
  return { id: createId(), title, amount, dueDate, paid: false };
}

function makeAppointment(title: string, when: string, details: string): AppointmentItem {
  return { id: createId(), title, when, details };
}

function makeHomeschoolSubject(
  childId: string,
  subject: string,
  curriculumName: string,
  gradeLevel: string,
  notes: string,
  materialsNeeded: string,
): HomeschoolSubject {
  return { id: createId(), childId, subject, curriculumName, gradeLevel, notes, materialsNeeded };
}

function makeHomeschoolYearPlan(
  childId: string,
  subject: string,
  yearlyGoals: string,
  curriculumResource: string,
  notes: string,
): HomeschoolYearPlan {
  return { id: createId(), childId, subject, yearlyGoals, curriculumResource, notes };
}

function makeHomeschoolMonthPlan(
  childId: string,
  month: string,
  subject: string,
  focusTopic: string,
  resources: string,
  notes: string,
): HomeschoolMonthPlan {
  return { id: createId(), childId, month, subject, focusTopic, resources, notes };
}

function makeHomeschoolUnitPlan(
  childId: string,
  unitTitle: string,
  subject: string,
  objectives: string,
  activities: string,
  materials: string,
  notes: string,
): HomeschoolUnitPlan {
  return { id: createId(), childId, unitTitle, subject, objectives, activities, materials, notes };
}

function makeHomeschoolProject(
  childId: string,
  name: string,
  category: string,
  neededSupplies: string,
  ownedSupplies: string,
  notes: string,
  targetDate: string,
): HomeschoolProject {
  return { id: createId(), childId, name, category, neededSupplies, ownedSupplies, notes, targetDate };
}

function makeHomeschoolAttendance(
  childId: string,
  date: string,
  status: HomeschoolAttendanceStatus,
  notes: string,
): HomeschoolAttendanceEntry {
  return { id: createId(), childId, date, status, notes };
}

function makeHomeschoolChild(
  name: string,
  gradeLevel: string,
  notes: string,
): HomeschoolChild {
  return { id: createId(), name, gradeLevel, notes };
}

function makeHomeschoolSchoolYearPlan(
  schoolYear: string,
  startDate: string,
  endDate: string,
): HomeschoolSchoolYearPlan {
  return { id: createId(), schoolYear, startDate, endDate };
}

function makeHomeschoolCalendarEntry(
  schoolYear: string,
  date: string,
  type: HomeschoolCalendarEntryType,
  title: string,
  notes: string,
): HomeschoolCalendarEntry {
  return { id: createId(), schoolYear, date, type, title, notes };
}

export function createInitialDashboardState(): DashboardState {
  const defaultChild = makeHomeschoolChild("Child 1", "1st grade", "");
  const defaultSchoolYear = "2025-2026";

  return {
    enabledWidgets: ["habits", "tasks", "reminders", "meals", "groceries", "appointments"],
    encouragementStyle: "standard",
    encouragementMessages: [],
    encouragementIndex: 0,
    autoSyncGroceries: false,
    habits: [
      makeHabit("Brush teeth"),
      makeHabit("Take meds"),
      makeHabit("Shower"),
      makeHabit("Feed pets"),
    ],
    tasks: [
      makeTask("Finish homeschool reading plan", "multi", [
        "Open the reading book",
        "Choose one story",
        "Read the first page together",
      ]),
      makeTask("Call the dentist", "single"),
    ],
    reminders: [
      makeReminder("Trash day", "2026-04-17", "weekly", "Put bins out after dinner"),
      makeReminder("Electric bill due", "2026-04-22", "monthly", ""),
      makeReminder("Vet appointment", "2026-04-24", "none", "Bring vaccination notes"),
    ],
    homeschoolChildren: [defaultChild],
    selectedHomeschoolChildId: defaultChild.id,
    selectedHomeschoolSchoolYear: defaultSchoolYear,
    homeschoolSchoolYears: [
      makeHomeschoolSchoolYearPlan(defaultSchoolYear, "2025-08-18", "2026-05-29"),
    ],
    homeschoolCalendarEntries: [
      makeHomeschoolCalendarEntry(defaultSchoolYear, "2025-11-27", "holiday", "Thanksgiving", ""),
      makeHomeschoolCalendarEntry(defaultSchoolYear, "2025-12-22", "break", "Winter break", ""),
      makeHomeschoolCalendarEntry(defaultSchoolYear, "2026-03-18", "field trip", "Museum day", ""),
    ],
    homeschoolSubjects: [
      makeHomeschoolSubject(defaultChild.id, "Math", "RightStart Math", "1st grade", "Keep lessons short and hands-on.", "Abacus, game cards"),
      makeHomeschoolSubject(defaultChild.id, "Reading", "All About Reading", "1st grade", "Focus on fluency and read-aloud joy.", "Reader, phonogram cards"),
    ],
    homeschoolYearPlans: [
      makeHomeschoolYearPlan(defaultChild.id, "Math", "Build addition confidence and steady number sense.", "RightStart Math Level B", "Move slowly and review often."),
      makeHomeschoolYearPlan(defaultChild.id, "Science", "Explore weather, plants, and simple experiments.", "Nature study plus library books", "Keep it curiosity-led."),
    ],
    homeschoolMonthPlans: [
      makeHomeschoolMonthPlan(defaultChild.id, "September", "Reading", "Short vowel review and first readers", "Phonics cards, library basket", "Aim for calm daily practice."),
      makeHomeschoolMonthPlan(defaultChild.id, "October", "Science", "Leaves, weather, and fall nature walks", "Nature journal, magnifying glass", "Use outside time when possible."),
    ],
    homeschoolUnitPlans: [
      makeHomeschoolUnitPlan(defaultChild.id, "Community Helpers", "Social Studies", "Understand how people help in the community", "Read picture books, role play, short field trip", "Picture books, dress-up props", "Keep it playful."),
    ],
    homeschoolAttendance: [
      makeHomeschoolAttendance(defaultChild.id, "2026-04-15", "school day completed", "Math, reading, and science outside."),
      makeHomeschoolAttendance(defaultChild.id, "2026-04-16", "field trip", "Library visit and nature walk."),
    ],
    homeschoolProjects: [
      makeHomeschoolProject(defaultChild.id, "Butterfly life cycle craft", "Science", "Paper plates, paint, clothespins", "Paint", "Good fit for spring science week.", "April"),
    ],
    groceryItems: [makeChecklistItem("Milk"), makeChecklistItem("Fruit"), makeChecklistItem("Lunch snacks")],
    cleaningItems: [makeChecklistItem("Laundry detergent"), makeChecklistItem("Dish soap"), makeChecklistItem("Trash bags")],
    mealPlans: [
      makeMeal("Monday", "Dinner", "Tacos", ["Tortillas", "Ground beef", "Shredded cheese"]),
      makeMeal("Tuesday", "Dinner", "Pasta and salad", ["Pasta", "Marinara", "Lettuce"]),
    ],
    pantryItems: [
      makeInventoryItem("Peanut butter", "1 jar"),
      makeInventoryItem("Oatmeal", "2 boxes", true),
    ],
    fridgeItems: [
      makeInventoryItem("Eggs", "1 dozen", true),
      makeInventoryItem("Yogurt", "6 cups"),
    ],
    cleaningSupplyItems: [
      makeInventoryItem("Dish soap", "1 bottle", true),
      makeInventoryItem("Laundry detergent", "Half jug"),
    ],
    paperGoodsItems: [
      makeInventoryItem("Toilet paper", "8 rolls"),
      makeInventoryItem("Paper towels", "2 rolls", true),
    ],
    animalItems: [
      makeChecklistItem("Chicken feed"),
      makeChecklistItem("Dog food"),
      makeChecklistItem("Dewormer refill"),
    ],
    animalInventoryItems: [
      makeInventoryItem("Chicken feed", "1 bag", true),
      makeInventoryItem("Dog food", "2 bags"),
    ],
    billItems: [makeBill("Electric", "$96", "2026-04-22"), makeBill("Internet", "$65", "2026-04-25")],
    appointments: [
      makeAppointment("Pediatrician", "2026-04-20 10:30", "Bring insurance card"),
      makeAppointment("Homeschool co-op", "2026-04-23 13:00", "Pack science binder"),
    ],
    workItems: [makeChecklistItem("Reply to team email"), makeChecklistItem("Prepare one priority for tomorrow")],
    collegeItems: [makeChecklistItem("Read chapter 4"), makeChecklistItem("Submit discussion post")],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function normalizeChecklistItems(value: unknown): ChecklistItem[] {
  return readArray<unknown>(value)
    .filter(isRecord)
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : createId(),
      title: typeof item.title === "string" ? item.title : "",
      checked: Boolean(item.checked),
    }))
    .filter((item) => item.title.trim().length > 0);
}

function normalizeInventoryItems(value: unknown): InventoryItem[] {
  return readArray<unknown>(value)
    .filter(isRecord)
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : createId(),
      name: typeof item.name === "string" ? item.name : typeof item.title === "string" ? item.title : "",
      quantity: typeof item.quantity === "string" ? item.quantity : "",
      lowStock: Boolean(item.lowStock),
      notes: typeof item.notes === "string" ? item.notes : "",
    }))
    .filter((item) => item.name.trim().length > 0);
}

function normalizeMeals(value: unknown): MealPlanItem[] {
  return readArray<unknown>(value)
    .filter(isRecord)
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : createId(),
      day: typeof item.day === "string" ? item.day : "Monday",
      meal: typeof item.meal === "string" ? item.meal : "Dinner",
      plan: typeof item.plan === "string" ? item.plan : "",
      ingredients: readArray<unknown>(item.ingredients).filter(
        (entry): entry is string => typeof entry === "string" && entry.trim().length > 0,
      ),
    }))
    .filter((item) => item.plan.trim().length > 0);
}

function normalizeProjects(value: unknown): HomeschoolProject[] {
  return readArray<unknown>(value)
    .filter(isRecord)
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : createId(),
      childId: typeof item.childId === "string" ? item.childId : "",
      name: typeof item.name === "string" ? item.name : "",
      category: typeof item.category === "string" ? item.category : "",
      neededSupplies: typeof item.neededSupplies === "string" ? item.neededSupplies : "",
      ownedSupplies: typeof item.ownedSupplies === "string" ? item.ownedSupplies : "",
      notes: typeof item.notes === "string" ? item.notes : "",
      targetDate: typeof item.targetDate === "string" ? item.targetDate : "",
    }))
    .filter((item) => item.name.trim().length > 0);
}

function normalizeAttendance(value: unknown): HomeschoolAttendanceEntry[] {
  const validStatuses = new Set<HomeschoolAttendanceStatus>([
    "school day completed",
    "light learning day",
    "field trip",
    "sick day",
    "day off",
  ]);

  return readArray<unknown>(value)
    .filter(isRecord)
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : createId(),
      childId: typeof item.childId === "string" ? item.childId : "",
      date: typeof item.date === "string" ? item.date : "",
      status:
        typeof item.status === "string" && validStatuses.has(item.status as HomeschoolAttendanceStatus)
          ? (item.status as HomeschoolAttendanceStatus)
          : "school day completed",
      notes: typeof item.notes === "string" ? item.notes : "",
    }))
    .filter((item) => item.date.trim().length > 0)
    .sort((left, right) => right.date.localeCompare(left.date));
}

function normalizeChildren(value: unknown): HomeschoolChild[] {
  return readArray<unknown>(value)
    .filter(isRecord)
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : createId(),
      name: typeof item.name === "string" ? item.name : "",
      gradeLevel: typeof item.gradeLevel === "string" ? item.gradeLevel : "",
      notes: typeof item.notes === "string" ? item.notes : "",
    }))
    .filter((item) => item.name.trim().length > 0);
}

function normalizeSchoolYears(value: unknown): HomeschoolSchoolYearPlan[] {
  return readArray<unknown>(value)
    .filter(isRecord)
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : createId(),
      schoolYear: typeof item.schoolYear === "string" ? item.schoolYear : "",
      startDate: typeof item.startDate === "string" ? item.startDate : "",
      endDate: typeof item.endDate === "string" ? item.endDate : "",
    }))
    .filter((item) => item.schoolYear.trim().length > 0);
}

function normalizeCalendarEntries(value: unknown): HomeschoolCalendarEntry[] {
  const validTypes = new Set<HomeschoolCalendarEntryType>([
    "school day",
    "holiday",
    "break",
    "field trip",
    "day off",
    "special event",
  ]);

  return readArray<unknown>(value)
    .filter(isRecord)
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : createId(),
      schoolYear: typeof item.schoolYear === "string" ? item.schoolYear : "",
      date: typeof item.date === "string" ? item.date : "",
      type:
        typeof item.type === "string" && validTypes.has(item.type as HomeschoolCalendarEntryType)
          ? (item.type as HomeschoolCalendarEntryType)
          : "school day",
      title: typeof item.title === "string" ? item.title : "",
      notes: typeof item.notes === "string" ? item.notes : "",
    }))
    .filter((item) => item.date.trim().length > 0 && item.schoolYear.trim().length > 0)
    .sort((left, right) => left.date.localeCompare(right.date));
}

function normalizeStringList(value: unknown): string[] {
  return readArray<unknown>(value).filter(
    (entry): entry is string => typeof entry === "string" && entry.trim().length > 0,
  );
}

export function normalizeDashboardState(raw: unknown): DashboardState {
  const fallback = createInitialDashboardState();

  if (!isRecord(raw)) {
    return fallback;
  }

  const validWidgetKeys = new Set<WidgetKey>(widgetCatalog.map((widget) => widget.key));
  const enabledWidgets = readArray<unknown>(raw.enabledWidgets)
    .map((value) => (value === "shopping" ? "groceries" : value))
    .filter((value): value is WidgetKey => typeof value === "string" && validWidgetKeys.has(value as WidgetKey));

  const tasks = readArray<unknown>(raw.tasks)
    .filter(isRecord)
    .map((task) => ({
      id: typeof task.id === "string" ? task.id : createId(),
      title: typeof task.title === "string" ? task.title : "",
      kind: (task.kind === "multi" ? "multi" : "single") as Task["kind"],
      completed: Boolean(task.completed),
      scheduledFor: typeof task.scheduledFor === "string" ? task.scheduledFor : null,
      steps: readArray<unknown>(task.steps)
        .filter(isRecord)
        .map((step) => ({
          id: typeof step.id === "string" ? step.id : createId(),
          title: typeof step.title === "string" ? step.title : "",
          completed: Boolean(step.completed),
        })),
    }))
    .filter((task) => task.title.trim().length > 0);

  const encouragementStyle: EncouragementStyle =
    raw.encouragementStyle === "christian" ? "christian" : "standard";

  const homeschoolChildren = normalizeChildren(raw.homeschoolChildren);
  const normalizedChildren =
    homeschoolChildren.length > 0 ? homeschoolChildren : fallback.homeschoolChildren;
  const defaultChildId = normalizedChildren[0]?.id ?? fallback.homeschoolChildren[0]?.id ?? "";
  const selectedHomeschoolChildId =
    typeof raw.selectedHomeschoolChildId === "string" &&
    normalizedChildren.some((child) => child.id === raw.selectedHomeschoolChildId)
      ? raw.selectedHomeschoolChildId
      : defaultChildId;

  function withChildId<T extends { childId: string }>(items: T[]) {
    return items.map((item) => ({
      ...item,
      childId: item.childId || selectedHomeschoolChildId,
    }));
  }

  const homeschoolSchoolYears = normalizeSchoolYears(raw.homeschoolSchoolYears);
  const normalizedSchoolYears =
    homeschoolSchoolYears.length > 0 ? homeschoolSchoolYears : fallback.homeschoolSchoolYears;
  const selectedHomeschoolSchoolYear =
    typeof raw.selectedHomeschoolSchoolYear === "string" &&
    normalizedSchoolYears.some((entry) => entry.schoolYear === raw.selectedHomeschoolSchoolYear)
      ? raw.selectedHomeschoolSchoolYear
      : normalizedSchoolYears[0]?.schoolYear ?? fallback.selectedHomeschoolSchoolYear;

  return {
    enabledWidgets: enabledWidgets.length > 0 ? enabledWidgets : fallback.enabledWidgets,
    encouragementStyle,
    encouragementMessages: normalizeStringList(raw.encouragementMessages),
    encouragementIndex:
      typeof raw.encouragementIndex === "number" && raw.encouragementIndex >= 0
        ? raw.encouragementIndex
        : 0,
    autoSyncGroceries: typeof raw.autoSyncGroceries === "boolean" ? raw.autoSyncGroceries : false,
    habits: readArray<Habit>(raw.habits),
    tasks,
    reminders: readArray<Reminder>(raw.reminders),
    homeschoolChildren: normalizedChildren,
    selectedHomeschoolChildId,
    selectedHomeschoolSchoolYear,
    homeschoolSchoolYears: normalizedSchoolYears,
    homeschoolCalendarEntries: normalizeCalendarEntries(raw.homeschoolCalendarEntries),
    homeschoolSubjects: withChildId(readArray<HomeschoolSubject>(raw.homeschoolSubjects)),
    homeschoolYearPlans: withChildId(readArray<HomeschoolYearPlan>(raw.homeschoolYearPlans)),
    homeschoolMonthPlans: withChildId(readArray<HomeschoolMonthPlan>(raw.homeschoolMonthPlans)),
    homeschoolUnitPlans: withChildId(readArray<HomeschoolUnitPlan>(raw.homeschoolUnitPlans)),
    homeschoolAttendance: withChildId(normalizeAttendance(raw.homeschoolAttendance)),
    homeschoolProjects: withChildId(normalizeProjects(raw.homeschoolProjects)),
    groceryItems: normalizeChecklistItems(raw.groceryItems),
    cleaningItems: normalizeChecklistItems(raw.cleaningItems),
    mealPlans: normalizeMeals(raw.mealPlans),
    pantryItems: normalizeInventoryItems(raw.pantryItems),
    fridgeItems: normalizeInventoryItems(raw.fridgeItems),
    cleaningSupplyItems: normalizeInventoryItems(raw.cleaningSupplyItems),
    paperGoodsItems: normalizeInventoryItems(raw.paperGoodsItems),
    animalItems: normalizeChecklistItems(raw.animalItems),
    animalInventoryItems: normalizeInventoryItems(raw.animalInventoryItems),
    billItems: readArray<BillItem>(raw.billItems),
    appointments: readArray<AppointmentItem>(raw.appointments),
    workItems: normalizeChecklistItems(raw.workItems),
    collegeItems: normalizeChecklistItems(raw.collegeItems),
  };
}

export function getHabitCounts(habits: Habit[]) {
  const today = todayKey();
  const done = habits.filter((habit) => habit.lastCompletedOn === today).length;
  return { done, total: habits.length };
}

export function getTaskProgress(task: Task) {
  if (task.kind === "single") {
    return task.completed ? 100 : 0;
  }

  if (task.steps.length === 0) {
    return task.completed ? 100 : 0;
  }

  const completedSteps = task.steps.filter((step) => step.completed).length;
  return Math.round((completedSteps / task.steps.length) * 100);
}

export function formatLongDateLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getGreetingForTime() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 18) {
    return "Good afternoon";
  }
  return "Good evening";
}

export function getWeekdayName(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(date);
}

export function isReminderDueOnDate(reminder: Reminder, dateKey: string) {
  if (reminder.dueDate === dateKey) {
    return true;
  }

  if (reminder.recurring === "weekly") {
    return getWeekdayName(reminder.dueDate) === getWeekdayName(dateKey);
  }

  if (reminder.recurring === "monthly") {
    const dueDay = reminder.dueDate.split("-")[2];
    const todayDay = dateKey.split("-")[2];
    return dueDay === todayDay;
  }

  return false;
}

export function getNextTaskStep(task: Task) {
  return task.steps.find((step) => !step.completed) ?? null;
}

export function getDashboardMessage(state: DashboardState) {
  const habitCounts = getHabitCounts(state.habits);
  const openTasks = state.tasks.filter((task) => !task.completed).length;
  const dueSoon = getSortedReminders(state.reminders).slice(0, 2).length;

  if (habitCounts.done === habitCounts.total && openTasks === 0) {
    return "Today looks lighter. Protect your energy and keep the pace gentle.";
  }

  if (dueSoon > 0) {
    return "You only need to look at the next few things, not the whole week.";
  }

  if (openTasks > 0) {
    return "A calm dashboard works best when you focus on one card at a time.";
  }

  return "You have one home base now. Let the dashboard hold the details for you.";
}

export function getHomeschoolSummary(state: DashboardState) {
  const today = todayKey();
  const currentMonth = getMonthName(today);
  const schoolYearStart = getSchoolYearStart(today);
  const schoolYearEnd = `${Number(schoolYearStart.slice(0, 4)) + 1}-07-31`;
  const selectedChildId = state.selectedHomeschoolChildId;
  const selectedChild = state.homeschoolChildren.find((child) => child.id === selectedChildId);
  const childMonthPlans = state.homeschoolMonthPlans.filter((entry) => entry.childId === selectedChildId);
  const childAttendance = state.homeschoolAttendance.filter((entry) => entry.childId === selectedChildId);
  const attendanceThisMonth = childAttendance.filter((entry) =>
    entry.date.startsWith(today.slice(0, 7)),
  ).length;
  const attendanceThisSchoolYear = childAttendance.filter(
    (entry) => entry.date >= schoolYearStart && entry.date <= schoolYearEnd,
  ).length;
  const thisMonthFocusItems = childMonthPlans.filter(
    (entry) => entry.month === currentMonth,
  ).length;
  const nextPlanningItem =
    childMonthPlans.find((entry) => entry.month === currentMonth)?.focusTopic ||
    state.homeschoolYearPlans.find((entry) => entry.childId === selectedChildId)?.yearlyGoals ||
    state.homeschoolSubjects.find((entry) => entry.childId === selectedChildId)?.subject ||
    "";
  const upcomingCalendarItem =
    state.homeschoolCalendarEntries
      .filter((entry) => entry.schoolYear === state.selectedHomeschoolSchoolYear && entry.date >= today)
      .sort((left, right) => left.date.localeCompare(right.date))[0] ?? null;

  return {
    children: state.homeschoolChildren.length,
    selectedChildName: selectedChild?.name ?? "",
    subjects: state.homeschoolSubjects.filter((entry) => entry.childId === selectedChildId).length,
    yearlyPlans: state.homeschoolYearPlans.filter((entry) => entry.childId === selectedChildId).length,
    monthlyPlans: childMonthPlans.length,
    unitPlans: state.homeschoolUnitPlans.filter((entry) => entry.childId === selectedChildId).length,
    attendanceThisMonth,
    attendanceThisSchoolYear,
    thisMonthFocusItems,
    nextPlanningItem,
    projects: state.homeschoolProjects.filter((entry) => entry.childId === selectedChildId).length,
    upcomingCalendarItem,
  };
}

export function getMonthName(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(date);
}

export function getSchoolYearStart(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return `${new Date().getFullYear()}-08-01`;
  }

  const year = date.getMonth() >= 7 ? date.getFullYear() : date.getFullYear() - 1;
  return `${year}-08-01`;
}

export function getSortedReminders(reminders: Reminder[]) {
  return [...reminders].sort((left, right) => left.dueDate.localeCompare(right.dueDate));
}

export function formatDateLabel(value: string) {
  if (!value) {
    return "No date";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function parseIngredientList(value: string) {
  return value
    .split(/[\n,;]+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export function addMissingGroceries(items: ChecklistItem[], ingredients: string[]) {
  const existing = new Set(items.map((item) => item.title.trim().toLowerCase()));
  const additions: ChecklistItem[] = [];

  for (const ingredient of ingredients) {
    const normalized = ingredient.toLowerCase();
    if (existing.has(normalized)) {
      continue;
    }
    existing.add(normalized);
    additions.push({ id: createId(), title: ingredient, checked: false });
  }

  return [...items, ...additions];
}

export function getEncouragementDeck(
  style: EncouragementStyle,
  customMessages: string[],
) {
  const base = style === "christian" ? christianEncouragements : standardEncouragements;
  return [...base, ...customMessages];
}
