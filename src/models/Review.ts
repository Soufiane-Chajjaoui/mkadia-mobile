export interface Review {
  id: number;
  productId: number;
  user: {
    id: number;
    lastName: string;
    firstName: string;
    email?: string;
    avatarUrl?: string;
  }
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRequest {
  productId: number;
  rating: number;
  comment: string;
}

