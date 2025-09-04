import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import Header from "./components/Header";
import OffersSlider from "./components/OffersSection";
import SearchBar from "./components/SearchBar";
import CategoriesSection from "./components/CategoriesSection";
import { getCategories$ } from "../../apis/PublicAPI";
import { CategoryCard } from "../../models/CategoryCard";
import ProductsSection from "./components/ProductsSection";
import { ProductCard as ProductCardModel } from "../../models/ProductCard";
import { getProductsPaginated$ } from "../../apis/PublicAPI";
import { PaginatedProductResponse } from "../../models/PaginatedProductResponse";

export default function HomeScreen() {
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);

  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [products, setProducts] = useState<ProductCardModel[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const categoriesSubscription = getCategories$().subscribe({
      next: (data: CategoryCard[]) => {
        setCategories(data);
        setCategoriesLoading(false);
      },
      error: (err) => {
        console.error(err);
        setCategoriesLoading(false);
      },
    });

    setProductsLoading(true);
    const sub = getProductsPaginated$(0, 10, 10).subscribe({
      next: (data: PaginatedProductResponse) => {
        setProductsLoading(false);
        setProducts(data.elements ?? []);
        setHasMoreProducts(data.hasMore ?? false);
        setCurrentPage(data.currentPage);
      },
      error: (err) => {
        console.error(err);
        setProductsLoading(false);
      },
    });

    return () => {
      sub.unsubscribe();
      categoriesSubscription.unsubscribe();
    };
  }, []);
   // --- Charger plus ---
  const loadMoreProducts = useCallback(() => {
    if (loadingMore || !hasMoreProducts) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    const sub = getProductsPaginated$(nextPage, 10, 10).subscribe({
      next: (data: PaginatedProductResponse) => {
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


  const offers = [
    { id: "1", img: "https://picsum.photos/seed/apple/200", title: "Livraison Gratuite", subtitle: "Commande min MAD" },
    { id: "2", img: "https://picsum.photos/seed/banana/200", title: "Fruits de Saison", subtitle: "Jusqu'à -30%" },
    { id: "3", img: "https://picsum.photos/seed/tomato/200", title: "100% Bio", subtitle: "Qualité garantie" },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Header cartCount={cartCount} hasNotification={hasNotification} location="Safi, Maroc" />
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <OffersSlider offers={offers} />
            <CategoriesSection categories={categories} loading={categoriesLoading} />
            <ProductsSection
                    title="Meilleurs Produits"
                    products={products}
                    productsLoading={productsLoading}
                    loadingMore={loadingMore}
                    loadMoreProducts={loadMoreProducts}
                  />
            </View>
        }
        data={[]}
        renderItem={null}
        keyExtractor={() => ""}
    />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFA",
    flex: 1,
    paddingHorizontal: 8
  },
  headerContainer: {
    flexDirection: 'column',
    gap: 15,
    alignContent: "space-between"
  }
});

