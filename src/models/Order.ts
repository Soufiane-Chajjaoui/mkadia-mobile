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

export interface OrderDelivery {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface OrderProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  unit: string;
  expirationDate: string;
  quantity: number;
  urls: string[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  product: OrderProduct;
  price: number;
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

export interface OrderDetails {
  id: number;
  subTotal: number;
  totalAmount: number;
  discountAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  items: OrderItem[];
  delivery: OrderDelivery | null; // ✅ Peut être null si pas encore assigné
  countItems: number;
  createdAt: string;
  updatedAt: string;
  address: OrderAddress;
}

export interface OrdersResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  elements: Order[];
}

