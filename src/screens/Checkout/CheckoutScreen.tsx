// import React, { useState } from 'react';
// import {
//   View,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import type { RouteProp } from '@react-navigation/native';
// import { Animated } from 'react-native';

// import { RootStackParamList } from '../../types/navigation';
// import { CouponResponse, applyPromoCode$, checkout$ } from '../../apis/CheckoutAPI';
// import { deliveryMethods, paymentMethods } from '../../constants/CheckoutData';
// import { DeliveryAddress, PaymentCardData, FormErrors, OrderRequest } from '../../types/CheckoutTypes';
// import { validateCheckoutForm } from '../../utils/validators/checkoutValidators';
// import ConfirmButton from './components/ConfirmButton';
// import DeliveryAddressSection from './components/DeliveryAddressSection';
// import DeliveryMethodSection from './components/DeliveryMethodSection';
// import OrderSummary from './components/OrderSummary';
// import PaymentCardForm from './components/PaymentCardForm';
// import PaymentMethodSection from './components/PaymentMethodSection';
// import PromoCodeComponent from './components/PromoCode';
// import CheckoutHeader from './components/CheckoutHeader';
// import { useToast } from '../../context/ToastContext';

// const CURRENCY = '€';

// type CheckoutScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   'Checkout'
// >;
// type CheckoutScreenRouteProp = RouteProp<RootStackParamList, 'Checkout'>;

// interface CheckoutScreenProps {
//   navigation: CheckoutScreenNavigationProp;
//   route: CheckoutScreenRouteProp;
// }

// const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ route, navigation }) => {
//   const subtotal = route.params.subtotal;
//   const items = route.params.items;

//   // ✅ Plus besoin de gérer visible/hideToast ici
//   const { showToast, showSuccess, showError } = useToast();

//   const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
//     address_line1: '',
//     address_line2: '',
//     city: '',
//     codePostal: '',
//     phone: '',
//   });

//   const [appliedPromo, setAppliedPromo] = useState<CouponResponse | null>(null);
//   const [isApplyingPromo, setIsApplyingPromo] = useState(false);
//   const [promoError, setPromoError] = useState<string | null>(null);
//   const [animatedValue] = useState(new Animated.Value(1));

//   const [selectedDelivery, setSelectedDelivery] = useState('STANDARD');
//   const [selectedPayment, setSelectedPayment] = useState('CARD');

//   const [paymentCard, setPaymentCard] = useState<PaymentCardData>({
//     cardNumber: '',
//     cardName: '',
//     cardExpiry: '',
//     cardCvv: '',
//   });

//   const [isProcessing, setIsProcessing] = useState(false);
//   const [errors, setErrors] = useState<FormErrors>({});

//   const selectedDeliveryMethod = deliveryMethods.find(m => m.id === selectedDelivery);
//   const deliveryFee = selectedDeliveryMethod?.price || 0;

//   const calculateDiscount = (): number => {
//     if (!appliedPromo) return 0;

//     if (appliedPromo.discountType === 'PERCENTAGE' || appliedPromo.discountType === 'FIXED') {
//       return appliedPromo.discountValue!;
//     } else if (appliedPromo.discountType === 'FREE_DELIVERY') {
//       return deliveryFee;
//     }

//     return 0;
//   };

//   const discount = calculateDiscount();
//   const total = Math.max(0, subtotal + deliveryFee - discount);

//   const handleRemovePromo = () => {
//     Alert.alert(
//       "Supprimer le code promo",
//       "Voulez-vous vraiment retirer ce code promo ?",
//       [
//         { text: "Annuler", style: "cancel" },
//         {
//           text: "Supprimer",
//           style: "destructive",
//           onPress: () => {
//             setAppliedPromo(null);
//             setPromoError(null);

//             Animated.sequence([
//               Animated.timing(animatedValue, { toValue: 1.05, duration: 100, useNativeDriver: true }),
//               Animated.timing(animatedValue, { toValue: 1, duration: 100, useNativeDriver: true })
//             ]).start();

//             showSuccess('Code promo supprimé'); // ✅ Utilisation du toast global
//           }
//         }
//       ]
//     );
//   };

//   const handleApplyPromo = (code: string) => {
//     setIsApplyingPromo(true);
//     setPromoError(null);

//     applyPromoCode$(code, subtotal).subscribe({
//       next: (response) => {
//         setAppliedPromo(response);
//         setIsApplyingPromo(false);

//         Animated.sequence([
//           Animated.timing(animatedValue, { toValue: 0.95, duration: 100, useNativeDriver: true }),
//           Animated.spring(animatedValue, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true })
//         ]).start();

//         let message = '';
//         if (response.discountType === 'PERCENTAGE') {
//           message = `Vous économisez ${response.discountValue}% sur votre commande`;
//         } else if (response.discountType === 'FIXED') {
//           message = `Vous économisez ${response.discountValue!.toFixed(2)} ${CURRENCY}`;
//         } else if (response.discountType === 'FREE_DELIVERY') {
//           message = `Livraison gratuite appliquée !`;
//         }

//         showSuccess(message || response.message || ''); // ✅ Utilisation du toast global
//       },
//       error: (error) => {
//         setIsApplyingPromo(false);
//         setPromoError(error.message);

//         Animated.sequence([
//           Animated.timing(animatedValue, { toValue: 1.02, duration: 50, useNativeDriver: true }),
//           Animated.timing(animatedValue, { toValue: 0.98, duration: 50, useNativeDriver: true }),
//           Animated.timing(animatedValue, { toValue: 1.02, duration: 50, useNativeDriver: true }),
//           Animated.timing(animatedValue, { toValue: 1, duration: 50, useNativeDriver: true })
//         ]).start();

//         showError(error.message || 'Code promo invalide'); // ✅ Utilisation du toast global
//       }
//     });
//   };

//   const handleConfirmOrder = async () => {
//     console.log('Confirming order...');
//     const validationErrors = validateCheckoutForm(
//       deliveryAddress,
//       paymentCard,
//       selectedPayment
//     );

//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       showError('Veuillez remplir tous les champs requis'); // ✅ Utilisation du toast global
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const orderData: OrderRequest = {
//         address: deliveryAddress,
//         delivery: { mode: selectedDelivery },
//         payment: { method: selectedPayment },
//         items: items,
//         coupon: appliedPromo ? {
//           code: appliedPromo.code,
//         } : {
//           code: "",
//         }
//       };
      
//       console.log('Order Data:', orderData);
      
//       checkout$(orderData).subscribe({
//         next: (response) => {
//           console.log('Order Response:', response);
//           showSuccess('Commande confirmée avec succès !'); // ✅ Utilisation du toast global
//         },
//         error: (error) => {
//           console.error('Order Error:', error);
//           showError('Erreur lors de la commande'); // ✅ Utilisation du toast global
//         }
//       });
//     } catch (error) {
//       showError('Une erreur est survenue. Réessayez.'); // ✅ Utilisation du toast global
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <CheckoutHeader onBack={() => navigation.goBack()} />

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.flex}
//       >
//         <ScrollView
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >          
//           <DeliveryAddressSection
//             data={deliveryAddress}
//             onChange={setDeliveryAddress}
//             errors={errors}
//           />

//           <DeliveryMethodSection
//             methods={deliveryMethods}
//             selectedId={selectedDelivery}
//             onSelect={setSelectedDelivery}
//           />

//           <PaymentMethodSection
//             methods={paymentMethods}
//             selectedId={selectedPayment}
//             onSelect={setSelectedPayment}
//           />

//           {selectedPayment === 'card' && (
//             <PaymentCardForm
//               data={paymentCard}
//               onChange={setPaymentCard}
//               errors={errors}
//             />
//           )}

//           <PromoCodeComponent
//             appliedPromo={appliedPromo}
//             onApplyPromo={handleApplyPromo}
//             onRemovePromo={handleRemovePromo}
//             animatedValue={animatedValue}
//             isLoading={isApplyingPromo}
//             error={promoError}
//           />

//           <OrderSummary
//             subtotal={subtotal}
//             deliveryFee={deliveryFee}
//             discount={discount}
//             total={total}
//             currency={CURRENCY}
//           />

//           <View style={{ height: 100 }} />
//         </ScrollView>

//         <ConfirmButton
//           total={total}
//           originalTotal={subtotal + deliveryFee}
//           discount={discount}
//           isProcessing={isProcessing}
//           onPress={handleConfirmOrder}
//           currency={CURRENCY}
//         />
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F9FAFB' },
//   flex: { flex: 1 },
//   scrollView: { flex: 1 },
//   scrollContent: { padding: 16 },
// });

// export default CheckoutScreen;


import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Animated } from 'react-native';

import { RootStackParamList } from '../../types/navigation';
import { 
  CouponResponse, 
  applyPromoCode$, 
  checkout$, 
  getAddresses$,
  deleteAddress$ 
} from '../../apis/CheckoutAPI';
import { deliveryMethods, paymentMethods } from '../../constants/CheckoutData';
import { DeliveryAddress, PaymentCard, FormErrors, OrderRequest } from '../../types/CheckoutTypes';
import { validateCheckoutForm } from '../../utils/validators/checkoutValidators';
import ConfirmButton from './components/ConfirmButton';
import DeliveryAddressSection from './components/DeliveryAddressSection';
import DeliveryMethodSection from './components/DeliveryMethodSection';
import OrderSummary from './components/OrderSummary';
import PaymentCardForm from './components/PaymentCardForm';
import PaymentMethodSection from './components/PaymentMethodSection';
import PromoCodeComponent from './components/PromoCode';
import CheckoutHeader from './components/CheckoutHeader';
import AddressSelector from './components/AddressSelector';
import { useToast } from '../../context/ToastContext';

const CURRENCY = '€';

type CheckoutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Checkout'
>;
type CheckoutScreenRouteProp = RouteProp<RootStackParamList, 'Checkout'>;

interface CheckoutScreenProps {
  navigation: CheckoutScreenNavigationProp;
  route: CheckoutScreenRouteProp;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ route, navigation }) => {
  const subtotal = route.params.subtotal;
  const items = route.params.items;

  const { showSuccess, showError, showInfo } = useToast();

  // ✅ État pour les adresses sauvegardées
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<DeliveryAddress | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    addressLine1: '',
    addressLine2: '',
    city: '',
    codePostal: '',
    phone: '',
  });

  const [appliedPromo, setAppliedPromo] = useState<CouponResponse | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [animatedValue] = useState(new Animated.Value(1));

  const [selectedDelivery, setSelectedDelivery] = useState('STANDARD');
  const [selectedPayment, setSelectedPayment] = useState('CARD');

  const [paymentCard, setPaymentCard] = useState<PaymentCard>({
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // ✅ Charger les adresses au montage du composant
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = () => {
    setLoadingAddresses(true);
    getAddresses$().subscribe({
      next: (addresses) => {
        setSavedAddresses(addresses);
        
        // ✅ Sélectionner automatiquement l'adresse par défaut
        const defaultAddress = addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedSavedAddress(defaultAddress);
          setDeliveryAddress(defaultAddress);
        } else if (addresses.length > 0) {
          // Sinon, sélectionner la première
          setSelectedSavedAddress(addresses[0]);
          setDeliveryAddress(addresses[0]);
        } else {
          // Aucune adresse → afficher le formulaire manuel
          setShowManualForm(true);
        }
        
        setLoadingAddresses(false);
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        showError('Erreur lors du chargement des adresses');
        setLoadingAddresses(false);
        setShowManualForm(true); // Afficher le formulaire en cas d'erreur
      }
    });
  };

  const handleSelectAddress = (address: DeliveryAddress) => {
    setSelectedSavedAddress(address);
    setDeliveryAddress(address);
    setShowManualForm(false);
    showInfo('Adresse sélectionnée');
  };

  const handleAddNewAddress = () => {
    setShowManualForm(true);
    setSelectedSavedAddress(null);
    setDeliveryAddress({
      addressLine1: '',
      addressLine2: '',
      city: '',
      codePostal: '',
      phone: '',
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Supprimer l\'adresse',
      'Voulez-vous vraiment supprimer cette adresse ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deleteAddress$(addressId).subscribe({
              next: () => {
                showSuccess('Adresse supprimée');
                loadAddresses(); // Recharger la liste
              },
              error: (error) => {
                showError('Erreur lors de la suppression');
              }
            });
          }
        }
      ]
    );
  };

  const selectedDeliveryMethod = deliveryMethods.find(m => m.id === selectedDelivery);
  const deliveryFee = selectedDeliveryMethod?.price || 0;

  const calculateDiscount = (): number => {
    if (!appliedPromo) return 0;

    if (appliedPromo.discountType === 'PERCENTAGE' || appliedPromo.discountType === 'FIXED') {
      return appliedPromo.discountValue!;
    } else if (appliedPromo.discountType === 'FREE_DELIVERY') {
      return deliveryFee;
    }

    return 0;
  };

  const discount = calculateDiscount();
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const handleRemovePromo = () => {
    Alert.alert(
      "Supprimer le code promo",
      "Voulez-vous vraiment retirer ce code promo ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            setAppliedPromo(null);
            setPromoError(null);

            Animated.sequence([
              Animated.timing(animatedValue, { toValue: 1.05, duration: 100, useNativeDriver: true }),
              Animated.timing(animatedValue, { toValue: 1, duration: 100, useNativeDriver: true })
            ]).start();

            showSuccess('Code promo supprimé');
          }
        }
      ]
    );
  };

  const handleApplyPromo = (code: string) => {
    setIsApplyingPromo(true);
    setPromoError(null);

    applyPromoCode$(code, subtotal).subscribe({
      next: (response) => {
        setAppliedPromo(response);
        setIsApplyingPromo(false);

        Animated.sequence([
          Animated.timing(animatedValue, { toValue: 0.95, duration: 100, useNativeDriver: true }),
          Animated.spring(animatedValue, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true })
        ]).start();

        let message = '';
        if (response.discountType === 'PERCENTAGE') {
          message = `Vous économisez ${response.discountValue}% sur votre commande`;
        } else if (response.discountType === 'FIXED') {
          message = `Vous économisez ${response.discountValue!.toFixed(2)} ${CURRENCY}`;
        } else if (response.discountType === 'FREE_DELIVERY') {
          message = `Livraison gratuite appliquée !`;
        }

        showSuccess(message || response.message || '');
      },
      error: (error) => {
        setIsApplyingPromo(false);
        setPromoError(error.message);

        Animated.sequence([
          Animated.timing(animatedValue, { toValue: 1.02, duration: 50, useNativeDriver: true }),
          Animated.timing(animatedValue, { toValue: 0.98, duration: 50, useNativeDriver: true }),
          Animated.timing(animatedValue, { toValue: 1.02, duration: 50, useNativeDriver: true }),
          Animated.timing(animatedValue, { toValue: 1, duration: 50, useNativeDriver: true })
        ]).start();

        showError(error.message || 'Code promo invalide');
      }
    });
  };

  const handleConfirmOrder = async () => {
    console.log('Confirming order...');
    const validationErrors = validateCheckoutForm(
      deliveryAddress,
      paymentCard,
      selectedPayment
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showError('Veuillez remplir tous les champs requis');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData: OrderRequest = {
        address: deliveryAddress,
        delivery: { mode: selectedDelivery },
        payment: { method: selectedPayment },
        items: items,
        coupon: appliedPromo ? {
          code: appliedPromo.code,
        } : {
          code: "",
        }
      };
      
      console.log('Order Data:', orderData);
      
      checkout$(orderData).subscribe({
        next: (response) => {
          console.log('Order Response:', response);
          showSuccess('Commande confirmée avec succès !');
        },
        error: (error) => {
          console.error('Order Error:', error);
          showError('Erreur lors de la commande');
        }
      });
    } catch (error) {
      showError('Une erreur est survenue. Réessayez.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CheckoutHeader onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ✅ Sélecteur d'adresses */}
          <AddressSelector
            addresses={savedAddresses}
            selectedAddress={selectedSavedAddress}
            onSelectAddress={handleSelectAddress}
            onAddNew={handleAddNewAddress}
            onDelete={handleDeleteAddress}
            loading={loadingAddresses}
          />

          {/* ✅ Formulaire manuel (affiché si nouvelle adresse ou pas d'adresse sauvegardée) */}
          {showManualForm && (
            <DeliveryAddressSection
              data={deliveryAddress}
              onChange={setDeliveryAddress}
              errors={errors}
            />
          )}

          <DeliveryMethodSection
            methods={deliveryMethods}
            selectedId={selectedDelivery}
            onSelect={setSelectedDelivery}
          />

          <PaymentMethodSection
            methods={paymentMethods}
            selectedId={selectedPayment}
            onSelect={setSelectedPayment}
          />

          {selectedPayment === 'card' && (
            <PaymentCardForm
              data={paymentCard}
              onChange={setPaymentCard}
              errors={errors}
            />
          )}

          <PromoCodeComponent
            appliedPromo={appliedPromo}
            onApplyPromo={handleApplyPromo}
            onRemovePromo={handleRemovePromo}
            animatedValue={animatedValue}
            isLoading={isApplyingPromo}
            error={promoError}
          />

          <OrderSummary
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            discount={discount}
            total={total}
            currency={CURRENCY}
          />

          <View style={{ height: 100 }} />
        </ScrollView>

        <ConfirmButton
          total={total}
          originalTotal={subtotal + deliveryFee}
          discount={discount}
          isProcessing={isProcessing}
          onPress={handleConfirmOrder}
          currency={CURRENCY}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
});

export default CheckoutScreen;