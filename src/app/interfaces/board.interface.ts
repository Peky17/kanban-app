export interface Board {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  createdBy: {
    id: number;
  };
  buckets?: any[];
}

export interface UserBoard {
  id: number;
  userId: number;
  boardId: number;
}
