import React, { useState, useRef } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent 
} from 'react-native';
import { Spacing, BorderRadius, Elevation, Typography, Colors } from '../../../constants/DesignSystem';


interface Offer {
  id: string;
  img: string;
  title: string;
  subtitle: string;
}

interface OffersSliderProps {
  offers: Offer[];
  onOfferPress?: (offer: Offer) => void;
}

const OffersSlider: React.FC<OffersSliderProps> = ({ offers, onOfferPress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleOfferPress = (offer: Offer) => {
    onOfferPress?.(offer);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / 288); // 280 + 8 margin
    setCurrentIndex(newIndex);
  };

  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * 288,
        animated: true,
      });
    }
  };

  if (offers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucune offre disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={styles.offersContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        accessibilityLabel="Offres promotionnelles"
      >
        {offers.map((item) => (
          <TouchableOpacity 
            key={`offre-${item.id}`} 
            style={styles.offerCard} 
            activeOpacity={0.9}
            onPress={() => handleOfferPress(item)}
            accessibilityLabel={`Offre: ${item.title} - ${item.subtitle}`}
            accessibilityRole="button"
          >
            <Image 
              source={{ uri: item.img }} 
              style={styles.offerImage}
              accessibilityLabel={`Image de l'offre ${item.title}`}
            />
            <View style={styles.offerOverlay}>
              <Text style={styles.offerTitle}>{item.title}</Text>
              <Text style={styles.offerSubtitle}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Indicateur de pagination */}
      {offers.length > 1 && (
        <View style={styles.pagination}>
          {offers.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive
              ]}
              onPress={() => scrollToIndex(index)}
              accessibilityLabel={`Aller à l'offre ${index + 1}`}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.MD,
  },
  
  offersContent: {
    paddingRight: Spacing.LG,
  },
  
  offerCard: {
    width: 280,
    marginRight: Spacing.SM,
    borderRadius: BorderRadius.LG,
    overflow: "hidden",
    ...Elevation.MEDIUM,
  },
  
  offerImage: { 
    width: '100%', 
    height: 140,
    resizeMode: 'cover',
  },
  
  offerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: Spacing.MD,
  },
  
  offerTitle: {
    ...Typography.SUBHEAD,
    color: Colors.WHITE_TEXT,
    fontWeight: "700",
    marginBottom: Spacing.XXS,
  },
  
  offerSubtitle: {
    ...Typography.CAPTION,
    color: Colors.WHITE_TEXT,
    opacity: 0.9,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.MD,
    paddingHorizontal: Spacing.MD,
  },

  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.CIRCULAR,
    backgroundColor: Colors.GRAY_TEXT,
    marginHorizontal: Spacing.XS,
    opacity: 0.4,
  },

  paginationDotActive: {
    width: 8,
    height: 8,
    backgroundColor: Colors.GREEN_BG,
    opacity: 1,
  },

  emptyContainer: {
    padding: Spacing.XL,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.LIGHT_GRAY_BG,
    borderRadius: BorderRadius.MD,
    marginHorizontal: Spacing.XS,
    height: 140,
  },

  emptyText: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    textAlign: "center",
  },
});

export default OffersSlider;