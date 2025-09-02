import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import CategoriesSection from "./components/CategoriesSection";
import Header from "./components/Header";
import OffersSlider from "./components/OffersSlider";
import ProductsSection from "./components/ProductsSection";
import SearchBar from "./components/SearchBar";
import { getCategories$, getProducts$ } from "../../apis/HomeScreenApi";
import { ProductCard } from "../../models/ProductCard";
import { CategoryCard } from "../../models/CategoryCard";


export default function HomeScreen() {
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);
  const [products, setProducts] = useState([] as ProductCard[]);
  const [categories, setCategories] = useState([] as CategoryCard[]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { 
    const categoriesSubscription = getCategories$().subscribe({
      next: (data : CategoryCard[]) => {
        setLoading(false);
        setCategories(data);
      },
      error: (err) => {
        console.error(err);
      },
    });
    const productsSubscription = getProducts$().subscribe({
      next: (data : ProductCard[]) => {
        setProducts(data);
      },
      error: (err) => {
        console.error(err);
      },
    });
    return () => {
      productsSubscription.unsubscribe()
      categoriesSubscription.unsubscribe()
    };
  }, []);



  const offers = [
    { 
      id: "1", 
      img: "https://picsum.photos/seed/apple/200",
      title: "Livraison Gratuite",
      subtitle: `Commande min MAD`
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Header 
        cartCount={cartCount} 
        hasNotification={hasNotification} 
        location="Safi, Maroc" 
      />
      
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      <OffersSlider offers={offers} />
      
      <CategoriesSection categories={categories} loading={loading} />
      
      <ProductsSection 
        products={products} 
        title="Meilleurs Produits" 
      />
      
      {/* Espace pour le bottom tab */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FAFAFA", 
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  
  bottomSpacing: {
    height: 20,
  },
});