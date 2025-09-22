import { Task } from './task.interface';

export interface ChatbotResponse {
  response: string;
  tasks: Task[];
}

export interface ChatbotRequest {
  userId: number;
  message: string;
}
