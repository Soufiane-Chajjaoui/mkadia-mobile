import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Plus, Minus, ShoppingBasket } from "lucide-react-native";
import { IconSize, Colors, Spacing, Elevation, BorderRadius, Typography } from "../../../constants/DesignSystem";
import PriceText from "../../../components/PriceText";


interface ProductBottomActionsProps {
  cartQuantity: number;
  price: number;
  discount?: number;
  onIncrementQuantity: () => void;
  onDecrementQuantity: () => void;
  onAddToCart: () => void;
}

const ProductBottomActions: React.FC<ProductBottomActionsProps> = ({
  cartQuantity,
  price,
  discount,
  onIncrementQuantity,
  onDecrementQuantity,
  onAddToCart
}) => {
  const calculateDiscountedPrice = () => {
    if (discount) {
      const discountAmount = (price * discount) / 100;
      return price - discountAmount;
    }
    return price;
  };

  const totalPrice = calculateDiscountedPrice() * cartQuantity;

  return (
    <View style={styles.bottomActions}>
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={onDecrementQuantity}
        >
          <Minus size={IconSize.SM} color={Colors.DARK_BLUE_TEXT} />
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{cartQuantity}</Text>
        
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={onIncrementQuantity}
        >
          <Plus size={IconSize.SM} color={Colors.DARK_BLUE_TEXT} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={onAddToCart}
      >
        <ShoppingBasket size={IconSize.MD} color={Colors.WHITE_ICON} />
        <View style={styles.addToCartTextContainer}>
          <Text style={styles.addToCartText}>Ajouter • </Text>
          <PriceText
            amount={totalPrice}
            style={styles.addToCartText}
            iconSize={16}
            iconColor={Colors.WHITE}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderTopWidth: 1,
    borderTopColor: Colors.LIGHT_GRAY_BG,
    ...Elevation.MEDIUM,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.MD,
    padding: Spacing.XS,
    marginRight: Spacing.MD,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.SM,
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    ...Typography.BODY,
    fontWeight: '600',
    color: Colors.DARK_BLUE_TEXT,
    paddingHorizontal: Spacing.MD,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GREEN_BG,
    paddingVertical: Spacing.MD,
    paddingHorizontal: Spacing.LG,
    borderRadius: BorderRadius.MD,
    gap: Spacing.SM,
    ...Elevation.LOW,
  },
  addToCartTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartText: {
    ...Typography.SUBHEAD,
    color: Colors.WHITE_TEXT,
    fontWeight: '600',
  },
});

export default ProductBottomActions;