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
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Colors, IconSize, Spacing, BorderRadius, Elevation, Typography } from '../../constants/DesignSystem';
import PromoCodeComponent from './components/PromoCode';
import CartItemComponent from './components/CartItem';
import DeliveryOptionsComponent from './components/DeliveryOptions';
import OrderSummaryComponent from './components/OrderSummary';
import { clearCart$, deleteItem$, getCart$, updateCartItemQuantity$ } from '../../apis/CartAPI';
import { isExpired } from '../../utils/productHelper';
import { CartItem } from '../../models/CartItem';
import { navigate } from '../../navigation/NavigationService';
import { useAppDispatch } from '../../hooks/useRedux';
import { deleteItemAsync , clearCartAsync} from '../../features/cart/cartSlice';

interface CartScreenProps {
  navigation?: any;
}

// Composant Skeleton pour les items du panier
const CartItemSkeleton: React.FC = () => {
  return (
    <View style={styles.skeletonContainer}>
      <SkeletonPlaceholder borderRadius={BorderRadius.SM}>
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          {/* Image du produit */}
          <SkeletonPlaceholder.Item 
            width={80} 
            height={80} 
            borderRadius={BorderRadius.SM} 
            marginRight={Spacing.MD} 
          />
          
          {/* Contenu */}
          <SkeletonPlaceholder.Item flex={1}>
            {/* Titre du produit */}
            <SkeletonPlaceholder.Item 
              width="80%" 
              height={18} 
              borderRadius={BorderRadius.XS} 
              marginBottom={Spacing.SM} 
            />
            
            {/* Description */}
            <SkeletonPlaceholder.Item 
              width="60%" 
              height={14} 
              borderRadius={BorderRadius.XS} 
              marginBottom={Spacing.MD} 
            />
            
            {/* Prix et quantité */}
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
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [animatedValue] = useState(new Animated.Value(1));
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const subGetCart = getCart$().subscribe({
      next(value) {
        console.log("Cart from API:", value);
        setCartItems(value.items);
        setIsLoading(false);
      },
      error(err) {
        console.error("Erreur lors du chargement du panier:", err);
        setIsLoading(false);
      }
    });
    return () => subGetCart.unsubscribe();
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      deleteItem$(id).subscribe({
        next(value) {
          dispatch(deleteItemAsync(id));
          setCartItems(items => items.filter(item => item.id !== id));
        },
      })
      return;
    }
    updateCartItemQuantity$({ productId: id, quantity: newQuantity }).subscribe(
      {
        next(value) {
          setCartItems(items =>
            items.map(item =>
              item.id === id ? { ...item, quantity: newQuantity } : item
            )
          );
          
        },
      }
    )
  };

  const removeItem =async (id: number) => {
    deleteItem$(id).subscribe({
      next(value) {
        setCartItems(items => items.filter(item => item.id !== id));
      },
    });
    await dispatch(deleteItemAsync(id));

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
          onPress: () => clearCart$().subscribe({
            next(value) {
              setCartItems([])
              dispatch(clearCartAsync());
            },
          })
        }
      ]
    );
  };

  const calculateItemPrice = (item: CartItem) => {
    const base = item.product.price * item.quantity;
    return item.product.discount ? base * (1 - item.product.discount / 100) : base;
  };

  const subtotal = cartItems.reduce((sum, item) => {
    if (item.product.stock <= 0 || isExpired(item.product.expirationDate)) return sum;
    return sum + calculateItemPrice(item);
  }, 0);

  const shipping = subtotal > 35 ? 0 : 4.90;
  const tax = subtotal * 0.055;
  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount / 100) : 0;
  const total = subtotal + shipping + tax - promoDiscount;

  const formatPrice = (price: number) =>
    `${price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`;

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

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon Panier</Text>
          <TouchableOpacity onPress={clearCart} style={styles.removeButton}>
            <BrushCleaning size={IconSize.XL} color={Colors.GRAY_TEXT} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderSkeletonItems()}
        </ScrollView>

        {/* Bouton Commencer la course pendant le chargement */}
        <View style={styles.checkoutContainer}>
          <TouchableOpacity style={styles.startRaceButton} activeOpacity={0.8}>
            <Text style={styles.startRaceText}>Commencer la course</Text>
            <ArrowRight size={IconSize.MD} color={Colors.WHITE_ICON} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Affichage du panier vide
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  // Affichage normal du panier avec items
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Panier</Text>
        <TouchableOpacity onPress={clearCart} style={styles.removeButton}>
          <BrushCleaning size={IconSize.XL} color={Colors.GRAY_TEXT} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        {cartItems.map(item => (
          <CartItemComponent
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            formatPrice={formatPrice}
          />
        ))}

        {/* Promo Code */}
        <PromoCodeComponent
          appliedPromo={appliedPromo}
          onApplyPromo={setAppliedPromo}
          onRemovePromo={() => setAppliedPromo(null)}
          animatedValue={animatedValue}
        />

        {/* Order Summary */}
        <OrderSummaryComponent
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          promoDiscount={promoDiscount}
          total={total}
          appliedPromo={appliedPromo}
          formatPrice={formatPrice}
        />

        {/* Delivery Info */}
        <DeliveryOptionsComponent />
      </ScrollView>

      {/* Checkout */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.8}>
          <CreditCard size={IconSize.LG} color={Colors.WHITE_ICON} />
          <Text style={styles.checkoutText}>Procéder au paiement</Text>
          <ArrowRight size={IconSize.MD} color={Colors.WHITE_ICON} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveForLaterButton} activeOpacity={0.7}>
          <Heart size={IconSize.MD} color={Colors.GREEN_TEXT} />
          <Text style={styles.saveForLaterText}>Sauvegarder pour plus tard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 } as ViewStyle,
  
  // Skeleton styles
  skeletonContainer: {
    padding: Spacing.LG,
    backgroundColor: Colors.WHITE,
  } as ViewStyle,

  // Existing styles
  emptyContainer: {
    flex: 1, justifyContent: "center", alignItems: "center", padding: Spacing.XXL
  } as ViewStyle,
  emptyIconContainer: {
    width: 160, height: 160, backgroundColor: Colors.WHITE,
    borderRadius: BorderRadius.CIRCULAR, justifyContent: "center", alignItems: "center",
    marginBottom: Spacing.XXL, ...Elevation.LOW
  } as ViewStyle,
  emptyTitle: { ...Typography.HEADLINE, color: Colors.DARK_BLUE_TEXT, marginBottom: Spacing.MD, textAlign: "center" } as TextStyle,
  emptySubtitle: { ...Typography.BODY, color: Colors.GRAY_TEXT, textAlign: "center", marginBottom: Spacing.XXL } as TextStyle,
  startShoppingButton: {
    backgroundColor: Colors.RED, paddingHorizontal: Spacing.XXL, paddingVertical: Spacing.LG,
    borderRadius: BorderRadius.MD, ...Elevation.MEDIUM
  } as ViewStyle,
  startShoppingText: { ...Typography.SUBHEAD, color: Colors.WHITE_TEXT } as TextStyle,

  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: Spacing.LG, backgroundColor: Colors.WHITE, borderBottomWidth: 1,
    borderBottomColor: Colors.LIGHT_GRAY_BG, ...Elevation.LOW
  } as ViewStyle,
  headerTitle: { ...Typography.HEADLINE, fontSize: 22, fontWeight: "800", color: Colors.DARK_BLUE_TEXT } as TextStyle,
  removeButton: { padding: Spacing.SM, backgroundColor: Colors.LIGHT_GRAY_BG, borderRadius: BorderRadius.CIRCULAR } as ViewStyle,

  scrollView: { flex: 1 } as ViewStyle,

  checkoutContainer: {
    backgroundColor: Colors.WHITE, padding: Spacing.XL, borderTopWidth: 1, borderTopColor: Colors.LIGHT_GRAY_BG, ...Elevation.HIGH
  } as ViewStyle,
  checkoutButton: {
    backgroundColor: Colors.DARK_GREEN_BG, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: Spacing.XL, borderRadius: BorderRadius.LG, marginBottom: Spacing.LG, ...Elevation.MEDIUM
  } as ViewStyle,
  checkoutText: { ...Typography.SUBHEAD, fontSize: 18, fontWeight: "700", color: Colors.WHITE_TEXT, marginHorizontal: Spacing.SM } as TextStyle,
  
  // Bouton "Commencer la course" pendant le chargement
  startRaceButton: {
    backgroundColor: Colors.RED, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: Spacing.XL, borderRadius: BorderRadius.LG, ...Elevation.MEDIUM
  } as ViewStyle,
  startRaceText: { ...Typography.SUBHEAD, fontSize: 18, fontWeight: "700", color: Colors.WHITE_TEXT, marginRight: Spacing.SM } as TextStyle,
  
  saveForLaterButton: {
    borderWidth: 2, borderColor: Colors.DARK_GREEN_BG, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: Spacing.LG, borderRadius: BorderRadius.LG, backgroundColor: Colors.TRANSPARENT_WHITE
  } as ViewStyle,
  saveForLaterText: { ...Typography.SUBHEAD, fontWeight: "600", color: Colors.GREEN_TEXT, marginLeft: Spacing.SM } as TextStyle,
});

export default CartScreen;