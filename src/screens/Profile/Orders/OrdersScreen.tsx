import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Text,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Subscription } from 'rxjs';
import { Order, OrdersResponse } from '../../../models/Order';
import { Colors, Spacing, Typography } from '../../../constants/DesignSystem';
import { RootStackParamList } from '../../../types/navigation';
import AppHeader from '../../../components/AppHeader';
import OrderCard from './components/OrderCard';
import TimelineHeader from './components/TimelineHeader';
import EmptyOrders from './components/EmptyOrders';
import { showGlobalError } from '../../../context/ToastContext';
import { getOrders$ } from '../../../apis/UserAPI';

type Props = NativeStackScreenProps<RootStackParamList, 'Orders'>;

interface GroupedOrders {
  monthYear: string;
  month: string;
  year: string;
  orders: Order[];
}

const OrdersScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    loadOrders(0, false);

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, []);

  const loadOrders = (page: number, isLoadMore: boolean) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = getOrders$(page, 10).subscribe({
      next: (response: OrdersResponse) => {
        console.log(`✅ Orders loaded - Page ${page}:`, response);

        if (isLoadMore) {
          // Éviter les doublons en vérifiant les IDs
          setOrders((prev) => {
            const existingIds = new Set(prev.map(o => o.id));
            const newOrders = response.elements.filter(o => !existingIds.has(o.id));
            return [...prev, ...newOrders];
          });
        } else {
          setOrders(response.elements);
        }

        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
        // Spring Data JPA: currentPage est 0-indexed
        setHasMore(response.currentPage < response.totalPages - 1);
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      },
      error: (error) => {
        console.error('❌ Error loading orders:', error);
        showGlobalError(error.message || 'Erreur lors du chargement des commandes');
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      },
    });
  };

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadOrders(0, false);
  }, []);

  const loadMoreOrders = useCallback(() => {
    if (loadingMore || !hasMore || loading) return;

    const nextPage = currentPage + 1;
    loadOrders(nextPage, true);
  }, [loadingMore, hasMore, currentPage, loading]);

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetails', { orderId: order.id });
  };

  // Group orders by month and year
  const groupOrdersByMonth = (orders: Order[]): GroupedOrders[] => {
    const groups: { [key: string]: GroupedOrders } = {};

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const month = date.toLocaleDateString('fr-FR', { month: 'long' });
      const year = date.getFullYear().toString();

      if (!groups[monthYear]) {
        groups[monthYear] = {
          monthYear,
          month: month.charAt(0).toUpperCase() + month.slice(1),
          year,
          orders: [],
        };
      }

      groups[monthYear].orders.push(order);
    });

    // Sort by date descending
    return Object.values(groups).sort((a, b) => b.monthYear.localeCompare(a.monthYear));
  };

  // Flatten grouped orders for FlatList
  const getFlatListData = () => {
    const grouped = groupOrdersByMonth(orders);
    const flatData: any[] = [];

    grouped.forEach((group) => {
      flatData.push({ type: 'header', ...group });
      group.orders.forEach((order) => {
        flatData.push({ type: 'order', order });
      });
    });

    return flatData;
  };

  const renderItem = ({ item, index }: any) => {
    if (item.type === 'header') {
      return (
        <TimelineHeader
          month={item.month}
          year={item.year}
          count={item.orders.length}
        />
      );
    }

    const flatData = getFlatListData();
    const isLastInGroup = index === flatData.length - 1 || flatData[index + 1]?.type === 'header';

    return (
      <View style={styles.orderCardContainer}>
        <View style={[styles.timelineLine, isLastInGroup && styles.timelineLineEnd]} />
        <View style={styles.timelineDot} />
        <View style={styles.orderCardWrapper}>
          <OrderCard order={item.order} onPress={() => handleOrderPress(item.order)} />
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.GREEN_BG} />
        <Text style={styles.footerText}>Chargement...</Text>
      </View>
    );
  };



  if (loading) {
    return (
      <View style={styles.container}>
        <AppHeader
          title="Mes Commandes"
          showSettings={false}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.GREEN_BG} />
          <Text style={styles.loadingText}>Chargement de vos commandes...</Text>
        </View>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader
          title="Mes Commandes"
          showSettings={false}
          onBackPress={() => navigation.goBack()}
        />
        <EmptyOrders onShopPress={() => navigation.navigate('MainTabs' as never)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Mes Commandes"
        showSettings={false}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        data={getFlatListData()}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.type === 'header' ? `header-${item.monthYear}` : `order-${item.order.id}-${index}`
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.GREEN_BG]}
            tintColor={Colors.GREEN_BG}
          />
        }
        onEndReached={loadMoreOrders}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_GRAY_BG,
  },
  loadingText: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    marginTop: Spacing.LG,
    fontSize: 15,
  },
  listContent: {
    paddingBottom: Spacing.XL,
    paddingHorizontal: Spacing.XXS
  },
  orderCardContainer: {
    position: 'relative',
    marginLeft: 39,
  },
  timelineLine: {
    position: 'absolute',
    left: -18,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.GRAY_ICON,
    opacity: 0.3,
    zIndex: 0,
  },
  timelineLineEnd: {
    bottom: '20%',
  },
  timelineDot: {
    position: 'absolute',
    left: -27,
    top: 28,
    width: 20,
    height: 20,
    borderRadius: 90,
    backgroundColor: Colors.GREEN_BG,
    borderWidth: 3,
    borderColor: Colors.LIGHT_GRAY_BG,
    zIndex: 2,
  },
  orderCardWrapper: {
    flex: 1,
    paddingRight: Spacing.SM,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.LG,
    marginTop: Spacing.MD,
  },
  footerText: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    marginLeft: Spacing.SM,
  },
});

export default OrdersScreen;