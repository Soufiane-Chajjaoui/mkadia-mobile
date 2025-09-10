import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import ProductsSection from "../../../components/ProductsSection";
import { Colors, BorderRadius, Spacing, Elevation } from "../../../constants/DesignSystem";
import { ProductCard } from "../../../models/ProductCard";


interface CategoryProductsContainerProps {
  products: ProductCard[];
  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMoreProducts: () => void;
  onProductPress: (product: ProductCard) => void;
  onAddToCart: (product: ProductCard) => void
}


const CategoryProductsContainer: React.FC<CategoryProductsContainerProps> = ({ 
  products,
  loading,
  loadingMore,
  refreshing,
  onRefresh,
  onLoadMoreProducts,
  onProductPress,
  onAddToCart
}) => {

  const handleAddToCart = (product : ProductCard) => {
    onAddToCart?.(product)
  }
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.GREEN_BG]}
          tintColor={Colors.GREEN_BG}
        />
      }
    >
      <ProductsSection
        title=""
        products={products}
        productsLoading={loading}
        loadingMore={loadingMore}
        showSeeAll={false}
        onAddToCart={handleAddToCart}
        loadMoreProducts={onLoadMoreProducts}
        onProductPress={onProductPress}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: BorderRadius.XL,
    borderTopRightRadius: BorderRadius.XL,
    marginTop: -Spacing.XXS,
    paddingTop: Spacing.XXS,
    ...Elevation.LOW,
  },
});

export default CategoryProductsContainer;