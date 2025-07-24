import { Task } from './task.interface';
import { User } from './user.interface';

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

export interface UserTaskAssignation {
  id: number;
  task: Task;
  user: User;
  isCompleted: boolean;
}
