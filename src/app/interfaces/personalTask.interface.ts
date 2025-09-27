export interface PersonalTask {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  dueDate: string;
  userId: number;
  bucketId: number;
}

export interface PersonalTaskBadge {
  id: number;
  personalTaskId: number;
  labelId: number;
}
