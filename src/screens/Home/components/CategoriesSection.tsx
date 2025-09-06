import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { CategoryCard as CategoryCardModel } from "../../../models/CategoryCard";
import CategoryCard from "../../../components/CategoryCard";
import { RootStackParamList } from "../../../types/navigation";
import { 
  Colors, 
  Spacing, 
  Typography 
} from "../../../constants/DesignSystem";

interface CategoriesSectionProps {
  categories: CategoryCardModel[];
  loading?: boolean; 
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ 
  categories, 
  loading = false
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleCategoryPress = (category: CategoryCardModel) => {
    try {
      navigation.navigate("CategoryProducts", category);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleSeeAllPress = () => {
    // Navigation vers l'écran de toutes les catégories
    // navigation.navigate("AllCategories");
  };

  if (loading) {
    // Skeleton Loader - Version corrigée
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
            <View key={index} style={styles.skeletonItem}>
              <SkeletonPlaceholder
                borderRadius={Spacing.MD}
                backgroundColor={Colors.LIGHT_GRAY_BG}
                highlightColor={Colors.WHITE}
              >
                <View style={styles.skeletonCard} />
              </SkeletonPlaceholder>
            </View>
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
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={handleSeeAllPress}
          accessibilityLabel="Voir toutes les catégories"
          accessibilityRole="button"
        >
          <Text style={styles.seeAllText}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        accessibilityLabel="Liste des catégories"
      >
        {categories.map((item) => (
          <CategoryCard 
            key={item.id}
            category={item} 
            onPress={() => handleCategoryPress(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 20, // Override spécifique
  },
  seeAllText: {
    ...Typography.BODY,
    color: Colors.GREEN_BG,
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingLeft: Spacing.XS,
    paddingRight: Spacing.XS,
  },
  skeletonItem: {
    marginRight: Spacing.MD,
  },
  skeletonCard: {
    width: 120,
    height: 120,
    borderRadius: Spacing.MD,
  },
});

export default CategoriesSection;