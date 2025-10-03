import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Info } from 'lucide-react-native';
import { Colors, IconSize, Spacing, Elevation, Typography, BorderRadius } from '../../../constants/DesignSystem';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  promoDiscount: number;
  total: number;
  appliedPromo: {code: string; discount: number} | null;
  formatPrice: (price: number) => string;
}

const OrderSummaryComponent: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping,
  tax,
  promoDiscount,
  total,
  appliedPromo,
  formatPrice
}) => {
  return (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Récapitulatif de commande</Text>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Sous-total</Text>
        <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Livraison</Text>
        <Text style={[styles.summaryValue, shipping === 0 && styles.freeShipping]}>
          {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
        </Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>TVA</Text>
        <Text style={styles.summaryValue}>{formatPrice(tax)}</Text>
      </View>
      
      {appliedPromo && (
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: Colors.GREEN_TEXT }]}>
            Réduction ({appliedPromo.code})
          </Text>
          <Text style={[styles.summaryValue, { color: Colors.GREEN_TEXT }]}>
            -{formatPrice(promoDiscount)}
          </Text>
        </View>
      )}
      
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatPrice(total)}</Text>
      </View>

      {shipping > 0 && (
        <View style={styles.freeShippingNotice}>
          <Info size={IconSize.SM} color={Colors.ORANGE_TEXT} />
          <Text style={styles.freeShippingText}>
            Ajoutez {formatPrice(35 - subtotal)} de plus pour obtenir la livraison gratuite !
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    backgroundColor: Colors.WHITE,
    marginTop: Spacing.XXS,
    padding: Spacing.LG,
    borderBottomWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BG,
    ...Elevation.LOW,
  } as ViewStyle,
  summaryTitle: {
    ...Typography.HEADLINE,
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.LG,
    fontSize: 20,
    fontWeight: '800',
  } as TextStyle,
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.LG,
    alignItems: 'center',
  } as ViewStyle,
  summaryLabel: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    fontSize: 15,
  } as TextStyle,
  summaryValue: {
    ...Typography.SUBHEAD,
    color: Colors.DARK_BLUE_TEXT,
    fontWeight: '600',
  } as TextStyle,
  freeShipping: {
    color: Colors.GREEN_TEXT,
    fontWeight: '700',
  } as TextStyle,
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing.LG,
    borderTopWidth: 2,
    borderTopColor: Colors.LIGHT_GRAY_BG,
    marginTop: Spacing.MD,
  } as ViewStyle,
  totalLabel: {
    ...Typography.HEADLINE,
    color: Colors.DARK_BLUE_TEXT,
    fontSize: 20,
    fontWeight: '800',
  } as TextStyle,
  totalValue: {
    ...Typography.HEADLINE,
    color: Colors.RED,
    fontSize: 22,
    fontWeight: '900',
  } as TextStyle,
  freeShippingNotice: {
    backgroundColor: Colors.LIGHT_GRAY_BG,
    padding: Spacing.MD,
    borderRadius: BorderRadius.SM,
    marginTop: Spacing.MD,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  freeShippingText: {
    ...Typography.CAPTION,
    color: Colors.ORANGE_TEXT,
    marginLeft: Spacing.SM,
    flex: 1,
  } as TextStyle,
});

export default OrderSummaryComponent;