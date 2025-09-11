import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { CategoryCard as CategoryCardModel } from "../../../models/CategoryCard";
import CategoryCard from "../../../components/CategoryCard";
import { RootStackParamList } from "../../../types/navigation";
import { Colors, Spacing, Typography } from "../../../constants/DesignSystem";

interface CategoriesSectionProps {
  categories: CategoryCardModel[];
  loading?: boolean;
  onCategoryPress?: (category: CategoryCardModel) => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  loading = false,
  onCategoryPress,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const handleCategoryPress = (category: CategoryCardModel) => {
      onCategoryPress?.(category);
  };

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Catégories</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={index} style={styles.skeletonItem}>
              <SkeletonPlaceholder>
                <View style={styles.skeletonCard} />
              </SkeletonPlaceholder>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
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
    fontSize: 20,
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
