import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

interface Props {
  name: string;
  icon: string;
}

const screenWidth = Dimensions.get("window").width;

export default function CategoryCard({ name, icon }: Props) {
  // Largeur dynamique : prend ~1/4 de l’écran moins le margin
  const cardWidth = (screenWidth - 60) / 3; // 15 px padding gauche + droite + 10 px margin entre cartes

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <Text style={{ fontSize: 28 }}>{icon}</Text>
      <Text style={{ marginTop: 5, textAlign: "center" }}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#F1F8E9",
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
});
