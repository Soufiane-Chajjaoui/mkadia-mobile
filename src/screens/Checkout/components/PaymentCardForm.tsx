import React from 'react';
import { View, StyleSheet } from 'react-native';
import SectionCard from './SectionCard';
import FormInput from './FormInput';
import { PaymentCardData, FormErrors } from '../../../types/CheckoutTypes';

interface PaymentCardFormProps {
  data: PaymentCardData;
  onChange: (data: PaymentCardData) => void;
  errors: FormErrors;
}

const PaymentCardForm: React.FC<PaymentCardFormProps> = ({ data, onChange, errors }) => {
  const updateField = (field: keyof PaymentCardData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    updateField('cardNumber', formatted);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      updateField('cardExpiry', cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4));
    } else {
      updateField('cardExpiry', cleaned);
    }
  };

  return (
    <SectionCard title="💳 Informations de paiement">
      <FormInput
        label="Numéro de carte *"
        value={data.cardNumber}
        onChangeText={formatCardNumber}
        placeholder="1234 5678 9012 3456"
        keyboardType="numeric"
        maxLength={19}
        error={errors.cardNumber}
      />
      <FormInput
        label="Nom sur la carte *"
        value={data.cardName}
        onChangeText={(text) => updateField('cardName', text)}
        placeholder="MOHAMMED ALAMI"
        error={errors.cardName}
      />
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <FormInput
            label="Date expiration *"
            value={data.cardExpiry}
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
            value={data.cardCvv}
            onChangeText={(text) => updateField('cardCvv', text)}
            placeholder="123"
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry
            error={errors.cardCvv}
          />
        </View>
      </View>
    </SectionCard>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
});

export default PaymentCardForm;