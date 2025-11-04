import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import Header from "./components/Header";
import OffersSlider from "./components/OffersSection";
import SearchBar from "./components/SearchBar";
import CategoriesSection from "./components/CategoriesSection";
import { getCategories$ } from "../../apis/PublicAPI";
import { CategoryCard } from "../../models/CategoryCard";
import { ProductCard as ProductCardModel } from "../../models/ProductCard";
import { getProductsPaginated$ } from "../../apis/PublicAPI";
import { PaginatedResponse } from "../../types/PaginatedResponse";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";
import { Colors, Spacing, Typography } from "../../constants/DesignSystem";
import { useAppSelector } from "../../hooks/useRedux";
import ProductCard from "../../components/ProductCard";
import { navigate } from "../../navigation/NavigationService";
import SafeAreaWrapper from "../../components/SafeAreaWrapper";
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [products, setProducts] = useState<ProductCardModel[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const items = useAppSelector((state) => state.cart.items);

  const { toggleFavorite, togglingFavorites } = useFavorites();
  const { addToCart, addingToCart } = useCart();
  const [favoriteStates, setFavoriteStates] = useState<{[key: number]: boolean}>({});

  // Chargement initial des données
  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProductsLoading(true);
    const sub = getProductsPaginated$(0, 10, 10).subscribe({
      next: (data: PaginatedResponse<ProductCardModel>) => {
        setProductsLoading(false);
        setRefreshing(false);
        setProducts(data.elements ?? []);
        setHasMoreProducts(data.hasMore ?? false);
        setCurrentPage(data.currentPage);
      },
      error: (err) => {
        console.error(err);
        setProductsLoading(false);
        setRefreshing(false);
      },
    });

    return () => sub.unsubscribe();
  };

  const loadCategories = () => {
    setCategoriesLoading(true);
    const sub = getCategories$().subscribe({
      next: (data: CategoryCard[]) => {
        setCategories(data);
        setCategoriesLoading(false);
      },
      error: (err) => {
        console.error("Erreur categories:", err);
        setCategoriesLoading(false);
      },
    });
    return () => sub.unsubscribe()
  }
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts();
    loadCategories();
  }, []);

  const loadMoreProducts = useCallback(() => {
    if (loadingMore || !hasMoreProducts) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    const sub = getProductsPaginated$(nextPage, 10, 10).subscribe({
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
  }, [loadingMore, hasMoreProducts, currentPage]);

  // Navigation vers détail produit
  const handleProductPress = (product: ProductCardModel) => {
    navigation.navigate("ProductDetails", product);
  };

  const handleAddToCart = (product: ProductCardModel) => {
    addToCart(product.id, 1);
  };

  const handleToggleFavorite = (productId: number, currentState: boolean) => {
    const success = toggleFavorite(productId, currentState);
    if (success) {
      // Mettre à jour l'état local seulement si l'action a été autorisée
      setFavoriteStates(prev => ({ 
        ...prev, 
        [productId]: !currentState 
      }));
    }
  };

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

  const renderHeader = () => (
    <>
      <Header
        cartCount={items.length}
        hasNotification={hasNotification}
        onCartPress={() => navigate("Cart")}
        location="Safi, Maroc"
      />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <OffersSlider offers={offers} />
      <CategoriesSection
        categories={categories}
        loading={categoriesLoading}
        onCategoryPress={handleCategoryPress}
      />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Top Produits</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Voir tout</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderProductItem = ({ item, index }: { item: ProductCardModel; index: number }) => (
    <View style={{
      width: '48%',
      marginRight: index % 2 === 0 ? '4%' : 0,
      marginBottom: Spacing.MD
    }}>
      <ProductCard
        {...item}
        onAddToCart={() => handleAddToCart(item)}
        onPress={() => handleProductPress(item)}
        onToggleFavorite={handleToggleFavorite}
        initialFavoriteState={favoriteStates[item.id] || false}
        isTogglingFavorite={togglingFavorites[item.id] || false}
      />
    </View>
  );

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item, index) => `product-${item.id}-${index}`}
          numColumns={2}
          ListHeaderComponent={renderHeader}
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
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 0,
    marginBottom: Spacing.LG,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.MD,
    paddingHorizontal: Spacing.XS,
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
    paddingHorizontal: Spacing.SM,
    paddingBottom: 50,
  },
  bottomSpacer: {
    height: 50, // Espace supplémentaire en bas
  },
});

export default HomeScreen;
