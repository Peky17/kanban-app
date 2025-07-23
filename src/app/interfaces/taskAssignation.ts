export interface TaskAssignation {
  id: number;
  user: {
    id: number;
  };
  task: {
    id: number;
  };
  completed: boolean;
}
