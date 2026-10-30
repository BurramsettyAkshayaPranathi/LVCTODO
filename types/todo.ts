export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  userId?: string;
};

export type TodoFilter = "all" | "active" | "completed";
