export interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  startDate: string;
  dueDate: string;
  createdBy: {
    id: number;
  };
}
