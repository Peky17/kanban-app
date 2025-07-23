export interface Bucket {
  id: number;
  name: string;
  color: string;
  description: string;
  createdAt: string;
  createdBy: {
    id: number;
  };
  board: {
    id: number;
  };
}
