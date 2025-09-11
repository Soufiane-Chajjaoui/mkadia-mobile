import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getProductsPaginatedByCategory$ } from "../../apis/PublicAPI";
import { ProductCard, ProductCard as ProductCardModel } from "../../models/ProductCard";
import { PaginatedResponse } from "../../types/PaginatedResponse";
import { RootStackParamList } from "../../types/navigation";
import { CategoryCard } from "../../models/CategoryCard";
import { Colors } from "../../constants/DesignSystem";
import CategoryHeader from "./components/CategoryHeader";
import CategoryProductsContainer from "./components/CategoryProductsContainer";
import { useAppDispatch } from "../../hooks/hooks";
import { addItem } from "../../features/cart/cartSlice";

type Props = NativeStackScreenProps<RootStackParamList, 'CategoryProducts'>;

const CategoryProductsScreen: React.FC<Props> = ({ route, navigation }) => {
  const category: CategoryCard = route.params;
  
  const [products, setProducts] = useState<ProductCardModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    loadProducts();
  }, [category.id]);

  const loadProducts = () => {
    setLoading(true);
    const sub = getProductsPaginatedByCategory$(0, 10, 10, category.id).subscribe({
      next: (data: PaginatedResponse<ProductCard>) => {
        setLoading(false);
        setRefreshing(false);
        setProducts(data.elements ?? []);
        setHasMoreProducts(data.hasMore ?? false);
        setCurrentPage(data.currentPage);
      },
      error: (err) => {
        console.error(err);
        setLoading(false);
        setRefreshing(false);
      },
    });

    return () => sub.unsubscribe();
  };

  const handleAddToCart = (product: ProductCardModel) => {
    dispatch(addItem({id : product.id, name : product.name, price: product.price, quantity: 1}));
  }

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts();
  }, []);

  const loadMoreProducts = useCallback(() => {
    if (loadingMore || !hasMoreProducts) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    const sub = getProductsPaginatedByCategory$(nextPage, 10, 10, category.id).subscribe({
      next: (data: PaginatedResponse<ProductCard>) => {
        setLoadingMore(false);
        setProducts((prev) => [...prev, ...data.elements]);
        setHasMoreProducts(data.hasMore ?? false);
        setCurrentPage(data.currentPage);
      },
      error: (err) => {
        console.error(err);
        setLoadingMore(false);
      },
    });

    return () => sub.unsubscribe();
  }, [loadingMore, hasMoreProducts, currentPage, category.id]);

  const handleProductPress = (product: ProductCardModel) => {
    navigation.navigate("ProductDetails", product);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <CategoryHeader 
        category={category}
        productsCount={products.length}
        loading={loading}
        onBackPress={handleBackPress}
      />
      
      <CategoryProductsContainer 
        products={products}
        loading={loading}
        loadingMore={loadingMore}
        refreshing={refreshing}
        onAddToCart={handleAddToCart}
        onRefresh={handleRefresh}
        onLoadMoreProducts={loadMoreProducts}
        onProductPress={handleProductPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
});

export default CategoryProductsScreen;