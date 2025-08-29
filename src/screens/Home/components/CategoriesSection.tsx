import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';


interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.seeAllText}>Voir tout</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.categoryCard, { backgroundColor: item.color }]}
            activeOpacity={0.8}
          >
            <Text style={styles.categoryIcon}>{item.icon}</Text>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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

  categoriesContainer: {
    paddingRight: 16,
    gap: 12,
  },
  
  categoryCard: { 
    alignItems: "center", 
    padding: 16, 
    borderRadius: 16,
    minWidth: 80,
  },
  
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  
  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2C3E50",
    textAlign: "center",
  },
});

export default CategoriesSection;