// src/screens/Onboarding/OnboardingScreen.tsx
import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import PaginationDots from "./components/OnboardingDots";
import OnboardingSlide from "./components/OnboardingSlide";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Bienvenue sur MKADIA",
    description: "Faites vos courses en quelques clics et soyez livré en moins de 10 minutes.",
    image: require("../../../assets/images/onboarding/slide1.png"),
  },
  {
    id: "2",
    title: "Produits Frais",
    description: "Découvrez une large gamme de produits frais et locaux.",
    image: require("../../../assets/images/onboarding/slide2.png"),
  },
  {
    id: "3",
    title: "Livraison Rapide",
    description: "Recevez vos articles à votre porte rapidement et facilement.",
    image: require("../../../assets/images/onboarding/slide3.png"),
  },
];

const OnboardingScreen = ({ navigation }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace("Home");
    }
  };

  const handleSkip = () => {
    navigation.replace("Home");
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Ignorer</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={slides}
        renderItem={({ item }) => <OnboardingSlide {...item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        onScroll={handleScroll}
      />

      <PaginationDots total={slides.length} currentIndex={currentIndex} />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? "Commencer" : "Suivant"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0ff",
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6C5CE7",
  },
  button: {
    backgroundColor: "#6C5CE7",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 40,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Raleway-Bold",
  },
});

export default OnboardingScreen;
