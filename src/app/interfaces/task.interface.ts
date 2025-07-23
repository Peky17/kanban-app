export interface Task {
  id: number;
  name: string;
  createdAt: string;
  priority: string;
  startDate: string;
  dueDate: string;
  description: string;
  createdBy: {
    id: number;
  };
  bucket: {
    id: number;
  };
}
