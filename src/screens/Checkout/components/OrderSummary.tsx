import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
      <Text style={styles.summaryValue}>{subtotal.toFixed(2)} {currency}</Text>
    </View>

    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Frais de livraison</Text>
      <Text style={[styles.summaryValue, deliveryFee === 0 && styles.summaryValueFree]}>
        {deliveryFee === 0 ? 'Gratuit' : `${deliveryFee.toFixed(2)} ${currency}`}
      </Text>
    </View>

    {discount > 0 && (
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Réduction</Text>
        <Text style={styles.summaryValueDiscount}>-{discount.toFixed(2)} {currency}</Text>
      </View>
    )}

    <View style={styles.summaryDivider} />

    <View style={styles.summaryRow}>
      <Text style={styles.summaryTotalLabel}>Total à payer</Text>
      <Text style={styles.summaryTotalValue}>{total.toFixed(2)} {currency}</Text>
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