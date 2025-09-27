export interface Badge {
  id: number;
  text: string;
  color: string;
}

export interface BucketBadge {
  id: number;
  label: {
    id: number;
  };
  bucket: {
    id: number;
  };
  createdBy: {
    id: number;
  };
}
