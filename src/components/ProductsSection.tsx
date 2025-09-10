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
import ProductCard from "./ProductCard";
import { ProductCard as ProductCardModel } from "../models/ProductCard";
import { 
  Colors, 
  Spacing, 
  BorderRadius, 
  Typography 
} from "../constants/DesignSystem";

interface ProductsSectionProps {
  title?: string;
  products: ProductCardModel[];
  productsLoading: boolean;
  loadingMore: boolean;
  loadMoreProducts: () => void;
  showSeeAll?: boolean; 
  onSeeAllPress?: () => void;
  onAddToCart?: (product: ProductCardModel) => void;
  onProductPress?: (product: ProductCardModel) => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  title,
  products,
  productsLoading,
  loadingMore,
  loadMoreProducts,
  showSeeAll = true,
  onSeeAllPress,
  onProductPress,
  onAddToCart

}) => {
  const screenData = useWindowDimensions();
  
  const responsiveConfig = {
    numColumns: 2,
    horizontalPadding: Spacing.SM,
    cardSpacing: Spacing.MD,
  };

  const cardWidth = useMemo(() => {
    const { numColumns, horizontalPadding, cardSpacing } = responsiveConfig;
    const availableWidth = screenData.width - (horizontalPadding * 2);
    return (availableWidth - (cardSpacing * (numColumns - 1))) / numColumns;
  }, [screenData.width]);

  const handleSeeAllPress = () => {
    onSeeAllPress?.();
  };

  const handleProductPress = (product: ProductCardModel) => {
    onProductPress?.(product);
  };

  const handleAddToCart = (product: ProductCardModel) => {
    onAddToCart?.(product);
  }
  
  const renderSkeletonCard = (index: number) => (
    <SkeletonPlaceholder.Item
      key={index}
      width={cardWidth}
      height={200}
      borderRadius={BorderRadius.MD}
      marginBottom={Spacing.MD}
    />
  );

  const renderSkeletonRow = () => (
    <View style={styles.skeletonRow}>
      {Array.from({ length: responsiveConfig.numColumns }, (_, index) => (
        <SkeletonPlaceholder.Item
          key={index}
          width={cardWidth}
          height={200}
          borderRadius={BorderRadius.MD}
        />
      ))}
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <SkeletonPlaceholder 
          borderRadius={BorderRadius.MD}
          backgroundColor={Colors.LIGHT_GRAY_BG || "#F3F4F6"}
          highlightColor={Colors.WHITE || "#FFFFFF"}
          speed={1200}
        >
          {renderSkeletonRow()}
        </SkeletonPlaceholder>
      </View>
    );
  };

  const renderProductItem = ({ item }: { item: ProductCardModel }) => (
    <View style={{ 
      width: cardWidth, 
      marginBottom: responsiveConfig.cardSpacing 
    }}>
      <ProductCard 
        {...item} 
        cardWidth={cardWidth}
        onAddToCart={() => handleAddToCart(item)}
        onPress={() => handleProductPress(item)}
      />
    </View>
  );

  if (productsLoading) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {showSeeAll && (
            <TouchableOpacity activeOpacity={0.7} disabled>
              <Text style={[styles.seeAllText, { opacity: 0.5 }]}>Voir tout</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.skeletonContainer}>
          <SkeletonPlaceholder 
            borderRadius={BorderRadius.MD}
            backgroundColor={Colors.LIGHT_GRAY_BG || "#F3F4F6"}
            highlightColor={Colors.WHITE || "#FFFFFF"}
            speed={1200}
          >
            {/* Première rangée */}
            {renderSkeletonRow()}
            {/* Deuxième rangée */}
            <View style={[styles.skeletonRow, { marginTop: Spacing.MD }]}>
              {Array.from({ length: responsiveConfig.numColumns }, (_, index) => (
                <SkeletonPlaceholder.Item
                  key={index + 2}
                  width={cardWidth}
                  height={200}
                  borderRadius={BorderRadius.MD}
                />
              ))}
            </View>
          </SkeletonPlaceholder>
        </View>
      </View>
    );
  }

  if (products.length === 0 && !productsLoading) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aucun produit disponible</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {showSeeAll && (
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={handleSeeAllPress}
            accessibilityLabel="Voir tous les produits"
            accessibilityRole="button"
          >
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList 
        style={{ paddingHorizontal: 0 }}
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={responsiveConfig.numColumns}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          { paddingHorizontal: responsiveConfig.horizontalPadding }
        ]}
        renderItem={renderProductItem}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Liste des produits"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 0,
    marginBottom: Spacing.LG,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.XS,
    marginBottom: Spacing.MD,
  },
  sectionTitle: {
    ...Typography.HEADLINE,
    color: Colors.DARK_BLUE_TEXT,
    fontSize: 20,
  },
  seeAllText: {
    ...Typography.BODY,
    color: Colors.GREEN_BG,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: Spacing.SM,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  footerLoader: {
    paddingVertical: Spacing.LG,
  },
  skeletonContainer: {
    paddingHorizontal: 8,
  },
  skeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.MD,
  },
  skeletonCard: {
    height: 200,
    borderRadius: BorderRadius.MD,
  },
  emptyState: {
    padding: Spacing.XL,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.MD,
    marginHorizontal: Spacing.SM,
    marginTop: Spacing.MD,
  },
  emptyText: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    textAlign: "center",
  },
});

export default ProductsSection;