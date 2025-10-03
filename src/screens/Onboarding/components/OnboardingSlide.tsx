// src/components/Onboarding/OnboardingSlide.tsx
import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, ImageSourcePropType } from "react-native";
import { Typography, Colors, Spacing } from "../../../constants/DesignSystem";

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
    ...Typography.HEADLINE,
    color: Colors.DARK_BLUE_TEXT,
    marginBottom: Spacing.SM,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
  },
  description: {
    ...Typography.BODY,
    color: Colors.GRAY_TEXT,
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 15,
    paddingHorizontal: Spacing.SM,
  },
});

export default OnboardingSlide;
