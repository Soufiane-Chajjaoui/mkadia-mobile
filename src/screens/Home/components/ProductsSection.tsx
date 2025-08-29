import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ProductCard from '../../../components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: string;
  unit?: string;
  img: string;
  discount?: string;
}

interface ProductsSectionProps {
  products: Product[];
  title: string;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ products, title }) => {
  // Fonction pour organiser les produits en rangées de 2
  const organizeProductsInRows = (products: Product[]) => {
    const rows = [];
    for (let i = 0; i < products.length; i += 2) {
      rows.push(products.slice(i, i + 2));
    }
    return rows;
  };

  const productRows = organizeProductsInRows(products);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAllText}>Voir tout</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.productsContainer}>
        {productRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.productRow}>
            {row.map((product) => (
              <View key={product.id} style={styles.productWrapper}>
                <ProductCard {...product} />
              </View>
            ))}
            {/* Si la rangée n'a qu'un produit, ajouter un espace vide */}
            {row.length === 1 && <View style={styles.productWrapper} />}
          </View>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  section: { 
    marginTop: 24,
  },
  
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#2C3E50" 
  },
  
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },

  productsContainer: {
    paddingBottom: 20,
  },
  
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  
  productWrapper: {
    flex: 1,
    marginBottom: 8,
  },
});

export default ProductsSection;