import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { Colors, IconSize, Spacing, Typography } from "../../../constants/DesignSystem";
import { CategoryCard } from "../../../models/CategoryCard";
import { replaceBaseUrl } from "../../../utils/urlHelper";


const { height: screenHeight } = Dimensions.get('window');

interface CategoryHeaderProps {
  category: CategoryCard;
  productsCount: number;
  loading: boolean;
  onBackPress: () => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ 
  category, 
  productsCount, 
  loading, 
  onBackPress 
}) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.GREEN_BG} />
      
      <ImageBackground 
        source={{ uri: replaceBaseUrl(category.url) }}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        
        <SafeAreaView style={styles.headerContent}>
          <TouchableOpacity 
            onPress={onBackPress}
            style={styles.backButton}
            accessibilityLabel="Retour"
          >
            <ArrowLeft size={IconSize.LG} color={Colors.WHITE_ICON} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.categoryName} numberOfLines={2}>
              {category.name}
            </Text>
            <Text style={styles.productCount}>
              {loading ? '...' : productsCount} produit{productsCount !== 1 ? 's' : ''}
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    height: screenHeight * 0.3,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${Colors.GREEN_BG}CC`,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.XXS,
    paddingBottom: Spacing.LG,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: Spacing.SM
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: Spacing.LG,
  },
  categoryName: {
    ...Typography.HEADLINE,
    fontSize: 28,
    color: Colors.WHITE_TEXT,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    marginBottom: Spacing.SM,
  },
  productCount: {
    ...Typography.BODY,
    color: Colors.TRANSPARENT_WHITE,
    textAlign: 'center',
  },
});

export default CategoryHeader;