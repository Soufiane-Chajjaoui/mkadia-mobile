// src/components/Onboarding/PaginationDots.tsx
import React from "react";
import { View, StyleSheet } from "react-native";

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
    backgroundColor: "#D0BFFF",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#6C5CE7",
    width: 16,
  },
});

export default PaginationDots;
