import {
  ShoppingCart,
  BrushCleaning,
  CreditCard,
  ArrowRight,
  Heart
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
  RefreshControl,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Colors, IconSize, Spacing, BorderRadius, Elevation, Typography } from '../../constants/DesignSystem';
import PromoCodeComponent from '../checkout/components/PromoCode';
import CartItemComponent from './components/CartItem';
import DeliveryOptionsComponent from './components/DeliveryOptions';
import OrderSummaryComponent from './components/OrderSummary';
import { isExpired } from '../../utils/productHelper';
import { CartItem } from '../../models/CartItem';
import { navigate } from '../../navigation/NavigationService';
import { useAppDispatch } from '../../hooks/useRedux';
import { deleteItemAsync, clearCartAsync } from '../../features/cart/cartSlice';
import { clearCart$, deleteItem$, getCart$, updateCartItemQuantity$ } from '../../apis/CartAPI';

interface CouponResponse {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountPercentage?: number;
  message: string;
}

interface CartScreenProps {
  navigation?: any;
}

const CartItemSkeleton: React.FC = () => {
  return (
    <View style={styles.skeletonContainer}>
      <SkeletonPlaceholder borderRadius={BorderRadius.SM}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item
            width={80}
            height={80}
            borderRadius={BorderRadius.SM}
            marginRight={Spacing.MD}
          />
          <SkeletonPlaceholder.Item flex={1}>
            <SkeletonPlaceholder.Item
              width="80%"
              height={18}
              borderRadius={BorderRadius.XS}
              marginBottom={Spacing.SM}
            />
            <SkeletonPlaceholder.Item
              width="60%"
              height={14}
              borderRadius={BorderRadius.XS}
              marginBottom={Spacing.MD}
            />
            <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" alignItems="center">
              <SkeletonPlaceholder.Item
                width={60}
                height={16}
                borderRadius={BorderRadius.XS}
              />
              <SkeletonPlaceholder.Item
                width={80}
                height={30}
                borderRadius={BorderRadius.SM}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    setIsLoading(true);
    const subGetCart = getCart$().subscribe({
      next(value) {
        console.log("Cart from API:", value);
        setCartItems(value.items || []);
        setIsLoading(false);
      },
      error(err) {
        console.error("Erreur lors du chargement du panier:", err);
        Alert.alert("Erreur", "Impossible de charger le panier");
        setIsLoading(false);
      }
    });
    return () => subGetCart.unsubscribe();
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    const subGetCart = getCart$().subscribe({
      next(value) {
        setCartItems(value.items || []);
        setIsRefreshing(false);
      },
      error(err) {
        console.error("Erreur lors du rafraîchissement:", err);
        setIsRefreshing(false);
      }
    });
    return () => subGetCart.unsubscribe();
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }

    updateCartItemQuantity$({ productId: id, quantity: newQuantity }).subscribe({
      next(value) {
        setCartItems(items =>
          items.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      },
      error(err) {
        console.error("Erreur lors de la mise à jour:", err);
        Alert.alert("Erreur", "Impossible de mettre à jour la quantité");
      }
    });
  };

  const removeItem = (id: number) => {
    Alert.alert(
      "Supprimer l'article",
      "Voulez-vous vraiment supprimer cet article du panier ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            deleteItem$(id).subscribe({
              next(value) {
                setCartItems(items => items.filter(item => item.id !== id));
                dispatch(deleteItemAsync(id));
                // Pas d'Alert ici pour éviter le double affichage
              },
              error(err) {
                console.error("Erreur lors de la suppression:", err);
                Alert.alert("Erreur", "Impossible de supprimer l'article");
              }
            });
          }
        }
      ]
    );
  };

  const clearCart = () => {
    Alert.alert(
      "Vider le panier",
      "Êtes-vous sûr de vouloir supprimer tous les articles ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Vider tout",
          style: "destructive",
          onPress: () => {
            clearCart$().subscribe({
              next(value) {
                setCartItems([]);
                dispatch(clearCartAsync());
                Alert.alert("Succès", "Votre panier a été vidé");
              },
              error(err) {
                console.error("Erreur lors du vidage du panier:", err);
                Alert.alert("Erreur", "Impossible de vider le panier");
              }
            });
          }
        }
      ]
    );
  };

  const calculateItemPrice = (item: CartItem) => {
    const base = item.product.price! * item.quantity;
    return item.product.discount ? base * (1 - item.product.discount / 100) : base;
  };

  // Calculs du panier (SANS TVA)
  const subtotal = cartItems.reduce((sum, item) => {
    if (item.product.stock! <= 0 || isExpired(item.product.expirationDate)) return sum;
    return sum + calculateItemPrice(item);
  }, 0);

  // const shipping = subtotal > 35 ? 0 : 4.90;
  // const promoDiscount = appliedPromo ? appliedPromo.discountValue : 0;
  const total = subtotal ;//+ shipping - promoDiscount;

  const formatPrice = (price: number) =>
    `${price.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Panier vide", "Ajoutez des articles avant de procéder au paiement");
      return;
    }

    const unavailableItems = cartItems.filter(item =>
      item.product.stock! <= 0 || isExpired(item.product.expirationDate)
    );

    if (unavailableItems.length > 0) {
      Alert.alert(
        "Articles indisponibles",
        "Certains articles de votre panier ne sont plus disponibles. Veuillez les retirer avant de continuer.",
        [{ text: "OK" }]
      );
      return;
    }

    navigate('Checkout', { subtotal : subtotal, items : cartItems });
  };

  const handleSaveForLater = () => {
    Alert.alert(
      "Sauvegarder pour plus tard",
      "Cette fonctionnalité sera bientôt disponible !",
      [{ text: "OK" }]
    );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <ShoppingCart size={80} color={Colors.GRAY_ICON} />
      </View>
      <Text style={styles.emptyTitle}>Votre panier est vide</Text>
      <Text style={styles.emptySubtitle}>Ajoutez des articles pour commencer vos achats</Text>
      <TouchableOpacity
        style={styles.startShoppingButton}
        onPress={() => navigate('Home')}
        activeOpacity={0.8}
      >
        <Text style={styles.startShoppingText}>Commencer mes achats</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSkeletonItems = () => (
    <>
      {[...Array(3)].map((_, index) => (
        <CartItemSkeleton key={`skeleton-${index}`} />
      ))}
    </>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon Panier</Text>
          <TouchableOpacity onPress={clearCart} style={styles.removeButton} disabled>
            <BrushCleaning size={IconSize.XL} color={Colors.GRAY_TEXT} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderSkeletonItems()}
        </ScrollView>

        <View style={styles.checkoutContainer}>
          <TouchableOpacity style={styles.checkoutButtonDisabled} activeOpacity={1} disabled>
            <Text style={styles.checkoutText}>Chargement...</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mon Panier</Text>
          <Text style={styles.headerSubtitle}>
            {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity onPress={clearCart} style={styles.removeButton}>
          <BrushCleaning size={IconSize.XL} color={Colors.GRAY_TEXT} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.DARK_GREEN_BG}
            colors={[Colors.DARK_GREEN_BG]}
          />
        }
      >

        {/* Alert livraison gratuite */}
        {subtotal < 35 && subtotal > 0 && (
          <View style={styles.shippingAlert}>
            <View style={styles.alertIconContainer}>
              <ArrowRight size={20} color="#17A2B8" />
            </View>
            <Text style={styles.alertText}>
              Plus que {formatPrice(35 - subtotal)} pour la livraison gratuite !
            </Text>
          </View>
        )}

        {cartItems.map(item => (
          <CartItemComponent
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            formatPrice={formatPrice}
          />
        ))}
      </ScrollView>

      <View style={styles.checkoutContainer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total à payer</Text>
          <Text style={styles.totalAmount}>{formatPrice(total)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          activeOpacity={0.8}
          onPress={handleCheckout}
        >
          <CreditCard size={IconSize.LG} color={Colors.WHITE_ICON} />
          <Text style={styles.checkoutText}>Procéder au paiement</Text>
          <ArrowRight size={IconSize.MD} color={Colors.WHITE_ICON} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveForLaterButton}
          activeOpacity={0.7}
          onPress={handleSaveForLater}
        >
          <Heart size={IconSize.MD} color={Colors.GREEN_TEXT} />
          <Text style={styles.saveForLaterText}>Sauvegarder pour plus tard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY_BG
  } as ViewStyle,

  skeletonContainer: {
    padding: Spacing.LG,
    backgroundColor: Colors.WHITE,
    marginBottom: Spacing.XS,
  } as ViewStyle,

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.XXL,
    backgroundColor: Colors.WHITE
  } as ViewStyle,
  emptyIconContainer: {
    width: 160,
    height: 160,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.CIRCULAR,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.XXL,
    ...Elevation.LOW
  } as ViewStyle,
  emptyTitle: {
    ...Typography.HEADLINE,
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.MD,
    textAlign: "center"
  } as TextStyle,
  emptySubtitle: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    textAlign: "center",
    marginBottom: Spacing.XXL
  } as TextStyle,
  startShoppingButton: {
    backgroundColor: Colors.RED,
    paddingHorizontal: Spacing.XXL,
    paddingVertical: Spacing.LG,
    borderRadius: BorderRadius.MD,
    ...Elevation.MEDIUM
  } as ViewStyle,
  startShoppingText: {
    ...Typography.SUBHEAD,
    color: Colors.WHITE_TEXT
  } as TextStyle,

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.LG,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY_BG,
    ...Elevation.LOW
  } as ViewStyle,
  headerTitle: {
    ...Typography.HEADLINE,
    fontSize: 22,
    fontWeight: "800",
    color: Colors.DARK_BLUE_TEXT
  } as TextStyle,
  headerSubtitle: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    marginTop: Spacing.XXS
  } as TextStyle,
  removeButton: {
    padding: Spacing.SM,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.CIRCULAR
  } as ViewStyle,

  scrollView: {
    flex: 1
  } as ViewStyle,

  // Alert économies
  savingsAlert: {
    backgroundColor: '#D4EDDA',
    borderLeftWidth: 4,
    borderLeftColor: '#28A745',
    padding: Spacing.LG,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.XS,
  } as ViewStyle,
  savingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.CIRCULAR,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.MD,
  } as ViewStyle,
  savingsContent: {
    flex: 1,
  } as ViewStyle,
  savingsTitle: {
    ...Typography.CAPTION,
    color: '#155724',
    marginBottom: Spacing.XXS,
  } as TextStyle,
  savingsAmount: {
    ...Typography.SUBHEAD,
    fontSize: 18,
    fontWeight: '700',
    color: '#28A745',
  } as TextStyle,

  // Alert livraison
  shippingAlert: {
    backgroundColor: '#D1ECF1',
    borderLeftWidth: 4,
    borderLeftColor: '#17A2B8',
    padding: Spacing.LG,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.XS,
  } as ViewStyle,
  alertIconContainer: {
    marginRight: Spacing.MD,
  } as ViewStyle,
  alertText: {
    ...Typography.BODY,
    color: '#0C5460',
    flex: 1,
  } as TextStyle,

  checkoutContainer: {
    backgroundColor: Colors.WHITE,
    padding: Spacing.XL,
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHT_GRAY_BG,
    ...Elevation.HIGH
  } as ViewStyle,
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.MD,
  } as ViewStyle,
  totalLabel: {
    ...Typography.SUBHEAD,
    color: Colors.GRAY_TEXT,
  } as TextStyle,
  totalAmount: {
    ...Typography.HEADLINE,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.DARK_GREEN_BG,
  } as TextStyle,
  checkoutButton: {
    backgroundColor: Colors.DARK_GREEN_BG,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.XL,
    borderRadius: BorderRadius.LG,
    marginBottom: Spacing.LG,
    ...Elevation.MEDIUM
  } as ViewStyle,
  checkoutButtonDisabled: {
    backgroundColor: Colors.GRAY_TEXT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.XL,
    borderRadius: BorderRadius.LG,
    ...Elevation.MEDIUM
  } as ViewStyle,
  checkoutText: {
    ...Typography.SUBHEAD,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.WHITE_TEXT,
    marginHorizontal: Spacing.SM
  } as TextStyle,

  saveForLaterButton: {
    borderWidth: 2,
    borderColor: Colors.DARK_GREEN_BG,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.LG,
    borderRadius: BorderRadius.LG,
    backgroundColor: Colors.WHITE
  } as ViewStyle,
  saveForLaterText: {
    ...Typography.SUBHEAD,
    fontWeight: "600",
    color: Colors.GREEN_TEXT,
    marginLeft: Spacing.SM
  } as TextStyle,
});

export default CartScreen;