import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Text,
} from "react-native";
import { Sparkles, Award } from "lucide-react-native";
import { replaceBaseUrl } from "../../../utils/urlHelper";
import { Colors, Spacing, BorderRadius, Typography } from "../../../constants/DesignSystem";


const { width: screenWidth } = Dimensions.get('window');

interface ProductImageGalleryProps {
  images: any[];
  selectedImageIndex: number;
  productName: string;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  onImageSelect: (index: number) => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  selectedImageIndex,
  productName,
  isNew,
  isFeatured,
  discount,
  onImageSelect
}) => {
  const renderImageThumbnail = ({ item, index }: { item: any, index: number }) => (
    <TouchableOpacity
      style={[
        styles.thumbnailContainer,
        selectedImageIndex === index && styles.thumbnailSelected
      ]}
      onPress={() => onImageSelect(index)}
    >
      <Image 
        source={{ uri: replaceBaseUrl(item.url) }} 
        style={styles.thumbnail}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.imageSection}>
      <View style={styles.mainImageContainer}>
        <Image 
          source={{ uri: replaceBaseUrl(images[selectedImageIndex]?.url) }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        
        {/* Badges */}
        <View style={styles.badgesContainer}>
          {isNew && (
            <View style={[styles.badge, styles.newBadge]}>
              <Sparkles size={12} color={Colors.WHITE_ICON} />
              <Text style={styles.badgeText}>Nouveau</Text>
            </View>
          )}
          
          {isFeatured && (
            <View style={[styles.badge, styles.featuredBadge]}>
              <Award size={12} color={Colors.WHITE_ICON} />
              <Text style={styles.badgeText}>Vedette</Text>
            </View>
          )}
          
          {discount && (
            <View style={[styles.badge, styles.discountBadge]}>
              <Text style={styles.discountBadgeText}>-{discount}%</Text>
            </View>
          )}
        </View>
      </View>

      {/* Thumbnails */}
      {images.length > 1 && (
        <FlatList
          data={images}
          renderItem={renderImageThumbnail}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailsList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageSection: {
    backgroundColor: Colors.LIGHT_GRAY_BG,
  },
  mainImageContainer: {
    position: 'relative',
    height: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: screenWidth,
    height: screenWidth,
  },
  badgesContainer: {
    position: 'absolute',
    top: Spacing.LG,
    left: Spacing.LG,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.XS,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.SM,
    paddingVertical: Spacing.XS,
    borderRadius: BorderRadius.SM,
    gap: Spacing.XXS,
  },
  newBadge: {
    backgroundColor: Colors.GREEN_BG,
  },
  featuredBadge: {
    backgroundColor: Colors.ORANGE_ICON,
  },
  discountBadge: {
    backgroundColor: Colors.RED_BG,
  },
  badgeText: {
    ...Typography.BADGE,
    color: Colors.WHITE_TEXT,
  },
  discountBadgeText: {
    ...Typography.BADGE,
    color: Colors.WHITE_TEXT,
    fontWeight: '700',
  },
  thumbnailsList: {
    paddingHorizontal: Spacing.LG,
    paddingVertical: Spacing.MD,
    gap: Spacing.SM,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.SM,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailSelected: {
    borderColor: Colors.GREEN_BG,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
});

export default ProductImageGallery;