import { DeliveryMethod, PaymentMethod } from "../types/CheckoutTypes";

export const deliveryMethods: DeliveryMethod[] = [
  {
    id: 'STANDARD',
    name: 'Livraison Standard',
    description: 'Livraison sous 3-5 jours ouvrés',
    price: 0,
    estimatedDays: '3-5 jours',
    icon: 'package'
  },
  {
    id: 'FAST',
    name: 'Livraison Express',
    description: 'Livraison sous 24-48h',
    price: 5,
    estimatedDays: '24-48h',
    icon: 'truck'
  },
  {
    id: 'PICKUP',
    name: 'Retrait en Point Relais',
    description: 'Disponible sous 2-3 jours',
    price: 3,
    estimatedDays: '2-3 jours',
    icon: 'home',
  },
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'ONLINE_CARD',
    name: 'Carte bancaire',
    description: 'Visa, Mastercard, Amex',
    icon: 'card',
    disabled: true
  },
  {
    id: 'CASH_ON_DELIVERY',
    name: 'Paiement à la livraison',
    description: 'Espèces ou carte à la réception',
    icon: 'cash',
    disabled: false
  },
  {
    id: 'MOBILE_PAYMENT',
    name: 'Paiement mobile',
    description: 'Orange Money, Maroc Telecom',
    icon: 'mobile',
    disabled: true
  },
];