import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface Offer {
  id: string;
  img: string;
  title: string;
  subtitle: string;
}

interface OffersSliderProps {
  offers: Offer[];
}

const OffersSlider: React.FC<OffersSliderProps> = ({ offers }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      contentContainerStyle={styles.offersContent}
    >
      {offers.map((item) => (
        <TouchableOpacity key={item.id} style={styles.offerCard} activeOpacity={0.9}>
          <Image source={{ uri: item.img }} style={styles.offerImage} />
          <View style={styles.offerOverlay}>
            <Text style={styles.offerTitle}>{item.title}</Text>
            <Text style={styles.offerSubtitle}>{item.subtitle}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  offersContent: {
    paddingRight: 16,
  },
  
  offerCard: {
    marginRight: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  
  offerImage: { 
    width: 280, 
    height: 140, 
  },
  
  offerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
  },
  
  offerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  
  offerSubtitle: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
  },
});

export default OffersSlider;