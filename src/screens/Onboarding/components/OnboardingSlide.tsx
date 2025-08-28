// src/components/Onboarding/OnboardingSlide.tsx
import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, ImageSourcePropType } from "react-native";

const { width, height } = Dimensions.get("window");

interface SlideProps {
  title: string;
  description: string;
  image: ImageSourcePropType;
}

const OnboardingSlide: React.FC<SlideProps> = ({ title, description, image }) => {
  return (
    <View style={[styles.slide, { width }]}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  imageContainer: {
  width: width * 0.85,
  height: height * 0.35,
  borderRadius: 25,
  overflow: "hidden",
  marginVertical: 30,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 26,
    fontFamily: "Raleway-Bold",
    color: "#4E2A84",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    color: "#5D3B8D",
    paddingHorizontal: 20,
  },
});

export default OnboardingSlide;
