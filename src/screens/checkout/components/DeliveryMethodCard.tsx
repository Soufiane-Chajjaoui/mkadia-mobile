import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, Package, Truck, Clock } from 'lucide-react-native';
import { DeliveryMethod } from '../../../types/CheckoutTypes';

interface DeliveryMethodCardProps {
  method: DeliveryMethod;
  isSelected: boolean;
  onSelect: () => void;
  currency?: string;
}

const DeliveryMethodCard: React.FC<DeliveryMethodCardProps> = ({
  method,
  isSelected,
  onSelect,
  currency = '€',
}) => {
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
          {method.price === 0 ? 'Gratuit' : `${method.price} ${currency}`}
        </Text>
      </View>

      <View style={[styles.radio, isSelected && styles.radioSelected]}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  methodCardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  methodIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodIconSelected: {
    backgroundColor: '#DBEAFE',
  },
  methodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  methodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  methodTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  methodTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  methodPriceContainer: {
    marginRight: 12,
  },
  methodPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  methodPriceFree: {
    color: '#059669',
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

export default DeliveryMethodCard;