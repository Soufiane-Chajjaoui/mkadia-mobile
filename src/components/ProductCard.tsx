import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { Plus, Heart, Star, Check, ShoppingBasket } from "lucide-react-native";

const screenWidth = Dimensions.get("window").width;

interface ProductCardProps {
  name: string;
  price: string;
  unit?: string;
  img: string;
  discount?: string;
}

export default function ProductCard({ name, price, unit, img, discount }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setIsAddedToCart(true);
    // Ici tu peux ajouter la logique pour ajouter au panier
    // Par exemple: addToCart({ name, price, unit, img })
    
    // Remettre à l'état initial après 1.5 secondes
    setTimeout(() => {
      setIsAddedToCart(false);
    }, 1500);
  };

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
  };

  return (
    <View style={styles.card}>
      {/* Discount Badge */}
      {discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{discount}</Text>
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
        <Image source={{ uri: img }} style={styles.image} />
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
          {name}
        </Text>

        {/* Price and Add Button in the same row */}
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{price}</Text>
            {unit && <Text style={styles.unit}>/{unit}</Text>}
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
  card: {
    width: '100%',
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    position: "relative",
  },

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