
// ProductCard.tsx - Version corrigée
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Heart, Star, Check, ShoppingBasket } from "lucide-react-native";
import { ProductCard as ProductCardModel} from "../models/ProductCard";
import { replaceBaseUrl } from "../utils/urlHelper";

interface ProductCardProps extends ProductCardModel {
  cardWidth?: number; // Largeur passée depuis le parent
}

export default function ProductCard(props: ProductCardProps) {
  const { cardWidth, ...product } = props;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  const handleAddToCart = () => {
    setIsAddedToCart(true);
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 1500);
  };

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
  };

  const dynamicStyles = StyleSheet.create({
    card: {
      width: cardWidth || "100%", // Utilise la largeur passée en props
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      padding: 12,
      position: "relative",
      elevation: 1,
    },
  });

  return (
    <View style={dynamicStyles.card}>
      {/* Discount Badge */}
      {product.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{product.discount}</Text>
        </View>
      )}

      {/* Favorite Heart */}
      <TouchableOpacity 
        style={styles.heartBtn}
        onPress={toggleFavorite}
        activeOpacity={0.7}
      >
        <Heart 
          size={20} 
          color={isFavorite ? "#E53935" : "#BDBDBD"} 
          fill={isFavorite ? "#E53935" : "transparent"}
        />
      </TouchableOpacity>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: replaceBaseUrl("http://localhost:9000/mkadia-objects/885d07f7-19c2-45d7-9f07-0d983c131e59_carrot.jpg")}} 
          onError={(e)=> console.log(e.nativeEvent.error)} 
          style={styles.image} 
        />
      </View>

      {/* Product Info */}
      <View style={styles.infoSection}>
        {/* Rating */}
        <View style={styles.ratingRow}>
          <Star size={12} color="#FFA726" fill="#FFA726" />
          <Text style={styles.ratingText}>4.5</Text>
          <Text style={styles.reviewsText}>(28)</Text>
        </View>

        {/* Product Name */}
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Price and Add Button in the same row */}
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{product.price}</Text>
            {product.unit && <Text style={styles.unit}>/{product.unit}</Text>}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.addBtn,
              isAddedToCart && styles.addBtnSuccess
            ]} 
            onPress={handleAddToCart}
            activeOpacity={0.8}
            disabled={isAddedToCart}
          >
            {isAddedToCart ? (
              <Check size={16} color="#fff" />
            ) : (
              <ShoppingBasket size={16} color="#fff" />
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
    top: 8,
    left: 8,
    backgroundColor: "#E53935",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 3,
    elevation: 2,
  },
  
  discountText: { 
    color: "#fff", 
    fontSize: 10, 
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  heartBtn: { 
    position: "absolute", 
    top: 8, 
    right: 8, 
    zIndex: 3,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 6,
    borderRadius: 20,
    elevation: 1,
  },

  imageContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 12,
  },

  image: { 
    width: "100%", 
    height: 100, 
    borderRadius: 8,
    resizeMode: "cover",
  },

  infoSection: {
    flex: 1,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  ratingText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFA726",
    marginLeft: 4,
  },

  reviewsText: {
    fontSize: 10,
    color: "#9E9E9E",
    marginLeft: 2,
  },

  productName: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#2C3E50", 
    lineHeight: 18,
    marginBottom: 8,
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
  },

  price: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#27AE60",
  },

  unit: { 
    fontSize: 12, 
    color: "#7F8C8D",
    marginLeft: 2,
  },

  addBtn: { 
    backgroundColor: "#4CAF50", 
    padding: 8, 
    borderRadius: 12,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  addBtnSuccess: {
    backgroundColor: "#27AE60",
  },
});
