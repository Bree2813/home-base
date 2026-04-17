export type WidgetKey =
  | "habits"
  | "tasks"
  | "reminders"
  | "homeschool"
  | "groceries"
  | "meals"
  | "pantry"
  | "cleaning"
  | "household"
  | "animals"
  | "bills"
  | "appointments"
  | "projects"
  | "work"
  | "college";

export type EncouragementStyle = "standard" | "christian";

export type Habit = {
  id: string;
  title: string;
  lastCompletedOn: string | null;
};

export type Step = {
  id: string;
  title: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  kind: "single" | "multi";
  completed: boolean;
  steps: Step[];
  scheduledFor: string | null;
};

export type Reminder = {
  id: string;
  title: string;
  dueDate: string;
  recurring: "none" | "weekly" | "monthly";
  notes: string;
};

export type ChecklistItem = {
  id: string;
  title: string;
  checked: boolean;
};

export type MealPlanItem = {
  id: string;
  day: string;
  meal: string;
  plan: string;
  ingredients: string[];
};

export type InventoryItem = {
  id: string;
  name: string;
  quantity: string;
  lowStock: boolean;
  notes: string;
};

export type BillItem = {
  id: string;
  title: string;
  amount: string;
  dueDate: string;
  paid: boolean;
};

export type AppointmentItem = {
  id: string;
  title: string;
  when: string;
  details: string;
};

export type HomeschoolSubject = {
  id: string;
  childId: string;
  subject: string;
  curriculumName: string;
  gradeLevel: string;
  notes: string;
  materialsNeeded: string;
};

export type HomeschoolYearPlan = {
  id: string;
  childId: string;
  subject: string;
  yearlyGoals: string;
  curriculumResource: string;
  notes: string;
};

export type HomeschoolMonthPlan = {
  id: string;
  childId: string;
  month: string;
  subject: string;
  focusTopic: string;
  resources: string;
  notes: string;
};

export type HomeschoolUnitPlan = {
  id: string;
  childId: string;
  unitTitle: string;
  subject: string;
  objectives: string;
  activities: string;
  materials: string;
  notes: string;
};

export type HomeschoolAttendanceStatus =
  | "school day completed"
  | "light learning day"
  | "field trip"
  | "sick day"
  | "day off";

export type HomeschoolAttendanceEntry = {
  id: string;
  childId: string;
  date: string;
  status: HomeschoolAttendanceStatus;
  notes: string;
};

export type HomeschoolProject = {
  id: string;
  childId: string;
  name: string;
  category: string;
  neededSupplies: string;
  ownedSupplies: string;
  notes: string;
  targetDate: string;
};

export type HomeschoolChild = {
  id: string;
  name: string;
  gradeLevel: string;
  notes: string;
};

export type HomeschoolCalendarEntryType =
  | "school day"
  | "holiday"
  | "break"
  | "field trip"
  | "day off"
  | "special event";

export type HomeschoolCalendarEntry = {
  id: string;
  schoolYear: string;
  date: string;
  type: HomeschoolCalendarEntryType;
  title: string;
  notes: string;
};

export type HomeschoolSchoolYearPlan = {
  id: string;
  schoolYear: string;
  startDate: string;
  endDate: string;
};

export type DashboardState = {
  enabledWidgets: WidgetKey[];
  encouragementStyle: EncouragementStyle;
  encouragementMessages: string[];
  encouragementIndex: number;
  autoSyncGroceries: boolean;
  habits: Habit[];
  tasks: Task[];
  reminders: Reminder[];
  homeschoolChildren: HomeschoolChild[];
  selectedHomeschoolChildId: string | null;
  selectedHomeschoolSchoolYear: string;
  homeschoolSchoolYears: HomeschoolSchoolYearPlan[];
  homeschoolCalendarEntries: HomeschoolCalendarEntry[];
  homeschoolSubjects: HomeschoolSubject[];
  homeschoolYearPlans: HomeschoolYearPlan[];
  homeschoolMonthPlans: HomeschoolMonthPlan[];
  homeschoolUnitPlans: HomeschoolUnitPlan[];
  homeschoolAttendance: HomeschoolAttendanceEntry[];
  homeschoolProjects: HomeschoolProject[];
  groceryItems: ChecklistItem[];
  cleaningItems: ChecklistItem[];
  mealPlans: MealPlanItem[];
  pantryItems: InventoryItem[];
  fridgeItems: InventoryItem[];
  cleaningSupplyItems: InventoryItem[];
  paperGoodsItems: InventoryItem[];
  animalItems: ChecklistItem[];
  animalInventoryItems: InventoryItem[];
  billItems: BillItem[];
  appointments: AppointmentItem[];
  workItems: ChecklistItem[];
  collegeItems: ChecklistItem[];
};
