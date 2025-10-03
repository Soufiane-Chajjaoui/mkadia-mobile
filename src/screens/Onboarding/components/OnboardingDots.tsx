// src/components/Onboarding/PaginationDots.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "../../../constants/DesignSystem";

interface PaginationDotsProps {
  total: number;
  currentIndex: number;
}

const PaginationDots: React.FC<PaginationDotsProps> = ({ total, currentIndex }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, currentIndex === index && styles.activeDot]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.GREEN_SHADOW,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: Colors.GREEN_BG,
    width: 13,
  },
});

export default PaginationDots;
