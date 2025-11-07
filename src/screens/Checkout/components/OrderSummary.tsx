import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PriceText from '../../../components/PriceText';
import { Colors } from '../../../constants/DesignSystem';

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  currency?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  deliveryFee,
  discount,
  total,
  currency = '€',
}) => (
  <View style={styles.summaryCard}>
    <Text style={styles.summaryTitle}>Récapitulatif de la commande</Text>

    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Sous-total</Text>
      <PriceText amount={subtotal} style={styles.summaryValue} iconSize={14} />
    </View>

    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Frais de livraison</Text>
      {deliveryFee === 0 ? (
        <Text style={styles.summaryValueFree}>Gratuit</Text>
      ) : (
        <PriceText amount={deliveryFee} style={styles.summaryValue} iconSize={14} />
      )}
    </View>

    {discount > 0 && (
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Réduction</Text>
        <View style={styles.discountContainer}>
          <Text style={styles.summaryValueDiscount}>-</Text>
          <PriceText amount={discount} style={styles.summaryValueDiscount} iconSize={14} iconColor="#DC2626" />
        </View>
      </View>
    )}

    <View style={styles.summaryDivider} />

    <View style={styles.summaryRow}>
      <Text style={styles.summaryTotalLabel}>Total à payer</Text>
      <PriceText amount={total} style={styles.summaryTotalValue} iconSize={18} iconColor="#2563EB" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  summaryValueFree: {
    color: '#059669',
    fontWeight: '600',
  },
  summaryValueDiscount: {
    color: '#DC2626',
    fontWeight: '600',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
  },
});

export default OrderSummary;