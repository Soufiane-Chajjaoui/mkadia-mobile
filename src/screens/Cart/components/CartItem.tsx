import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Calendar, Package, Trash2, Minus, Plus, AlertTriangle } from 'lucide-react-native';
import { IconSize, Colors, Spacing, BorderRadius, Typography, Elevation } from '../../../constants/DesignSystem';
import { isExpired } from '../../../utils/productHelper';
import { CartItem } from '../../../models/CartItem';
import { replaceBaseUrl } from '../../../utils/urlHelper';


interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onRemoveItem: (id: number) => void;
  formatPrice: (price: number) => string;
}

const CartItemComponent: React.FC<CartItemProps> = ({ 
  item, 
  onUpdateQuantity, 
  onRemoveItem, 
  formatPrice 
}) => {
  const handleRemove = () => {
    Alert.alert(
      "Supprimer l'article",
      "Êtes-vous sûr de vouloir retirer cet article de votre panier ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: () => onRemoveItem(item.id)
        }
      ]
    );
  };

  // Stock & Expiration checks
  const isInStock = item.product.stock! > 0;
  const isLowStock = item.product.stock! <= 5 && item.product.stock! > 0;
  const expired = isExpired(item.product.expirationDate);

  // Prix avec remise
  const getDiscountedPrice = () => {
    if (item.product.discount && item.product.discount > 0) {
      return item.product.price! * (1 - item.product.discount / 100);
    }
    return item.product.price;
  };

  const currentPrice = getDiscountedPrice();
  const hasDiscount = item.product.discount && item.product.discount > 0;

  return (
    <View style={styles.cartItemContainer}>
      {/* Image produit + badge */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: replaceBaseUrl(item.product.image!) }} style={styles.productImage} />
        
        {/* Discount Badge */}
        {hasDiscount && !expired && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.product.discount}%</Text>
          </View>
        )}

        {/* Expired Badge */}
        {expired && (
          <View style={styles.expiredBadge}>
            <Text style={styles.expiredText}>Expiré</Text>
          </View>
        )}
      </View>

      {/* Détails produit */}
      <View style={styles.productDetails}>
        <View style={styles.productHeader}>
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.product.name}
            </Text>

            {item.product.description && (
              <Text style={styles.descriptionText} numberOfLines={1}>
                {item.product.description}
              </Text>
            )}

            <Text style={styles.unitText}>
              Unité : {item.product.quantity} {item.product.unit}
            </Text>

            {item.product.expirationDate && (
              <View style={styles.expirationContainer}>
                <Calendar size={IconSize.XS} color={Colors.ORANGE_TEXT} />
                <Text style={[styles.expirationText, expired && { color: Colors.RED }]}>
                  {expired ? "Périmé" : `Expire le ${new Date(item.product.expirationDate).toLocaleDateString("fr-FR")}`}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleRemove}
            style={styles.removeButton}
            activeOpacity={0.7}
          >
            <Trash2 size={IconSize.MD} color={Colors.GRAY_TEXT} />
          </TouchableOpacity>
        </View>

        {/* Statuts */}
        {expired && (
          <View style={styles.outOfStockBadge}>
            <AlertTriangle size={IconSize.XS} color={Colors.WHITE_ICON} />
            <Text style={styles.outOfStockText}>Produit périmé</Text>
          </View>
        )}

        {!expired && !isInStock && (
          <View style={styles.outOfStockBadge}>
            <AlertTriangle size={IconSize.XS} color={Colors.WHITE_ICON} />
            <Text style={styles.outOfStockText}>Rupture de stock</Text>
          </View>
        )}

        {!expired && isLowStock && (
          <View style={styles.lowStockBadge}>
            <Package size={IconSize.XS} color={Colors.ORANGE_TEXT} />
            <Text style={styles.lowStockText}>Stock faible ({item.product.stock} restants)</Text>
          </View>
        )}

        <View style={styles.quantityOnHandPriceContainer}>
          {/* Quantité */}
          <View style={styles.quantityOnHandContainer}>
            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
              style={[
                styles.quantityOnHandButton,
                (!isInStock || expired) && styles.quantityOnHandButtonDisabled,
              ]}
              disabled={!isInStock || expired}
              activeOpacity={0.7}
            >
              <Minus size={IconSize.SM} color={(isInStock && !expired) ? Colors.DARK_GRAY_TEXT : Colors.GRAY_TEXT} />
            </TouchableOpacity>

            <Text style={styles.quantityOnHandText}>{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
              style={[
                styles.quantityOnHandButton,
                ((!isInStock || item.quantity >= item.product.stock!) || expired) && styles.quantityOnHandButtonDisabled,
              ]}
              disabled={!isInStock || item.quantity >= item.product.stock! || expired}
              activeOpacity={0.7}
            >
              <Plus size={IconSize.SM} color={(isInStock && !expired && item.quantity < item.product.stock!) ? Colors.DARK_GRAY_TEXT : Colors.GRAY_TEXT} />
            </TouchableOpacity>
          </View>

          {/* Prix */}
          <View style={styles.priceContainer}>
            {expired ? (
              <Text style={styles.expiredText}>Indisponible</Text>
            ) : (
              <>
                <Text style={styles.currentPrice}>
                  {formatPrice(currentPrice! * item.quantity)}
                </Text>
                {hasDiscount && (
                  <Text style={styles.originalPrice}>
                    {formatPrice(item.product.price! * item.quantity)}
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  cartItemContainer: {
    backgroundColor: Colors.WHITE,
    padding: Spacing.LG,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BG,
  } as ViewStyle,
  imageContainer: {
    width: 90,
    height: 90,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.MD,
    marginRight: Spacing.LG,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  } as ViewStyle,
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: "cover",
    borderRadius: BorderRadius.SM,
  } as ImageStyle,
  discountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.RED,
    borderRadius: BorderRadius.XS,
    paddingHorizontal: 6,
    paddingVertical: 2,
  } as ViewStyle,
  discountText: {
    ...Typography.TINY,
    color: Colors.WHITE_TEXT,
    fontWeight: '700',
  } as TextStyle,
  productDetails: {
    flex: 1,
  } as ViewStyle,
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.XXS,
  } as ViewStyle,
  productInfo: {
    flex: 1,
    marginRight: Spacing.SM,
  } as ViewStyle,
  productName: {
    ...Typography.SUBHEAD,
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.XS,
    fontWeight: '700',
  } as TextStyle,
  skuText: {
    ...Typography.TINY,
    color: Colors.GRAY_TEXT,
    marginBottom: Spacing.XXS,
    fontWeight: '500',
  } as TextStyle,
  descriptionText: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    marginBottom: Spacing.XS,
  } as TextStyle,
  unitText: {
    ...Typography.CAPTION,
    color: Colors.ORANGE_TEXT,
    marginBottom: Spacing.XS,
    fontWeight: '600',
  } as TextStyle,
  expirationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.XS,
  } as ViewStyle,
  expirationText: {
    ...Typography.TINY,
    color: Colors.ORANGE_TEXT,
    marginLeft: Spacing.XS,
    fontWeight: '500',
  } as TextStyle,
  removeButton: {
    padding: Spacing.SM,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.CIRCULAR,
  } as ViewStyle,
  outOfStockBadge: {
    backgroundColor: Colors.RED,
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
    borderRadius: BorderRadius.XS,
    alignSelf: 'flex-start',
    marginBottom: Spacing.SM,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  outOfStockText: {
    ...Typography.CAPTION,
    color: Colors.WHITE_TEXT,
    fontWeight: '600',
    marginLeft: Spacing.XS,
  } as TextStyle,
  lowStockBadge: {
    backgroundColor: Colors.ORANGE_ICON,
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
    borderRadius: BorderRadius.XS,
    alignSelf: 'flex-start',
    marginBottom: Spacing.SM,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  lowStockText: {
    ...Typography.CAPTION,
    color: Colors.ORANGE_TEXT,
    fontWeight: '600',
    marginLeft: Spacing.XS,
  } as TextStyle,
  quantityOnHandPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  } as ViewStyle,
  quantityOnHandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.XL,
    paddingHorizontal: Spacing.XS,
  } as ViewStyle,
  quantityOnHandButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.CIRCULAR,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    ...Elevation.LOW,
  } as ViewStyle,
  quantityOnHandButtonDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.LIGHT_GRAY_BG,
  } as ViewStyle,
  quantityOnHandText: {
    ...Typography.SUBHEAD,
    color: Colors.DARK_BLUE_TEXT,
    marginHorizontal: Spacing.MD,
    minWidth: 20,
    textAlign: 'center',
    fontWeight: '700',
  } as TextStyle,
  priceContainer: {
    alignItems: 'flex-end',
  } as ViewStyle,
  currentPrice: {
    ...Typography.SUBHEAD,
    color: Colors.DARK_BLUE_TEXT,
    fontWeight: '800',
    fontSize: 18,
  } as TextStyle,
  originalPrice: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    textDecorationLine: 'line-through',
    marginTop: 2,
  } as TextStyle,
  expiredBadge: {
  position: "absolute",
  bottom: -4,
  right: -4,
  backgroundColor: Colors.DARK_GRAY_TEXT,
  borderRadius: BorderRadius.XS,
  paddingHorizontal: 6,
  paddingVertical: 2,
} as ViewStyle,
expiredText: {
  ...Typography.CAPTION,
  color: Colors.RED,
  fontWeight: "700",
} as TextStyle,

});

export default CartItemComponent;