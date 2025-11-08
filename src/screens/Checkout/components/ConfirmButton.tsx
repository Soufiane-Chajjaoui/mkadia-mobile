import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Elevation } from '../../../constants/DesignSystem';

interface ConfirmButtonProps {
  total: number;
  originalTotal: number;
  discount: number;
  isProcessing: boolean;
  onPress: () => void;
  currency?: string;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  total,
  originalTotal,
  discount,
  isProcessing,
  onPress,
  currency = '€',
}) => (
  <View style={styles.bottomContainer}>
    <TouchableOpacity
      style={[styles.confirmButton, isProcessing && styles.confirmButtonDisabled]}
      onPress={onPress}
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
                {originalTotal.toFixed(2)} {currency}
              </Text>
            )}
            <Text style={styles.confirmButtonAmount}>{total.toFixed(2)} {currency}</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    ...Elevation.LOW
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
  confirmButtonDisabled: {
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  confirmButtonPriceContainer: {
    alignItems: 'flex-end',
  },
  confirmButtonOldPrice: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.7,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  confirmButtonAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ConfirmButton;