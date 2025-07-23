export interface Board {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  createdBy: {
    id: number;
  };
  project: {
    id: number;
  };
}
