import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Receipt, TrendingDown, Truck, FileText } from 'lucide-react-native';
import { Colors, IconSize, Spacing, Typography, BorderRadius } from '../../../constants/DesignSystem';

// Interface pour la réponse du coupon
interface CouponResponse {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountPercentage?: number;
  message: string;
}

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  promoDiscount: number;
  total: number;
  appliedPromo: CouponResponse | null;
  formatPrice: (price: number) => string;
}

const OrderSummaryComponent: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping,
  tax,
  promoDiscount,
  total,
  appliedPromo,
  formatPrice,
}) => {
  const isFreeShipping = shipping === 0;
  const remainingForFreeShipping = 35 - subtotal;
  const hasDiscount = promoDiscount > 0;

  return (
    <View style={styles.summaryContainer}>
      {/* Header */}
      <View style={styles.summaryHeader}>
        <Receipt size={IconSize.MD} color={Colors.GREEN_TEXT} />
        <Text style={styles.summaryTitle}>Récapitulatif de la commande</Text>
      </View>

      {/* Lines */}
      <View style={styles.summaryContent}>
        {/* Subtotal */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sous-total</Text>
          <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
        </View>

        {/* Shipping */}
        <View style={styles.summaryRow}>
          <View style={styles.shippingLabelContainer}>
            <Truck size={IconSize.SM} color={Colors.GRAY_TEXT} />
            <Text style={styles.summaryLabel}>Livraison</Text>
          </View>
          <Text style={[
            styles.summaryValue,
            isFreeShipping && styles.freeShippingText
          ]}>
            {isFreeShipping ? 'GRATUIT' : formatPrice(shipping)}
          </Text>
        </View>

        {/* Free shipping progress */}
        {!isFreeShipping && remainingForFreeShipping > 0 && (
          <View style={styles.freeShippingHint}>
            <Text style={styles.freeShippingHintText}>
              💡 Plus que {formatPrice(remainingForFreeShipping)} pour la livraison gratuite !
            </Text>
          </View>
        )}

        {/* Tax */}
        <View style={styles.summaryRow}>
          <View style={styles.taxLabelContainer}>
            <FileText size={IconSize.SM} color={Colors.GRAY_TEXT} />
            <Text style={styles.summaryLabel}>TVA</Text>
          </View>
          <Text style={styles.summaryValue}>{formatPrice(tax)}</Text>
        </View>

        {/* Promo discount */}
        {hasDiscount && (
          <View style={[styles.summaryRow, styles.discountRow]}>
            <View style={styles.discountLabelContainer}>
              <TrendingDown size={IconSize.SM} color={Colors.DARK_GREEN_BG} />
              <Text style={styles.discountLabel}>
                Code promo ({appliedPromo?.code})
              </Text>
            </View>
            <Text style={styles.discountValue}>
              -{formatPrice(promoDiscount)}
            </Text>
          </View>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <View style={styles.totalValueContainer}>
            {hasDiscount && (
              <Text style={styles.oldTotal}>
                {formatPrice(total + promoDiscount)}
              </Text>
            )}
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        {/* Savings badge */}
        {hasDiscount && (
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsBadgeText}>
              🎉 Vous économisez {formatPrice(promoDiscount)} avec ce code promo !
            </Text>
          </View>
        )}
      </View>

      {/* Footer info */}
      <View style={styles.summaryFooter}>
        <Text style={styles.footerText}>
          Les prix incluent la TVA. Frais de service non inclus.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    backgroundColor: Colors.WHITE,
    marginTop: Spacing.XXS,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BG,
  } as ViewStyle,

  // Header
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.LG,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY_BG,
  } as ViewStyle,

  summaryTitle: {
    ...Typography.SUBHEAD,
    color: Colors.DARK_BLUE_TEXT,
    marginLeft: Spacing.SM,
    fontWeight: '700',
  } as TextStyle,

  // Content
  summaryContent: {
    padding: Spacing.LG,
  } as ViewStyle,

  // Summary rows
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.MD,
  } as ViewStyle,

  summaryLabel: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    marginLeft: Spacing.XS,
  } as TextStyle,

  summaryValue: {
    ...Typography.BODY,
    color: Colors.DARK_BLUE_TEXT,
    fontWeight: '600',
  } as TextStyle,

  // Shipping
  shippingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  freeShippingText: {
    color: Colors.DARK_GREEN_BG,
    fontWeight: 'bold',
  } as TextStyle,

  freeShippingHint: {
    backgroundColor: Colors.DARK_GREEN_BG + '15', // 15% opacity
    padding: Spacing.SM,
    borderRadius: BorderRadius.SM,
    marginBottom: Spacing.MD,
    borderLeftWidth: 3,
    borderLeftColor: Colors.DARK_GREEN_BG,
  } as ViewStyle,

  freeShippingHintText: {
    ...Typography.CAPTION,
    color: Colors.DARK_GREEN_BG,
    fontWeight: '600',
  } as TextStyle,

  // Tax
  taxLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  // Discount
  discountRow: {
    backgroundColor: Colors.DARK_GREEN_BG + '10', // 10% opacity
    padding: Spacing.SM,
    borderRadius: BorderRadius.SM,
    marginBottom: Spacing.MD,
  } as ViewStyle,

  discountLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  discountLabel: {
    ...Typography.BODY,
    color: Colors.DARK_GREEN_BG,
    fontWeight: '600',
    marginLeft: Spacing.XS,
  } as TextStyle,

  discountValue: {
    ...Typography.BODY,
    color: Colors.DARK_GREEN_BG,
    fontWeight: 'bold',
    fontSize: 16,
  } as TextStyle,

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    marginVertical: Spacing.MD,
  } as ViewStyle,

  // Total
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.SM,
  } as ViewStyle,

  totalLabel: {
    ...Typography.HEADLINE,
    color: Colors.DARK_BLUE_TEXT,
    fontSize: 18,
    fontWeight: 'bold',
  } as TextStyle,

  totalValueContainer: {
    alignItems: 'flex-end',
  } as ViewStyle,

  oldTotal: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    textDecorationLine: 'line-through',
    marginBottom: Spacing.XXS,
  } as TextStyle,

  totalValue: {
    ...Typography.HEADLINE,
    color: Colors.DARK_GREEN_BG,
    fontSize: 24,
    fontWeight: 'bold',
  } as TextStyle,

  // Savings badge
  savingsBadge: {
    backgroundColor: Colors.DARK_GREEN_BG,
    padding: Spacing.MD,
    borderRadius: BorderRadius.MD,
    marginTop: Spacing.MD,
    alignItems: 'center',
  } as ViewStyle,

  savingsBadgeText: {
    ...Typography.BODY,
    color: Colors.WHITE_TEXT,
    fontWeight: '600',
    textAlign: 'center',
  } as TextStyle,

  // Footer
  summaryFooter: {
    backgroundColor: Colors.LIGHT_GRAY_BG,
    padding: Spacing.MD,
  } as ViewStyle,

  footerText: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    textAlign: 'center',
    fontStyle: 'italic',
  } as TextStyle,
});

export default OrderSummaryComponent;