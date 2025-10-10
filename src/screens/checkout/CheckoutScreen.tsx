import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInputProps,
  Animated,
} from 'react-native';
import {
  ArrowLeft,
  Home,
  Package,
  Truck,
  Clock,
  CreditCard,
  DollarSign,
  Smartphone,
} from 'lucide-react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import PromoCodeComponent from './components/PromoCode';
import { applyPromoCode$, CouponResponse } from '../../apis/CartAPI';

// ============================================
// TYPES
// ============================================
type RootStackParamList = {
  Cart: undefined;
  Checkout: { subtotal: number; cartItems?: any[] };
  OrderConfirmation: { orderId: string };
};

type CheckoutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Checkout'
>;
type CheckoutScreenRouteProp = RouteProp<RootStackParamList, 'Checkout'>;

interface CheckoutScreenProps {
  navigation: CheckoutScreenNavigationProp;
  route: CheckoutScreenRouteProp;
}

interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: 'package' | 'truck' | 'home';
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: 'card' | 'cash' | 'mobile';
}

interface FormErrors {
  address?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
}

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
}

interface FormInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  icon?: string;
  error?: string;
  secureTextEntry?: boolean;
  maxLength?: number;
}

interface DeliveryMethodCardProps {
  method: DeliveryMethod;
  isSelected: boolean;
  onSelect: () => void;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
}

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

// ============================================
// MOCK DATA
// ============================================
const deliveryMethods: DeliveryMethod[] = [
  {
    id: 'standard',
    name: 'Livraison Standard',
    description: 'Livraison sous 3-5 jours ouvrés',
    price: 0,
    estimatedDays: '3-5 jours',
    icon: 'package',
  },
  {
    id: 'express',
    name: 'Livraison Express',
    description: 'Livraison sous 24-48h',
    price: 30,
    estimatedDays: '24-48h',
    icon: 'truck',
  },
  {
    id: 'pickup',
    name: 'Retrait en Point Relais',
    description: 'Disponible sous 2-3 jours',
    price: 15,
    estimatedDays: '2-3 jours',
    icon: 'home',
  },
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Carte bancaire',
    description: 'Visa, Mastercard, Amex',
    icon: 'card',
  },
  {
    id: 'cash',
    name: 'Paiement à la livraison',
    description: 'Espèces ou carte à la réception',
    icon: 'cash',
  },
  {
    id: 'mobile',
    name: 'Paiement mobile',
    description: 'Orange Money, Maroc Telecom',
    icon: 'mobile',
  },
];

// ============================================
// COMPOSANTS
// ============================================

// Header avec progression
const CheckoutHeader: React.FC<HeaderProps> = ({ currentStep, totalSteps, onBack }) => (
  <View style={styles.header}>
    <View style={styles.headerTop}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <ArrowLeft size={24} color="#1F2937" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Paiement</Text>
      <Text style={styles.headerStep}>Étape {currentStep}/{totalSteps}</Text>
    </View>

    <View style={styles.progressContainer}>
      {[...Array(totalSteps)].map((_, i) => (
        <View
          key={i}
          style={[
            styles.progressBar,
            i < currentStep && styles.progressBarActive,
          ]}
        />
      ))}
    </View>
  </View>
);

// Section container
const SectionCard: React.FC<SectionCardProps> = ({ title, children }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

// Input amélioré
const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  error,
  secureTextEntry = false,
  maxLength,
}) => (
  <View style={styles.inputContainer}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      placeholderTextColor="#9CA3AF"
      secureTextEntry={secureTextEntry}
      maxLength={maxLength}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

// Carte méthode de livraison
const DeliveryMethodCard: React.FC<DeliveryMethodCardProps> = ({ method, isSelected, onSelect }) => {
  const IconComponent = method.icon === 'truck' ? Truck : method.icon === 'home' ? Home : Package;

  return (
    <TouchableOpacity
      style={[styles.methodCard, isSelected && styles.methodCardSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={[styles.methodIconContainer, isSelected && styles.methodIconSelected]}>
        <IconComponent size={22} color={isSelected ? '#2563EB' : '#6B7280'} />
      </View>

      <View style={styles.methodInfo}>
        <Text style={styles.methodName}>{method.name}</Text>
        <Text style={styles.methodDescription}>{method.description}</Text>
        <View style={styles.methodTimeContainer}>
          <Clock size={12} color="#9CA3AF" />
          <Text style={styles.methodTime}>{method.estimatedDays}</Text>
        </View>
      </View>

      <View style={styles.methodPriceContainer}>
        <Text style={[styles.methodPrice, method.price === 0 && styles.methodPriceFree]}>
          {method.price === 0 ? 'Gratuit' : `${method.price} DH`}
        </Text>
      </View>

      <View style={[styles.radio, isSelected && styles.radioSelected]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
};

// Carte méthode de paiement
const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ method, isSelected, onSelect }) => {
  const IconComponent = method.icon === 'card' ? CreditCard : method.icon === 'mobile' ? Smartphone : DollarSign;

  return (
    <TouchableOpacity
      style={[styles.paymentCard, isSelected && styles.paymentCardSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={[styles.paymentIconContainer, isSelected && styles.paymentIconSelected]}>
        <IconComponent size={22} color={isSelected ? '#2563EB' : '#6B7280'} />
      </View>

      <View style={styles.paymentInfo}>
        <Text style={styles.paymentName}>{method.name}</Text>
        <Text style={styles.paymentDescription}>{method.description}</Text>
      </View>

      <View style={[styles.radio, isSelected && styles.radioSelected]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
};

// Résumé de commande
const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, deliveryFee, discount, total }) => (
  <View style={styles.summaryCard}>
    <Text style={styles.summaryTitle}>Récapitulatif de la commande</Text>

    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Sous-total</Text>
      <Text style={styles.summaryValue}>{subtotal.toFixed(2)} DH</Text>
    </View>

    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Frais de livraison</Text>
      <Text style={[styles.summaryValue, deliveryFee === 0 && styles.summaryValueFree]}>
        {deliveryFee === 0 ? 'Gratuit' : `${deliveryFee.toFixed(2)} DH`}
      </Text>
    </View>

    {discount > 0 && (
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Réduction</Text>
        <Text style={styles.summaryValueDiscount}>-{discount.toFixed(2)} DH</Text>
      </View>
    )}

    <View style={styles.summaryDivider} />

    <View style={styles.summaryRow}>
      <Text style={styles.summaryTotalLabel}>Total à payer</Text>
      <Text style={styles.summaryTotalValue}>{total.toFixed(2)} DH</Text>
    </View>
  </View>
);

// ============================================
// ÉCRAN PRINCIPAL
// ============================================
const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ route, navigation }) => {
  // Props
  const subtotal = 598 //} = route.params;

  // États - Adresse
  const [address, setAddress] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  // États - Code promo
  const [appliedPromo, setAppliedPromo] = useState<CouponResponse | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [animatedValue] = useState(new Animated.Value(1));

  // États - Livraison & Paiement
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('card');

  // États - Informations carte
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // ============================================
  // CALCULS AVEC CODE PROMO
  // ============================================
  const selectedDeliveryMethod = deliveryMethods.find(m => m.id === selectedDelivery);
  const deliveryFee = selectedDeliveryMethod?.price || 0;

  // Calcul de la réduction en fonction du type de code promo
  const calculateDiscount = (): number => {
    if (!appliedPromo) return 0;

    if (appliedPromo.discountType === 'PERCENTAGE') {
      // Réduction en pourcentage sur le sous-total
      return (subtotal * appliedPromo.discountValue) / 100;
    } else if (appliedPromo.discountType === 'FIXED') {
      // Réduction fixe
      return appliedPromo.discountValue;
    } else if (appliedPromo.discountType === 'FREE_DELIVERY') {
      // Livraison gratuite
      return deliveryFee;
    }

    return 0;
  };

  const discount = calculateDiscount();

  // Calcul du total final
  const total = Math.max(0, subtotal + deliveryFee - discount);

  // ============================================
  // GESTION CODE PROMO
  // ============================================
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

            Alert.alert("Code promo supprimé", "La réduction a été retirée de votre commande");
          }
        }
      ]
    );
  };

  const handleApplyPromo = (code: string) => {
    setIsApplyingPromo(true);
    setPromoError(null);

    // Calcul du montant avant réduction (sous-total + livraison)
    const orderAmount = subtotal + deliveryFee;

    applyPromoCode$(code, orderAmount).subscribe({
      next: (response) => {
        console.log("Code promo appliqué:", response);

        setAppliedPromo(response);
        setIsApplyingPromo(false);

        // Animation de succès
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.spring(animatedValue, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true
          })
        ]).start();

        // Message personnalisé selon le type de réduction
        let message = '';
        if (response.discountType === 'PERCENTAGE') {
          message = `Vous économisez ${response.discountValue}% sur votre commande`;
        } else if (response.discountType === 'FIXED') {
          message = `Vous économisez ${response.discountValue.toFixed(2)} DH`;
        } else if (response.discountType === 'FREE_DELIVERY') {
          message = `Livraison gratuite appliquée !`;
        }

        Alert.alert(
          "Code promo appliqué ✅",
          message || response.message,
          [{ text: "Super !", style: "default" }]
        );
      },
      error: (error) => {
        console.error("Erreur code promo:", error);
        setIsApplyingPromo(false);
        setPromoError(error.message);

        // Animation d'erreur (shake)
        Animated.sequence([
          Animated.timing(animatedValue, { toValue: 1.02, duration: 50, useNativeDriver: true }),
          Animated.timing(animatedValue, { toValue: 0.98, duration: 50, useNativeDriver: true }),
          Animated.timing(animatedValue, { toValue: 1.02, duration: 50, useNativeDriver: true }),
          Animated.timing(animatedValue, { toValue: 1, duration: 50, useNativeDriver: true })
        ]).start();

        Alert.alert(
          "Code invalide ❌",
          error.message || "Veuillez vérifier votre code promo",
          [{ text: "OK", style: "cancel" }]
        );
      }
    });
  };

  // ============================================
  // FORMATAGE
  // ============================================
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      setCardExpiry(cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4));
    } else {
      setCardExpiry(cleaned);
    }
  };

  // ============================================
  // VALIDATION
  // ============================================
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation adresse
    if (!address.trim()) newErrors.address = 'Adresse requise';
    if (!city.trim()) newErrors.city = 'Ville requise';
    if (!postalCode.trim()) newErrors.postalCode = 'Code postal requis';
    if (!phone.trim()) newErrors.phone = 'Téléphone requis';
    else if (!/^(\+212|0)[5-7]\d{8}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numéro invalide';
    }

    // Validation paiement carte
    if (selectedPayment === 'card') {
      if (!cardNumber.trim()) newErrors.cardNumber = 'Numéro de carte requis';
      else if (cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Numéro de carte invalide';
      }
      if (!cardName.trim()) newErrors.cardName = 'Nom requis';
      if (!cardExpiry.trim()) newErrors.cardExpiry = 'Date requise';
      else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        newErrors.cardExpiry = 'Format MM/AA';
      }
      if (!cardCvv.trim()) newErrors.cardCvv = 'CVV requis';
      else if (cardCvv.length !== 3) {
        newErrors.cardCvv = '3 chiffres';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // CONFIRMATION COMMANDE
  // ============================================
  const handleConfirmOrder = async () => {
    if (!validateForm()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs requis');
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise<void>(resolve => setTimeout(() => resolve(), 2000));

      const orderData = {
        address: { 
          addressLine1: address, 
          addressLine2, 
          city, 
          postalCode, 
          phone 
        },
        delivery: { 
          methodId: selectedDelivery, 
          fee: deliveryFee 
        },
        payment: { 
          methodId: selectedPayment 
        },
        amounts: { 
          subtotal, 
          deliveryFee, 
          discount, 
          total 
        },
        promoCode: appliedPromo ? {
          code: appliedPromo.code,
          discountType: appliedPromo.discountType,
          discountValue: discount
        } : null
      };

      console.log('Order Data:', orderData);

      Alert.alert(
        'Commande confirmée ✅',
        `Votre commande de ${total.toFixed(2)} DH a été enregistrée avec succès !${discount > 0 ? `\n\n💰 Vous avez économisé ${discount.toFixed(2)} DH` : ''}`,
        [
          {
            text: 'Voir ma commande',
            onPress: () => navigation.navigate('OrderConfirmation', { orderId: '12345' }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue. Réessayez.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CheckoutHeader currentStep={3} totalSteps={4} onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Adresse de livraison */}
          <SectionCard title="📍 Adresse de livraison">
            <FormInput
              label="Adresse *"
              value={address}
              onChangeText={setAddress}
              placeholder="45 Boulevard Mohammed V"
              error={errors.address}
            />
            <FormInput
              label="Complément d'adresse"
              value={addressLine2}
              onChangeText={setAddressLine2}
              placeholder="Appartement, étage..."
            />
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <FormInput
                  label="Ville *"
                  value={city}
                  onChangeText={setCity}
                  placeholder="Tanger"
                  error={errors.city}
                />
              </View>
              <View style={styles.halfInput}>
                <FormInput
                  label="Code postal *"
                  value={postalCode}
                  onChangeText={setPostalCode}
                  placeholder="90000"
                  keyboardType="numeric"
                  error={errors.postalCode}
                />
              </View>
            </View>
            <FormInput
              label="Téléphone *"
              value={phone}
              onChangeText={setPhone}
              placeholder="+212 6 12 34 56 78"
              keyboardType="phone-pad"
              error={errors.phone}
            />
          </SectionCard>

          {/* Mode de livraison */}
          <SectionCard title="🚚 Mode de livraison">
            {deliveryMethods.map(method => (
              <DeliveryMethodCard
                key={method.id}
                method={method}
                isSelected={selectedDelivery === method.id}
                onSelect={() => setSelectedDelivery(method.id)}
              />
            ))}
          </SectionCard>

          {/* Méthode de paiement */}
          <SectionCard title="💳 Méthode de paiement">
            {paymentMethods.map(method => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                isSelected={selectedPayment === method.id}
                onSelect={() => setSelectedPayment(method.id)}
              />
            ))}
          </SectionCard>

          {/* Formulaire carte bancaire */}
          {selectedPayment === 'card' && (
            <SectionCard title="💳 Informations de paiement">
              <FormInput
                label="Numéro de carte *"
                value={cardNumber}
                onChangeText={formatCardNumber}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19}
                error={errors.cardNumber}
              />
              <FormInput
                label="Nom sur la carte *"
                value={cardName}
                onChangeText={setCardName}
                placeholder="MOHAMMED ALAMI"
                error={errors.cardName}
              />
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <FormInput
                    label="Date expiration *"
                    value={cardExpiry}
                    onChangeText={formatExpiry}
                    placeholder="MM/AA"
                    keyboardType="numeric"
                    maxLength={5}
                    error={errors.cardExpiry}
                  />
                </View>
                <View style={styles.halfInput}>
                  <FormInput
                    label="CVV *"
                    value={cardCvv}
                    onChangeText={setCardCvv}
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                    error={errors.cardCvv}
                  />
                </View>
              </View>
            </SectionCard>
          )}

          {/* Code promo */}
          <PromoCodeComponent
            appliedPromo={appliedPromo}
            onApplyPromo={handleApplyPromo}
            onRemovePromo={handleRemovePromo}
            animatedValue={animatedValue}
            isLoading={isApplyingPromo}
            error={promoError}
          />

          {/* Résumé avec réduction appliquée */}
          <OrderSummary
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            discount={discount}
            total={total}
          />

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bouton confirmation avec montant final */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.confirmButton, isProcessing && styles.confirmButtonDisabled]}
            onPress={handleConfirmOrder}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.confirmButtonText}>Confirmer et payer</Text>
                <View style={styles.confirmButtonPriceContainer}>
                  {discount > 0 && (
                    <Text style={styles.confirmButtonOldPrice}>
                      {(subtotal + deliveryFee).toFixed(2)} DH
                    </Text>
                  )}
                  <Text style={styles.confirmButtonAmount}>{total.toFixed(2)} DH</Text>
                </View>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backButton: { marginRight: 12, padding: 4 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#1F2937' },
  headerStep: { fontSize: 14, color: '#6B7280' },
  progressContainer: { flexDirection: 'row', gap: 8 },
  progressBar: { flex: 1, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 },
  progressBarActive: { backgroundColor: '#2563EB' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  inputError: { borderColor: '#DC2626' },
  errorText: { fontSize: 12, color: '#DC2626', marginTop: 4 },
  row: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  methodCardSelected: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  methodIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodIconSelected: { backgroundColor: '#DBEAFE' },
  methodInfo: { flex: 1, marginLeft: 12 },
  methodName: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  methodDescription: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  methodTimeContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  methodTime: { fontSize: 11, color: '#9CA3AF' },
  methodPriceContainer: { marginRight: 12 },
  methodPrice: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  methodPriceFree: { color: '#059669' },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  paymentCardSelected: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  paymentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentIconSelected: { backgroundColor: '#DBEAFE' },
  paymentInfo: { flex: 1, marginLeft: 12 },
  paymentName: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  paymentDescription: { fontSize: 12, color: '#6B7280' },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: { borderColor: '#2563EB', backgroundColor: '#2563EB' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF' },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#6B7280' },
  summaryValue: { fontSize: 14, fontWeight: '500', color: '#1F2937' },
  summaryValueFree: { color: '#059669', fontWeight: '600' },
  summaryValueDiscount: { color: '#DC2626', fontWeight: '600' },
  summaryDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
  summaryTotalLabel: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  summaryTotalValue: { fontSize: 18, fontWeight: '700', color: '#2563EB' },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  confirmButtonDisabled: { backgroundColor: '#9CA3AF', justifyContent: 'center' },
  confirmButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  confirmButtonPriceContainer: { alignItems: 'flex-end' },
  confirmButtonOldPrice: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.7,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  confirmButtonAmount: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
});