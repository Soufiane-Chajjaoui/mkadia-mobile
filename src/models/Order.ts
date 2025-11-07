export interface OrderAddress {
  city: string;
  addressLine1: string;
  codePostal: number;
}

export interface OrderClient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type PaymentStatus =     'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type PaymentMethod = 'ONLINE_CARD' | 'CASH_ON_DELIVERY' | 'MOBILE_PAYMENT' ;
export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELED';

export interface Order {
  id: number;
  client?: OrderClient;
  subTotal: number;
  totalAmount: number;
  discountAmount: number;
  paymentStatus: PaymentStatus | null;
  paymentMethod: PaymentMethod | null;
  status: OrderStatus;
  items: any[] | null;
  countItems: number;
  createdAt: string;
  updatedAt: string;
  delivery: any | null;
  address: OrderAddress | null;
}

export interface OrdersResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  elements: Order[];
}

