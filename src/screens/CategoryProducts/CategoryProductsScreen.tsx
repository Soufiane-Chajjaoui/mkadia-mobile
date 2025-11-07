import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getProductsPaginatedByCategory$ } from "../../apis/PublicAPI";
import { ProductCard as ProductCardModel } from "../../models/ProductCard";
import { PaginatedResponse } from "../../types/PaginatedResponse";
import { RootStackParamList } from "../../types/navigation";
import { CategoryCard } from "../../models/CategoryCard";
import { Colors, Spacing } from "../../constants/DesignSystem";
import CategoryHeader from "./components/CategoryHeader";
import { useAppDispatch } from "../../hooks/useRedux";
import ProductCard from "../../components/ProductCard";
import { addItemAsync } from "../../features/cart/cartSlice";

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
      next: (data: PaginatedResponse<ProductCardModel>) => {
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
    dispatch(addItemAsync({ id: new Date().getTime(), productId: product.id, quantity: 1 }));
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
      next: (data: PaginatedResponse<ProductCardModel>) => {
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

  const renderProductItem = ({ item, index }: { item: ProductCardModel; index: number }) => (
    <View style={{
      width: '46%',
      marginRight: index % 2 === 0 ? '3.5%' : 0,
      marginLeft: index % 2 === 0 ? '2%' : 0,
      marginBottom: Spacing.MD
    }}>
      <ProductCard
        {...item}
        onAddToCart={() => handleAddToCart(item)}
        onPress={() => handleProductPress(item)}
      />
    </View>
  );

  const renderHeader = () => {
    return <View style={{marginBottom: -10}}>
      <CategoryHeader
        category={category}
        productsCount={products.length}
        loading={loading}
        onBackPress={handleBackPress}
      />
    </View>
  }


  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item, index) => `product-${item.id}-${index}`}
        numColumns={2}
        ListFooterComponent={() => loadingMore ? <ActivityIndicator /> : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.GREEN_BG]}
            tintColor={Colors.GREEN_BG}
          />
        }
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 0,
    paddingBottom: 50,
  },
});

export default CategoryProductsScreen;
