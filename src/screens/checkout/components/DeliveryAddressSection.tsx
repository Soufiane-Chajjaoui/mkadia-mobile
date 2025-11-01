import React from 'react';
import { View, StyleSheet } from 'react-native';
import SectionCard from './SectionCard';
import FormInput from './FormInput';
import { DeliveryAddress, FormErrors } from '../../../types/CheckoutTypes';

interface DeliveryAddressSectionProps {
  data: DeliveryAddress;
  onChange: (data: DeliveryAddress) => void;
  errors: FormErrors;
}

const DeliveryAddressSection: React.FC<DeliveryAddressSectionProps> = ({
  data,
  onChange,
  errors,
}) => {
  const updateField = (field: keyof DeliveryAddress, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <SectionCard title="📍 Adresse de livraison">
      <FormInput
        label="Adresse *"
        value={data.addressLine1}
        onChangeText={(text) => updateField('addressLine1', text)}
        placeholder="45 Boulevard Mohammed V"
        error={errors.address}
      />
      <FormInput
        label="Complément d'adresse"
        value={data.addressLine2 || ''}
        onChangeText={(text) => updateField('addressLine2', text)}
        placeholder="Appartement, étage..."
      />
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <FormInput
            label="Ville *"
            value={data.city}
            onChangeText={(text) => updateField('city', text)}
            placeholder="Tanger"
            error={errors.city}
          />
        </View>
        <View style={styles.halfInput}>
          <FormInput
            label="Code postal *"
            value={data.codePostal}
            onChangeText={(text) => updateField('codePostal', text)}
            placeholder="90000"
            keyboardType="numeric"
            error={errors.codePostal}
          />
        </View>
      </View>
      <FormInput
        label="Téléphone *"
        value={data.phone}
        onChangeText={(text) => updateField('phone', text)}
        placeholder="+212 6 12 34 56 78"
        keyboardType="phone-pad"
        error={errors.phone}
      />
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

export default DeliveryAddressSection;