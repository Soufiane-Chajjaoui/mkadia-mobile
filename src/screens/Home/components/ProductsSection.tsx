import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProductCard from "../../../components/ProductCard";
import { ProductCard as ProductCardModel } from "../../../models/ProductCard";

interface ProductsSectionProps {
  products: ProductCardModel[];
  loading?: boolean;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ products, loading = false }) => {
  const organizeProductsInRows = (items: ProductCardModel[]) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(items.slice(i, i + 2));
    }
    return rows;
  };

  if (loading) {
    // Skeleton loader (2 colonnes × 2 rangées simulées)
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meilleurs Produits</Text>
        </View>
        <View style={styles.productsContainer}>
          {Array.from({ length: 2 }).map((_, rowIndex) => (
            <View key={rowIndex} style={styles.productRow}>
              {Array.from({ length: 2 }).map((__, colIndex) => (
                <SkeletonPlaceholder key={colIndex} borderRadius={12}>
                  <SkeletonPlaceholder.Item
                    width={165}
                    height={180}
                    borderRadius={12}
                    marginRight={colIndex === 0 ? 12 : 0}
                  />
                </SkeletonPlaceholder>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }

  const productRows = organizeProductsInRows(products);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Meilleurs Produits</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAllText}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.productsContainer}>
        {productRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.productRow}>
            {row.map((product) => (
              <View key={product.id} style={styles.productWrapper}>
                <ProductCard {...product} />
              </View>
            ))}
            {row.length === 1 && <View style={styles.productWrapper} />}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginTop: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#2C3E50" 
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  productsContainer: { paddingBottom: 20 },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
    marginBottom: 16,
  },
  productWrapper: { flex: 1 },
});

export default ProductsSection;
