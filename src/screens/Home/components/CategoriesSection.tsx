import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { CategoryCard as CategoryCardModel } from "../../../models/CategoryCard";
import CategoryCard from "../../../components/CategoryCard";

interface CategoriesSectionProps {
  categories: CategoryCardModel[];
  loading?: boolean; 
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categories, loading = false }) => {
  if (loading) {
    // Skeleton Loader
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Catégories</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonPlaceholder key={index} borderRadius={16}>
              <SkeletonPlaceholder.Item 
                width={120} 
                height={120} 
                borderRadius={16} 
                marginRight={12} 
              />
            </SkeletonPlaceholder>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Normal content
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
          <CategoryCard key={item.id} category={item} />
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
    paddingHorizontal: 8,
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
    paddingLeft: 8,
    paddingRight: 16,
  },
});

export default CategoriesSection;
