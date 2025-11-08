import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Star } from "lucide-react-native";
import { Colors, Spacing, Typography } from "../../../constants/DesignSystem";
import PriceText from "../../../components/PriceText";

interface ProductInfoSectionProps {
  name: string;
  price: number;
  discount?: number;
  unit?: string;
  description?: string;
  averageRating?: number;
  totalReviews?: number;
}

const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  name,
  price,
  discount,
  unit,
  description,
  averageRating = 0,
  totalReviews = 0,
}) => {
  const calculateDiscountedPrice = () => {
    if (discount) {
      const discountAmount = (price * discount) / 100;
      return price - discountAmount;
    }
    return price;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.productName}>{name}</Text>
      
      {/* Prix */}
      <View style={styles.priceContainer}>
        <PriceText
          amount={calculateDiscountedPrice()}
          style={styles.currentPrice}
          iconSize={20}
          iconColor={Colors.GREEN_TEXT}
        />
        {discount && (
          <PriceText
            amount={price}
            style={styles.originalPrice}
            iconSize={14}
            iconColor={Colors.GRAY_TEXT}
          />
        )}
        {unit && <Text style={styles.priceUnit}>/{unit}</Text>}
      </View>

      {/* Rating */}
      {totalReviews > 0 && (
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                color={Colors.ORANGE_ICON}
                fill={star <= Math.round(averageRating) ? Colors.ORANGE_ICON : "transparent"}
              />
            ))}
          </View>
          <Text style={styles.ratingText}>
            {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'avis' : 'avis'})
          </Text>
        </View>
      )}

      {/* Description */}
      {description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.LG,
  },
  productName: {
    ...Typography.HEADLINE,
    fontSize: 24,
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.SM,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.MD,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.GREEN_TEXT,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: Colors.GRAY_TEXT,
    marginLeft: Spacing.SM,
  },
  priceUnit: {
    ...Typography.BODY,
    color: Colors.DARK_GRAY_TEXT,
    marginLeft: Spacing.XS,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.LG,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: Spacing.SM,
  },
  ratingText: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
  },
  section: {
    marginBottom: Spacing.LG,
  },
  sectionTitle: {
    ...Typography.SUBHEAD,
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.MD,
  },
  description: {
    ...Typography.BODY,
    color: Colors.DARK_GRAY_TEXT,
    lineHeight: 22,
  },
});

export default ProductInfoSection;