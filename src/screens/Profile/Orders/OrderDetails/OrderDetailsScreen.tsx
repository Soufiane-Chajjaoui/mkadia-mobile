import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Subscription } from 'rxjs';
import { Colors, Spacing, Typography } from '../../../../constants/DesignSystem';
import { OrderDetails } from '../../../../models/Order';
import { RootStackParamList } from '../../../../types/navigation';
import { showGlobalError } from '../../../../context/ToastContext';
import AppHeader from '../../../../components/AppHeader';
import OrderStatusCard from './components/OrderStatusCard';
import OrderItemsList from './components/OrderItemsList';
import DeliveryInfo from './components/DeliveryInfo';
import OrderSummaryDetails from './components/OrderSummaryDetails';
import { getOrderDetails$ } from '../../../../apis/UserAPI';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetails'>;

const OrderDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    loadOrderDetails();

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [orderId]);

  const loadOrderDetails = () => {
    setLoading(true);
    subscriptionRef.current = getOrderDetails$(orderId).subscribe({
      next: (orderData) => {
        console.log('✅ Order details loaded:', orderData);
        setOrder(orderData);
        setLoading(false);
      },
      error: (error) => {
        console.error('❌ Error loading order details:', error);
        showGlobalError(error.message || 'Erreur lors du chargement des détails');
        setLoading(false);
        navigation.goBack();
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader
          title="Détails de la commande"
          showSettings={false}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.GREEN_BG} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <AppHeader
          title="Détails de la commande"
          showSettings={false}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Commande introuvable</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Détails de la commande"
        showSettings={false}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Statut de la commande */}
        <OrderStatusCard 
          status={order.status}
          orderId={order.id}
          createdAt={order.createdAt}
        />

        {/* Liste des articles */}
        <OrderItemsList items={order.items} />

        {/* Informations de livraison */}
        <DeliveryInfo 
          delivery={order.delivery}
          address={order.address}
        />

        {/* Résumé de la commande */}
        <OrderSummaryDetails 
          subTotal={order.subTotal}
          discountAmount={order.discountAmount}
          totalAmount={order.totalAmount}
          paymentMethod={order.paymentMethod}
          paymentStatus={order.paymentStatus}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY_BG,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    marginTop: Spacing.MD,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.XL,
  },
  emptyText: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.XL,
  },
});

export default OrderDetailsScreen;

