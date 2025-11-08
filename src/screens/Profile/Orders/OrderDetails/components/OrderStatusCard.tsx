import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react-native';
import { Colors, Spacing, Typography, Elevation, BorderRadius } from '../../../../../constants/DesignSystem';
import { OrderStatus } from '../../../../../models/Order';

interface OrderStatusCardProps {
  status: OrderStatus;
  orderId: number;
  createdAt: string;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ status, orderId, createdAt }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'PENDING':
        return {
          icon: Clock,
          label: 'En attente',
          color: Colors.ORANGE,
          bgColor: '#FFF7ED',
        };
      case 'PAID':
        return {
          icon: CheckCircle,
          label: 'Payée',
          color: Colors.GREEN_BG,
          bgColor: '#F0FDF4',
        };
      case 'SHIPPED':
        return {
          icon: Truck,
          label: 'Expédiée',
          color: Colors.BLUE,
          bgColor: '#EFF6FF',
        };
      case 'DELIVERED':
        return {
          icon: Package,
          label: 'Livrée',
          color: Colors.GREEN_TEXT,
          bgColor: '#ECFDF5',
        };
      case 'CANCELED':
        return {
          icon: XCircle,
          label: 'Annulée',
          color: Colors.RED,
          bgColor: '#FEF2F2',
        };
      default:
        return {
          icon: Clock,
          label: 'En attente',
          color: Colors.GRAY_TEXT,
          bgColor: Colors.LIGHT_GRAY_BG,
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const months = [
      'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
      'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>Commande #{orderId}</Text>
          <Text style={styles.orderDate}>{formatDate(createdAt)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: config.bgColor }]}>
          <StatusIcon size={18} color={config.color} strokeWidth={2.5} />
          <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
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
    ...Elevation.LOW,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    ...Typography.HEADLINE,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.XS,
  },
  orderDate: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    fontSize: 14,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderRadius: BorderRadius.MD,
    gap: Spacing.XS,
  },
  statusText: {
    ...Typography.SUBHEAD,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OrderStatusCard;

