export interface Subtask {
  id: number;
  name: string;
  createdAt: string;
  priority: string;
  startdDate: string;
  dueDate: string;
  createdBy: {
    id: number;
  };
  task: {
    id: number;
  };
}

export interface UserSubtask {
  userId: number;
  subtaskId: number;
  completed: boolean;
}
