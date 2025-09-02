import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import CategoriesSection from "./components/CategoriesSection";
import Header from "./components/Header";
import OffersSlider from "./components/OffersSlider";
import ProductsSection from "./components/ProductsSection";
import SearchBar from "./components/SearchBar";
import { getProducts$ } from "../../apis/HomeScreenApi";
import { ProductCard } from "../../models/ProductCard";


export default function HomeScreen() {
  const [hasNotification, setHasNotification] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);
  const [products, setProducts] = useState([] as ProductCard[]);

  useEffect(() => {
    const subscription = getProducts$().subscribe({
      next: (data : ProductCard[]) => {
        setProducts(data);
      },
      error: (err) => {
        console.error(err);
      },
    });
    return () => subscription.unsubscribe();
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

  const categories = [
    { id: "1", name: "Fruits", icon: "🍎", color: "#FFE0B2" },
    { id: "2", name: "Légumes", icon: "🥦", color: "#C8E6C9" },
    { id: "3", name: "Boissons", icon: "🥤", color: "#BBDEFB" },
    { id: "4", name: "Snacks", icon: "🍪", color: "#F8BBD9" },
    { id: "5", name: "Viande", icon: "🥩", color: "#FFCDD2" },
    { id: "6", name: "Poisson", icon: "🐟", color: "#B3E5FC" },
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
      
      <CategoriesSection categories={categories} />
      
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