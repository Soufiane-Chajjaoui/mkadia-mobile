import { CouponResponse } from "../apis/CheckoutAPI";
import { CartItem } from "../models/CartItem";

export interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: 'package' | 'truck' | 'home';
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: 'card' | 'cash' | 'mobile';
  disabled: boolean
}

export interface DeliveryAddress {
  id?: string; // ✅ Ajouté pour identifier les adresses sauvegardées
  addressLine1: string;
  addressLine2?: string;
  city: string;
  codePostal: string;
  phone: string;
  isDefault?: boolean; // ✅ Marquer l'adresse par défaut
  label?: string; // ✅ Ex: "Maison", "Bureau", "Autre"
}

export interface PaymentCard {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
}

export interface OrderRequest {
  address: DeliveryAddress;
  delivery: {
    mode: string;
  };
  payment: {
    method: string;
  };
  items: CartItem[];
  coupon: CouponResponse;
}

export interface FormErrors {
  address?: string;
  city?: string;
  codePostal?: string;
  phone?: string;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
}