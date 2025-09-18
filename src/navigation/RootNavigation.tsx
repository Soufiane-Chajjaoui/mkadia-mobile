// src/navigation/RootNavigator.tsx
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import HomeScreen from "../screens/Home/HomeScreen";
import useFirstLaunch from "../hooks/useFirstLaunch";
import OnboardingScreen from "../screens/Onboarding/OnboardingScreen";
import CategoryProductsScreen from "../screens/CategoryProducts/CategoryProductsScreen";
import ProductDetailsScreen from "../screens/ProductDetails/ProductDetailsScreen";
import LoginScreen from "../screens/auth/Login/LoginScreen";
import SignupScreen from "../screens/auth/SignUp/SignUpScreen";
import ResetPasswordScreen from "../screens/auth/ForgetPassword/ResetPasswordScreen";
import { LinkingOptions } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import ChangePasswordScreen from "../screens/auth/ChangePaasword/ChangePasswordScreen";

const Stack = createNativeStackNavigator();
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['mkadia://', 'https://mkadia.com'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      Home: 'home',
      Login: 'login',
      SignUp: 'signup',
      // ✅ CORRIGÉ : Configuration pour ResetPassword
      ResetPassword:'reset-password',
      ChangePassword: {
        path: 'change-password',
        parse: {
          email: (email: string) => {
            console.log("🔗 Email parsé par React Navigation:", email);
            return email;
          },
          token: (token: string) => {
            console.log("🔗 Token parsé par React Navigation:", token);
            return token;
          },
        },
      },
      CategoryProducts: 'category/:id',
      ProductDetails: 'product/:id',
    },
  },
};

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
        component={withSafeArea(OnboardingScreen)}
      />
      
      <Stack.Screen
        name="ResetPassword"
        component={withSafeArea(ResetPasswordScreen)}
      />

      <Stack.Screen
        name="ChangePassword"
        component={withSafeArea(ChangePasswordScreen)}
      />
      <Stack.Screen
        name="Home"
        component={withSafeArea(HomeScreen)}
      />
      <Stack.Screen
        name="Login"
        component={withSafeArea(LoginScreen)}
      />
      <Stack.Screen
        name="SignUp"
        component={withSafeArea(SignupScreen)}
      />
      <Stack.Screen
        name="CategoryProducts"
        component={withSafeArea(CategoryProductsScreen)}
      />
      <Stack.Screen
        name="ProductDetails"
        component={withSafeArea(ProductDetailsScreen)}
      />
    </Stack.Navigator>
  );
}

const withSafeArea = (ScreenComponent: React.ComponentType<any>) => {
  return (props: any) => (
    <SafeAreaWrapper>
      <ScreenComponent {...props} />
    </SafeAreaWrapper>
  );
};

