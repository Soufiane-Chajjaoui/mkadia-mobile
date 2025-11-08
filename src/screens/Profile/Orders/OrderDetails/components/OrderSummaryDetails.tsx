import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Receipt, CreditCard, Wallet } from 'lucide-react-native';
import { Colors, Spacing, Typography, Elevation, BorderRadius } from '../../../../../constants/DesignSystem';
import { PaymentMethod, PaymentStatus } from '../../../../../models/Order';
import PriceText from '../../../../../components/PriceText';

interface OrderSummaryDetailsProps {
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}

const OrderSummaryDetails: React.FC<OrderSummaryDetailsProps> = ({
  subTotal,
  discountAmount,
  totalAmount,
  paymentMethod,
  paymentStatus,
}) => {
  const getPaymentMethodLabel = () => {
    switch (paymentMethod) {
      case 'CASH_ON_DELIVERY':
        return 'Paiement à la livraison';
      case 'ONLINE_CARD':
        return 'Carte bancaire';
      case 'MOBILE_PAYMENT':
        return 'Paiement mobile';
      default:
        return 'Non spécifié';
    }
  };

  const getPaymentStatusConfig = () => {
    switch (paymentStatus) {
      case 'COMPLETED':
        return { label: 'Payé', color: Colors.GREEN_TEXT, bgColor: '#F0FDF4' };
      case 'PENDING':
        return { label: 'En attente', color: Colors.ORANGE, bgColor: '#FFF7ED' };
      case 'FAILED':
        return { label: 'Échoué', color: Colors.RED, bgColor: '#FEF2F2' };
      case 'CANCELLED':
        return { label: 'Annulé', color: Colors.GRAY_TEXT, bgColor: Colors.LIGHT_GRAY_BG };
      default:
        return { label: 'En attente', color: Colors.GRAY_TEXT, bgColor: Colors.LIGHT_GRAY_BG };
    }
  };

  const statusConfig = getPaymentStatusConfig();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Receipt size={20} color={Colors.DARK_BLUE_TEXT} strokeWidth={2.5} />
        <Text style={styles.title}>Résumé de la commande</Text>
      </View>

      {/* Lignes de prix */}
      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Sous-total</Text>
          <PriceText amount={subTotal} style={styles.priceValue} iconSize={14} />
        </View>

        {discountAmount > 0 && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Réduction</Text>
            <View style={styles.discountContainer}>
              <Text style={styles.discountValue}>-</Text>
              <PriceText 
                amount={discountAmount} 
                style={styles.discountValue} 
                iconSize={14} 
                iconColor={Colors.RED}
              />
            </View>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.priceRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <PriceText 
            amount={totalAmount} 
            style={styles.totalValue} 
            iconSize={18} 
            iconColor={Colors.GREEN_TEXT}
          />
        </View>
      </View>

      {/* Informations de paiement */}
      <View style={styles.divider} />

      <View style={styles.paymentSection}>
        <View style={styles.paymentRow}>
          <View style={styles.paymentMethod}>
            <CreditCard size={18} color={Colors.GRAY_ICON} />
            <Text style={styles.paymentMethodText}>{getPaymentMethodLabel()}</Text>
          </View>
        </View>

        <View style={styles.paymentRow}>
          <View style={styles.paymentStatus}>
            <Wallet size={18} color={Colors.GRAY_ICON} />
            <Text style={styles.paymentStatusLabel}>Statut du paiement:</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    borderRadius: BorderRadius.LG,
    padding: Spacing.LG,
    marginHorizontal: Spacing.MD,
    marginTop: Spacing.MD,
    marginBottom: Spacing.XL,
    ...Elevation.LOW,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.MD,
    gap: Spacing.SM,
  },
  title: {
    ...Typography.HEADLINE,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.DARK_BLUE_TEXT,
  },
  priceSection: {
    marginBottom: Spacing.SM,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.SM,
  },
  priceLabel: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    fontSize: 15,
  },
  priceValue: {
    ...Typography.SUBHEAD,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.DARK_BLUE_TEXT,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountValue: {
    ...Typography.SUBHEAD,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.RED,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    marginVertical: Spacing.MD,
  },
  totalLabel: {
    ...Typography.HEADLINE,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.DARK_BLUE_TEXT,
  },
  totalValue: {
    ...Typography.HEADLINE,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.GREEN_TEXT,
  },
  paymentSection: {
    marginTop: Spacing.SM,
  },
  paymentRow: {
    marginBottom: Spacing.SM,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.SM,
  },
  paymentMethodText: {
    ...Typography.BODY,
    color: Colors.DARK_BLUE_TEXT,
    fontSize: 15,
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.SM,
  },
  paymentStatusLabel: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    fontSize: 15,
  },
  statusBadge: {
    paddingHorizontal: Spacing.SM,
    paddingVertical: 4,
    borderRadius: BorderRadius.SM,
  },
  statusText: {
    ...Typography.CAPTION,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default OrderSummaryDetails;

