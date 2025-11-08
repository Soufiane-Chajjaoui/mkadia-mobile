import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Package, MapPin, CreditCard, ChevronRight, Euro } from 'lucide-react-native';
import { Order, OrderStatus } from '../../../../models/Order';
import { Colors, Spacing, Typography, IconSize, Elevation } from '../../../../constants/DesignSystem';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return Colors.GREEN_BG;
      case 'SHIPPED':
        return '#3B82F6';
      case 'PENDING':
        return '#F59E0B';
      case 'CANCELED':
        return Colors.RED_ICON;
      default:
        return Colors.GRAY_TEXT;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'CONFIRMED':
        return 'Confirmée';
      case 'PROCESSING':
        return 'En préparation';
      case 'SHIPPED':
        return 'Expédiée';
      case 'DELIVERED':
        return 'Livrée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method: string | null) => {
    if (!method) return 'Non défini';
    switch (method) {
      case 'CASH_ON_DELIVERY':
        return 'Paiement à la livraison';
      case 'CREDIT_CARD':
        return 'Carte bancaire';
      case 'PAYPAL':
        return 'PayPal';
      default:
        return method;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const months = [
      'jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin',
      'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Package size={20} color={Colors.GREEN_BG} />
          </View>
          <View>
            <Text style={styles.orderId}>Commande #{order.id}</Text>
            <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}15` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {getStatusLabel(order.status)}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Details */}
      <View style={styles.details}>
        {/* Items count */}
        <View style={styles.detailRow}>
          <Package size={16} color={Colors.GRAY_ICON} />
          <Text style={styles.detailText}>
            {order.countItems} article{order.countItems > 1 ? 's' : ''}
          </Text>
        </View>

        {/* Address */}
        {order.address && (
          <View style={styles.detailRow}>
            <MapPin size={16} color={Colors.GRAY_ICON} />
            <Text style={styles.detailText} numberOfLines={1}>
              {order.address.city}
            </Text>
          </View>
        )}

        {/* Payment method */}
        {order.paymentMethod && (
          <View style={styles.detailRow}>
            <CreditCard size={16} color={Colors.GRAY_ICON} />
            <Text style={styles.detailText} numberOfLines={1}>
              {getPaymentMethodLabel(order.paymentMethod)}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <View style={styles.totalContainer}>
            <Text style={styles.totalAmount}>{order.totalAmount.toFixed(2)}</Text>
            <Euro size={18} color={Colors.DARK_BLUE_TEXT} strokeWidth={2.5} />
          </View>
        </View>
        {onPress && (
          <View style={styles.viewButton}>
            <Text style={styles.viewButtonText}>Voir détails</Text>
            <ChevronRight size={16} color={Colors.GREEN_BG} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: Spacing.MD,
    marginBottom: Spacing.MD,
    borderWidth: 1,
    borderColor: `${Colors.GREEN_BG}10`,
    ...Elevation.LOW,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.MD,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${Colors.GREEN_BG}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.MD,
    borderWidth: 2,
    borderColor: `${Colors.GREEN_BG}30`,
  },
  orderId: {
    ...Typography.SUBHEAD,
    fontWeight: '700',
    color: Colors.DARK_BLUE_TEXT,
    fontSize: 16,
  },
  orderDate: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    fontSize: 12,
    marginTop: 3,
  },
  statusBadge: {
    paddingHorizontal: Spacing.SM,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  statusText: {
    ...Typography.CAPTION,
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: `${Colors.GRAY_ICON}15`,
    marginBottom: Spacing.MD,
  },
  details: {
    marginBottom: Spacing.MD,
    gap: Spacing.XS,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  detailText: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    fontSize: 14,
    marginLeft: Spacing.SM,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.MD,
    borderTopWidth: 1,
    borderTopColor: `${Colors.GRAY_ICON}15`,
  },
  totalLabel: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    fontSize: 12,
    marginBottom: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalAmount: {
    ...Typography.HEADLINE,
    fontWeight: '700',
    color: Colors.DARK_BLUE_TEXT,
    fontSize: 20,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.GREEN_BG}10`,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${Colors.GREEN_BG}30`,
  },
  viewButtonText: {
    ...Typography.SUBHEAD,
    color: Colors.GREEN_BG,
    fontWeight: '700',
    fontSize: 13,
    marginRight: 4,
  },
});

export default OrderCard;

