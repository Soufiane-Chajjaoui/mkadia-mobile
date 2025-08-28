import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import useFirstLaunch from "../hooks/useFirstLaunch";
import HomeScreen from "../screens/Home/HomeScreen";

const Stack = createNativeStackNavigator();

const Loader = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color="#6C5CE7" />
  </View>
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
          getComponent={() =>
            require("../screens/Onboarding/OnboardingScreen").default
          }
        />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
  );
}
