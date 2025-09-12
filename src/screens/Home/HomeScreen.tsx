import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import Header from "./components/Header";
import OffersSlider from "./components/OffersSection";
import SearchBar from "./components/SearchBar";
import CategoriesSection from "./components/CategoriesSection";
import { getCategories$ } from "../../apis/PublicAPI";
import { CategoryCard } from "../../models/CategoryCard";
import ProductsSection from "../../components/ProductsSection";
import { ProductCard as ProductCardModel } from "../../models/ProductCard";
import { getProductsPaginated$ } from "../../apis/PublicAPI";
import { PaginatedResponse } from "../../types/PaginatedResponse";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { Colors, Spacing } from "../../constants/DesignSystem";
import { useAppDispatch, useAppSelector } from "../../hooks/useStateApp";
import { addItem } from "../../features/cart/cartSlice";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);
  const [refreshing, setRefreshing] = useState(false);

  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [products, setProducts] = useState<ProductCardModel[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const items = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();


  const loadInitialData = useCallback(() => {
    // Chargement des catégories
    setCategoriesLoading(true);
    const categoriesSubscription = getCategories$().subscribe({
      next: (data: CategoryCard[]) => {
        setCategories(data);
        setCategoriesLoading(false);
      },
      error: (err) => {
        console.error("Erreur categories:", err);
        setCategoriesLoading(false);
      },
    });

    // Chargement des produits
    setProductsLoading(true);
    const productsSubscription = getProductsPaginated$(0, 10, 10).subscribe({
      next: (data: PaginatedResponse<ProductCardModel>) => {
        setProductsLoading(false);
        setProducts(data.elements ?? []);
        setHasMoreProducts(data.hasMore ?? false);
        setCurrentPage(data.currentPage ?? 0);
      },
      error: (err) => {
        console.error("Erreur products:", err);
        setProductsLoading(false);
      },
    });

    return () => {
      categoriesSubscription.unsubscribe();
      productsSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const cleanup = loadInitialData();
    return cleanup;
  }, [loadInitialData]);

  // Refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(0);
    setHasMoreProducts(true);
    
    const cleanup = loadInitialData();
    
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);

    return cleanup;
  }, [loadInitialData]);

  // Charger plus de produits
  const loadMoreProducts = useCallback(() => {
    if (loadingMore || !hasMoreProducts) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    const sub = getProductsPaginated$(nextPage, 10, 10).subscribe({
      next: (data: PaginatedResponse<ProductCardModel>) => {
        setLoadingMore(false);
        setProducts((prev) => [...prev, ...(data.elements ?? [])]);
        setHasMoreProducts(data.hasMore ?? false);
        setCurrentPage(data.currentPage ?? nextPage);
      },
      error: (err) => {
        console.error("Erreur load more:", err);
        setLoadingMore(false);
      },
    });

    return () => sub.unsubscribe();
  }, [loadingMore, hasMoreProducts, currentPage]);

  // Navigation vers détail produit
  const handleProductPress = (product: ProductCardModel) => {
    navigation.navigate("ProductDetails", product); // Corrigé: ProductDetail au lieu de ProductDetails
  };

  const handleAddToCart = (product: ProductCardModel) => {
    dispatch(addItem({id : product.id, name : product.name, price: product.price, quantity: 1}));
  }

  // Navigation vers catégorie
  const handleCategoryPress = (category: CategoryCard) => {
    navigation.navigate("CategoryProducts", category);
  };

  // Données des offres
  const offers = [
    { 
      id: "1", 
      img: "https://picsum.photos/seed/apple/200", 
      title: "Livraison Gratuite", 
      subtitle: "Commande min 200 MAD" 
    },
    { 
      id: "2", 
      img: "https://picsum.photos/seed/banana/200", 
      title: "Fruits de Saison", 
      subtitle: "Jusqu'à -30%" 
    },
    { 
      id: "3", 
      img: "https://picsum.photos/seed/tomato/200", 
      title: "100% Bio", 
      subtitle: "Qualité garantie" 
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.GREEN_BG]}
            tintColor={Colors.GREEN_BG}
          />
        }
      >
        {/* Header */}
        <Header 
          cartCount={items.length} 
          hasNotification={hasNotification} 
          location="Safi, Maroc" 
        />

        {/* Barre de recherche */}
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        {/* Section des offres */}
        <OffersSlider offers={offers} />

        {/* Section des catégories */}
        <CategoriesSection 
          categories={categories} 
          loading={categoriesLoading}
          onCategoryPress={handleCategoryPress}
        />

        {/* Section des produits */}
        <ProductsSection
          title="Meilleurs Produits"
          products={products}
          productsLoading={productsLoading}
          loadingMore={loadingMore}
          showSeeAll={true}
          onAddToCart={handleAddToCart}
          onProductPress={handleProductPress}
          loadMoreProducts={loadMoreProducts}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.LIGHT_GRAY_BG || "#FAFAFA",
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.XXS,
  },
});

export default HomeScreen;