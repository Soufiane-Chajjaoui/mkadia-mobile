import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CreditCard, DollarSign, Smartphone } from 'lucide-react-native';
import { PaymentMethod } from '../../../types/CheckoutTypes';
import { useToast } from '../../../hooks/useToast';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: (id: string) => void; // ✅ Correction du type
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  isSelected,
  onSelect,
}) => {
  const { showWarning } = useToast(); // ✅ Récupération de showToast

  const IconComponent =
    method.icon === 'card' ? CreditCard : method.icon === 'mobile' ? Smartphone : DollarSign;

  const handlePress = () => {
    // ✅ Vérifier si la méthode est désactivée
    console.log('handlePress', method.disabled);
    if (method.disabled) {
      showWarning("Cette méthode de paiement n'est pas encore disponible ❌', 'error");
      return;
    }

    // ✅ Appeler onSelect avec l'ID
    onSelect(method.id);
  };

  return (
    <TouchableOpacity
      style={[
        styles.paymentCard,
        isSelected && styles.paymentCardSelected,
        // method.disabled && styles.paymentCardDisabled, // ✅ Style pour désactivé
      ]}
      onPress={handlePress} // ✅ Correction : pas de ()
      activeOpacity={0.7}
    >
      <View style={[
        styles.paymentIconContainer,
        isSelected && styles.paymentIconSelected,
        // method.disabled && styles.paymentIconDisabled, // ✅ Style pour désactivé
      ]}>
        <IconComponent size={22} color={method.disabled ? '#D1D5DB' : isSelected ? '#2563EB' : '#6B7280'} />
      </View>

      <View style={styles.paymentInfo}>
        <Text style={[
          styles.paymentName,
          // method.disabled && styles.paymentNameDisabled, // ✅ Style pour désactivé
        ]}>
          {method.name}
        </Text>
        <Text style={styles.paymentDescription}>
          {method.disabled ? 'Bientôt disponible' : method.description}
        </Text>
      </View>

      <View style={[styles.radio, isSelected && styles.radioSelected]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  paymentCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  // ✅ Nouveau style pour désactivé
  paymentCardDisabled: {
    opacity: 0.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  paymentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentIconSelected: {
    backgroundColor: '#DBEAFE',
  },
  // ✅ Nouveau style pour désactivé
  paymentIconDisabled: {
    backgroundColor: '#F3F4F6',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  // ✅ Nouveau style pour désactivé
  paymentNameDisabled: {
    color: '#9CA3AF',
  },
  paymentDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});

export default PaymentMethodCard;