import { DeliveryAddress, FormErrors } from "../../types/CheckoutTypes";

export const validateCheckoutForm = (
  address: DeliveryAddress,
  _selectedPayment: string // Préfixé avec _ pour indiquer qu'il n'est pas utilisé pour le moment
): FormErrors => {
  console.log('🔍 Validating checkout form...');
  console.log('📍 Address to validate:', address);

  const errors: FormErrors = {};

  // Validation adresse
  if (!address.addressLine1 || !address.addressLine1.trim()) {
    console.log('❌ addressLine1 is empty');
    errors.address = 'Adresse requise';
  }

  if (!address.city || !address.city.trim()) {
    console.log('❌ city is empty');
    errors.city = 'Ville requise';
  }

  // ✅ Gérer codePostal comme string ou number
  const codePostalStr = String(address.codePostal || '').trim();
  if (!codePostalStr) {
    console.log('❌ codePostal is empty');
    errors.codePostal = 'Code postal requis';
  }

  if (!address.phone || !address.phone.trim()) {
    console.log('❌ phone is empty');
    errors.phone = 'Téléphone requis';
  } else if (!/^(\+212|0)[5-7]\d{8}$/.test(address.phone.replace(/\s/g, ''))) {
    console.log('❌ phone format invalid:', address.phone);
    errors.phone = 'Numéro invalide';
  }

  // ✅ Validation paiement carte (seulement si ONLINE_CARD est sélectionné)
  // Pour le moment, ONLINE_CARD est désactivé, donc pas de validation carte
  // if (selectedPayment === 'ONLINE_CARD') {
  //   if (!card.cardNumber.trim()) {
  //     errors.cardNumber = 'Numéro de carte requis';
  //   } else if (card.cardNumber.replace(/\s/g, '').length !== 16) {
  //     errors.cardNumber = 'Numéro de carte invalide';
  //   }
  //
  //   if (!card.cardName.trim()) errors.cardName = 'Nom requis';
  //
  //   if (!card.cardExpiry.trim()) {
  //     errors.cardExpiry = 'Date requise';
  //   } else if (!/^\d{2}\/\d{2}$/.test(card.cardExpiry)) {
  //     errors.cardExpiry = 'Format MM/AA';
  //   }
  //
  //   if (!card.cardCvv.trim()) {
  //     errors.cardCvv = 'CVV requis';
  //   } else if (card.cardCvv.length !== 3) {
  //     errors.cardCvv = '3 chiffres';
  //   }
  // }

  console.log('📋 Validation errors found:', errors);
  console.log('📊 Number of errors:', Object.keys(errors).length);

  return errors;
};