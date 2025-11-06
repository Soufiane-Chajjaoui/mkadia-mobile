export interface User {
  id: number | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string | null;
  roles?: string[] | null;
  reviews?: any[] | null;
  tokens?: any[] | null;
  orders?: any[] | null;
  carts?: any[] | null;
  addresses?: any[] | null;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  phone: string;
}

