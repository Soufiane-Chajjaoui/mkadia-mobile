import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import ProductCard from "../../../components/ProductCard";
import { ProductCard as ProductCardModel } from "../../../models/ProductCard";

interface ProductsSectionProps {
  title?: string;
  products: ProductCardModel[];
  productsLoading: boolean;
  loadingMore: boolean;
  loadMoreProducts: () => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  title,
  products,
  productsLoading,
  loadingMore,
  loadMoreProducts,
}) => {
  const screenData = useWindowDimensions();
  const responsiveConfig = {
    numColumns: 2,
    horizontalPadding: 8,
    cardSpacing: 12,
  };

  const cardWidth = useMemo(() => {
    const { numColumns, horizontalPadding, cardSpacing } = responsiveConfig;
    const availableWidth = screenData.width - horizontalPadding * 2;
    return (availableWidth - cardSpacing * (numColumns - 1)) / numColumns;
  }, [screenData.width]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <SkeletonPlaceholder borderRadius={12}>
          <View style={styles.skeletonRow}>
            <View style={styles.skeletonCard} />
            <View style={styles.skeletonCard} />
          </View>
        </SkeletonPlaceholder>
      </View>
    );
  };

  if (productsLoading) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <SkeletonPlaceholder borderRadius={12}>
          <View style={styles.skeletonRow}>
            <View style={styles.skeletonCard} />
            <View style={styles.skeletonCard} />
          </View>
          <View style={styles.skeletonRow}>
            <View style={styles.skeletonCard} />
            <View style={styles.skeletonCard} />
          </View>
        </SkeletonPlaceholder>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAllText}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={responsiveConfig.numColumns}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingHorizontal: responsiveConfig.horizontalPadding }}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth, marginBottom: responsiveConfig.cardSpacing }}>
            <ProductCard {...item} cardWidth={cardWidth} />
          </View>
        )}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  footerLoader: {
    paddingVertical: 16,
  },
  skeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingRight: 8,
  },
  skeletonCard: {
    flex: 1,
    height: 200,
    borderRadius: 12,
    marginHorizontal: 4,
  },
});

export default ProductsSection;
