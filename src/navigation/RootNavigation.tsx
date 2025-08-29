// src/navigation/RootNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import HomeScreen from "../screens/Home/HomeScreen";
import useFirstLaunch from "../hooks/useFirstLaunch";

const Stack = createNativeStackNavigator();

const Loader = () => (
  <SafeAreaWrapper>
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#6C5CE7" />
    </View>
  </SafeAreaWrapper>
);

export default function RootNavigator() {
  const { isFirstLaunch, loading } = useFirstLaunch();

  if (loading) return <Loader />;

  return (
    <Stack.Navigator
      initialRouteName={isFirstLaunch ? "Onboarding" : "Home"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Onboarding"
        children={() => (
          <SafeAreaWrapper>
            {require("../screens/Onboarding/OnboardingScreen").default()}
          </SafeAreaWrapper>
        )}
      />
      <Stack.Screen
        name="Home"
        children={() => (
          <SafeAreaWrapper>
            <HomeScreen />
          </SafeAreaWrapper>
        )}
      />
    </Stack.Navigator>
  );
}
