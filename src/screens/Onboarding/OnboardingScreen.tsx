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
import { Colors, Elevation, Typography } from "../../constants/DesignSystem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from '@react-navigation/native';

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

  const completeOnboarding = async () => {
    try {
      // Marquer l'onboarding comme terminé
      await AsyncStorage.setItem("alreadyLaunched", "true");
      
      // Reset la stack de navigation et naviguer vers Home
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
      );
    } catch (error) {
      console.error("Erreur lors de la finalisation de l'onboarding:", error);
      // Fallback en cas d'erreur
      navigation.replace('Home');
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
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
        keyExtractor={(item) => item.id}
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
  },
  skipButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  skipText: {
    fontSize: 20,
    fontWeight: "600",
    textDecorationLine: 'underline',
    color: Colors.GREEN_TEXT
  },
  button: {
    backgroundColor: Colors.GREEN_BG,
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 40,
    marginBottom: 40,
    ...Elevation.LOW,
  },
  buttonText: {
    ...Typography.SUBHEAD,
    color: Colors.WHITE_TEXT,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default OnboardingScreen;