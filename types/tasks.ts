export type Step = {
  id: string;
  title: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  createdAt: string;
  steps: Step[];
};
