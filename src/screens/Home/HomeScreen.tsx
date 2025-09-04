import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import Header from "./components/Header";
import OffersSlider from "./components/OffersSection";
import SearchBar from "./components/SearchBar";
import CategoriesSection from "./components/CategoriesSection";
import { getCategories$ } from "../../apis/PublicAPI";
import { CategoryCard } from "../../models/CategoryCard";
import ProductsSection from "./components/ProductsSection"; // ← Import

export default function HomeScreen() {
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);

  const [categories, setCategories] = useState<CategoryCard[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

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

    return () => categoriesSubscription.unsubscribe();
  }, []);

  const offers = [
    { id: "1", img: "https://picsum.photos/seed/apple/200", title: "Livraison Gratuite", subtitle: "Commande min MAD" },
    { id: "2", img: "https://picsum.photos/seed/banana/200", title: "Fruits de Saison", subtitle: "Jusqu'à -30%" },
    { id: "3", img: "https://picsum.photos/seed/tomato/200", title: "100% Bio", subtitle: "Qualité garantie" },
  ];

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <Header cartCount={cartCount} hasNotification={hasNotification} location="Safi, Maroc" />
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <OffersSlider offers={offers} />
          <CategoriesSection categories={categories} loading={categoriesLoading} />
          <ProductsSection /> {/* Affichage des produits */}
        </View>
      }
      data={[]}
      renderItem={null}
      keyExtractor={() => ""}
      contentContainerStyle={styles.container} // ← padding global
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 8, // padding gauche/droite
    paddingTop: 10,        // padding en haut
    paddingBottom: 30,     // padding en bas
  },
  headerContainer: {
    flexDirection: 'column',
    gap: 10,
    alignContent: "space-between"
  }
});

