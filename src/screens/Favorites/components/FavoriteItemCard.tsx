import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity
} from "react-native";
import { ShoppingBasket, Trash2, Percent, AlertTriangle, Heart } from "lucide-react-native";
import { replaceBaseUrl } from "../../../utils/urlHelper";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
  IconSize,
  Elevation
} from "../../../constants/DesignSystem";
import { Favorite } from "../../../models/Favorite";

interface FavoriteItemCardProps {
  favorite: Favorite;
  onAddToCart: () => void;
  onRemoveFromFavorites: () => void;
  onPress?: () => void;
  isTogglingFavorite?: boolean;
}

export default function FavoriteItemCard({
  favorite,
  onAddToCart,
  onRemoveFromFavorites,
  onPress,
  isTogglingFavorite = false,
}: FavoriteItemCardProps) {
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const product = favorite.product;

  // 🧠 Calcul du prix remisé
  const discountedPrice = product.discount
    ? (Number(product.price) * (1 - product.discount / 100)).toFixed(2)
    : product.price;

  // 🧠 Vérifier si le produit est expiré
  const isExpired = Boolean(
    product.expirationDate &&
    new Date(product.expirationDate) < new Date()
  );

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    setIsAddedToCart(true);
    onAddToCart();
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  const handleRemove = (e: any) => {
    e.stopPropagation();
    onRemoveFromFavorites();
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Image du produit */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: replaceBaseUrl(
              product.urls?.[0]?.url ??
              "http://localhost:9000/mkadia-objects/default_product.jpg"
            ),
          }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Cœur favori - toujours rempli car on est dans les favoris */}
        <View style={styles.heartBadge}>
          <Heart
            size={16}
            color={Colors.RED_ICON}
            fill={Colors.RED_ICON}
          />
        </View>

        {/* Badge de réduction */}
        {product.discount && product.discount > 0 && !isExpired && (
          <View style={styles.discountBadge}>
            <Percent size={12} color={Colors.WHITE} />
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        )}

        {/* Badge Expiré */}
        {isExpired && (
          <View style={styles.expiredBadge}>
            <AlertTriangle size={12} color={Colors.WHITE} />
            <Text style={styles.expiredText}>Expiré</Text>
          </View>
        )}
      </View>

      {/* Détails du produit */}
      <View style={styles.detailsContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.unitText}>
            {product.quantity} {product.unit}
          </Text>
        </View>

        {/* 🏷️ Bloc Prix */}
        <View style={styles.bottomRow}>
          <View>
            {/* Si réduction et pas expiré */}
            {product.discount && !isExpired ? (
              <View style={styles.priceContainerColumn}>
                <Text style={styles.discountedPrice}>{discountedPrice} DH</Text>
                <Text style={styles.underlinedOldPrice}>{product.price} DH</Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.price,
                  isExpired && { color: Colors.RED, fontWeight: "600" },
                ]}
              >
                {product.price} DH
              </Text>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {/* Supprimer */}
            <TouchableOpacity
              onPress={handleRemove}
              disabled={isTogglingFavorite}
              style={styles.removeButton}
            >
              <Trash2
                size={IconSize.SM}
                color={isTogglingFavorite ? Colors.GRAY_ICON : Colors.RED_ICON}
              />
            </TouchableOpacity>

            {/* Ajouter au panier */}
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                isAddedToCart && styles.addToCartButtonSuccess,
                isExpired && { backgroundColor: Colors.GRAY_TEXT },
              ]}
              onPress={handleAddToCart}
              disabled={isAddedToCart || isExpired}
            >
              <ShoppingBasket size={IconSize.SM} color={Colors.WHITE} />
              <Text style={styles.addToCartText}>
                {isExpired
                  ? "Indisponible"
                  : isAddedToCart
                  ? "✓ Ajouté"
                  : "Ajouter"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.WHITE,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    borderBottomWidth: 2,
    borderColor: Colors.LIGHT_GRAY_BG,
    overflow: "hidden",
  },
  imageContainer: {
    width: 90,
    height: 90,
    margin: Spacing.MD,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.MD,
  },
  heartBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: Colors.WHITE,
    borderRadius: BorderRadius.CIRCULAR,
    padding: 4,
    ...Elevation.LOW,
  },
  discountBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: Colors.RED_BG,
    borderRadius: BorderRadius.SM,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: Colors.WHITE,
    fontSize: 10,
    fontWeight: "600",
  },
  expiredBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: Colors.RED,
    borderRadius: BorderRadius.SM,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  expiredText: {
    color: Colors.WHITE,
    fontSize: 10,
    fontWeight: "600",
  },
  detailsContainer: {
    flex: 1,
    padding: Spacing.MD,
    paddingLeft: 0,
    justifyContent: "space-between",
  },
  productName: {
    ...Typography.BODY,
    color: Colors.DARK_GRAY_TEXT,
    fontWeight: "600",
  },
  productDescription: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    marginVertical: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  unitText: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
    fontWeight: "500",
  },
  expirationDate: {
    ...Typography.CAPTION,
    color: Colors.GRAY_TEXT,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // 🧾 Nouveau style prix promotionnel
  priceContainerColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  underlinedOldPrice: {
    color: Colors.GRAY_TEXT,
    fontSize: 12,
    textDecorationLine: "line-through",
    marginTop: 2,
  },
  discountedPrice: {
    color: Colors.GREEN_TEXT,
    fontWeight: "700",
    fontSize: 16,
  },
  price: {
    color: Colors.GREEN_TEXT,
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.SM,
  },
  removeButton: {
    padding: Spacing.SM,
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.SM,
  },
  addToCartButton: {
    backgroundColor: Colors.GREEN_BG,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.SM,
    borderRadius: BorderRadius.MD,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  addToCartButtonSuccess: {
    backgroundColor: Colors.GREEN_TEXT,
  },
  addToCartText: {
    ...Typography.CAPTION,
    color: Colors.WHITE,
    fontWeight: "600",
  },
});
