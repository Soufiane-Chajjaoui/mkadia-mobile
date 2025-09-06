import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Heart, Star, Check, ShoppingBasket } from "lucide-react-native";
import { ProductCard as ProductCardModel} from "../models/ProductCard";
import { replaceBaseUrl } from "../utils/urlHelper";
import { 
  Colors, 
  Spacing, 
  BorderRadius, 
  Typography, 
  IconSize,
  Elevation 
} from "../constants/DesignSystem";

interface ProductCardProps extends ProductCardModel {
  cardWidth?: number;
  onAddToCart?: () => void;
  onToggleFavorite?: (isFavorite: boolean) => void;
}

export default function ProductCard(props: ProductCardProps) {
  const { cardWidth, onAddToCart, onToggleFavorite, ...product } = props;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  const handleAddToCart = () => {
    setIsAddedToCart(true);
    onAddToCart?.();
    
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 1500);
  };

  const toggleFavorite = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    onToggleFavorite?.(newFavoriteState);
  };

  const dynamicStyles = StyleSheet.create({
    card: {
      width: cardWidth || "100%",
      backgroundColor: Colors.WHITE,
      borderRadius: BorderRadius.MD,
      padding: Spacing.MD,
      position: "relative",
      ...Elevation.LOW,
    },
  });

  return (
    <View style={dynamicStyles.card}>
      {/* Discount Badge */}
      {product.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{product.discount}%</Text>
        </View>
      )}

      {/* Favorite Heart */}
      <TouchableOpacity 
        style={styles.heartBtn}
        onPress={toggleFavorite}
        activeOpacity={0.7}
        accessibilityLabel={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        accessibilityRole="button"
      >
        <Heart 
          size={IconSize.MD} 
          color={isFavorite ? Colors.RED_ICON : Colors.GRAY_ICON} 
          fill={isFavorite ? Colors.RED_ICON : "transparent"}
          accessibilityLabel="Icône favori"
        />
      </TouchableOpacity>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: replaceBaseUrl("http://localhost:9000/mkadia-objects/885d07f7-19c2-45d7-9f07-0d983c131e59_carrot.jpg")}} 
          onError={(e) => console.log("Image loading error:", e.nativeEvent.error)} 
          style={styles.image}
          accessibilityLabel={`Image de ${product.name}`}
        />
      </View>

      {/* Product Info */}
      <View style={styles.infoSection}>
        {/* Rating */}
        <View style={styles.ratingRow}>
          <Star size={IconSize.XS} color={Colors.ORANGE_ICON} fill={Colors.ORANGE_ICON} />
          <Text style={styles.ratingText}>4.5</Text>
          <Text style={styles.reviewsText}>(28)</Text>
        </View>

        {/* Product Name */}
        <Text 
          style={styles.productName} 
          numberOfLines={2}
          accessibilityLabel={`Produit: ${product.name}`}
        >
          {product.name}
        </Text>

        {/* Price and Add Button */}
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{product.price} MAD</Text>
            {product.unit && (
              <Text style={styles.unit}>/{product.unit}</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.addBtn,
              isAddedToCart && styles.addBtnSuccess
            ]} 
            onPress={handleAddToCart}
            activeOpacity={0.8}
            disabled={isAddedToCart}
            accessibilityLabel="Ajouter au panier"
            accessibilityRole="button"
            accessibilityState={{ disabled: isAddedToCart }}
          >
            {isAddedToCart ? (
              <Check size={IconSize.SM} color={Colors.WHITE_ICON} />
            ) : (
              <ShoppingBasket size={IconSize.SM} color={Colors.WHITE_ICON} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  discountBadge: {
    position: "absolute",
    top: Spacing.SM,
    left: Spacing.SM,
    backgroundColor: Colors.RED_BG,
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
    borderRadius: BorderRadius.SM,
    zIndex: 3,
    ...Elevation.MEDIUM,
  },
  
  discountText: { 
    color: Colors.WHITE_TEXT, 
    ...Typography.BADGE,
    letterSpacing: 0.5,
  },

  heartBtn: { 
    position: "absolute", 
    top: Spacing.SM, 
    right: Spacing.SM, 
    zIndex: 3,
    backgroundColor: Colors.TRANSPARENT_WHITE,
    padding: Spacing.SM,
    borderRadius: BorderRadius.CIRCULAR,
    ...Elevation.LOW,
  },

  imageContainer: {
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.MD,
    marginTop: Spacing.SM,
    marginBottom: Spacing.MD,
    overflow: "hidden",
  },

  image: { 
    width: "100%", 
    height: 100, 
    resizeMode: "cover",
  },

  infoSection: {
    flex: 1,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.SM,
  },

  ratingText: {
    ...Typography.CAPTION,
    color: Colors.ORANGE_TEXT,
    fontWeight: "600",
    marginLeft: Spacing.XS,
  },

  reviewsText: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    marginLeft: Spacing.XXS,
  },

  productName: { 
    ...Typography.BODY,
    fontWeight: "600", 
    color: Colors.DARK_BLUE_TEXT, 
    lineHeight: 18,
    marginBottom: Spacing.SM,
    minHeight: 36, // Pour éviter les sauts de layout
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    flex: 1,
  },

  price: { 
    ...Typography.SUBHEAD,
    fontWeight: "700", 
    color: Colors.GREEN_TEXT,
  },

  unit: { 
    ...Typography.CAPTION,
    color: Colors.DARK_GRAY_TEXT,
    marginLeft: Spacing.XXS,
  },

  addBtn: { 
    backgroundColor: Colors.GREEN_BG, 
    padding: Spacing.SM, 
    borderRadius: BorderRadius.MD,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
    ...Elevation.MEDIUM,
    shadowColor: Colors.GREEN_SHADOW,
  },

  addBtnSuccess: {
    backgroundColor: Colors.DARK_GREEN_BG,
  },
});

