import React from "react";
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { CategoryCard as CategoryCardModel } from "../models/CategoryCard";
import { replaceBaseUrl } from "../utils/urlHelper";

interface Props {
  category: CategoryCardModel;
}

const CategoryCard: React.FC<Props> = ({ category }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <ImageBackground
        source={{ uri: replaceBaseUrl(category.url) }}
        style={styles.image}
        imageStyle={styles.imageBorder}
      >
        {/* Overlay sombre */}
        <View style={styles.overlay} />

        {/* Texte par-dessus */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{category.name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 120,
    borderRadius: 15,
    overflow: "hidden",
    marginRight: 8,
    elevation: 1
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imageBorder: {
    borderRadius: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  textContainer: {
    padding: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default CategoryCard;
