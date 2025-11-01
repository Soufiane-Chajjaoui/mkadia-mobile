import { DeliveryAddress, PaymentCard, FormErrors } from "../../types/CheckoutTypes";

export const validateCheckoutForm = (
  address: DeliveryAddress,
  card: PaymentCard,
  selectedPayment: string
): FormErrors => {
  const errors: FormErrors = {};

  // Validation adresse
  if (!address.addressLine1.trim()) errors.address = 'Adresse requise';
  if (!address.city.trim()) errors.city = 'Ville requise';
  if (!address.codePostal.trim()) errors.codePostal = 'Code postal requis';
  if (!address.phone.trim()) {
    errors.phone = 'Téléphone requis';
  } else if (!/^(\+212|0)[5-7]\d{8}$/.test(address.phone.replace(/\s/g, ''))) {
    errors.phone = 'Numéro invalide';
  }

  // Validation paiement carte
  if (selectedPayment === 'card') {
    if (!card.cardNumber.trim()) {
      errors.cardNumber = 'Numéro de carte requis';
    } else if (card.cardNumber.replace(/\s/g, '').length !== 16) {
      errors.cardNumber = 'Numéro de carte invalide';
    }
    
    if (!card.cardName.trim()) errors.cardName = 'Nom requis';
    
    if (!card.cardExpiry.trim()) {
      errors.cardExpiry = 'Date requise';
    } else if (!/^\d{2}\/\d{2}$/.test(card.cardExpiry)) {
      errors.cardExpiry = 'Format MM/AA';
    }
    
    if (!card.cardCvv.trim()) {
      errors.cardCvv = 'CVV requis';
    } else if (card.cardCvv.length !== 3) {
      errors.cardCvv = '3 chiffres';
    }
  }

  return errors;
};