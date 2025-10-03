import { PersonalTask } from './personalTask.interface';
import { Task } from './task.interface';

export interface ChatbotResponse {
  response: string;
  tasks: Task[];
}

export interface RecommendedPersonalTasks {
  response: string;
  tasks: PersonalTask[];
}

export interface ChatbotRequest {
  userId: number;
  message: string;
}
