// src/hoc/withRoleGate.tsx
import React from "react";
import useAuth from "../hooks/useAuth";
import SafeAreaWrapper from "../components/SafeAreaWrapper";
import LoginRequiredScreen, { LoginRequiredScreenProps } from "../screens/auth/LoginRequired/LoginRequiredScreen";
import { User, Shield, ArrowRight, ShoppingCart } from "lucide-react-native";
import { Colors } from "../constants/DesignSystem";
import { View, StyleSheet } from "react-native";

export function withRoleGate<P extends { navigation?: any }>(
  ScreenComponent: React.ComponentType<P>,
  allowedRoles: string[],
  loginScreenProps?: Partial<LoginRequiredScreenProps>
): React.FC<P> {
  return function RoleGateWrapper(props: P) {
    const { isAuthenticated, roles } = useAuth();
    const { navigation } = props;

    const userRoles = roles || [];
    const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

    // Cas où l'utilisateur n'est pas authentifié
    if (!isAuthenticated) {
      return (
        <View style={styles.fullScreenContainer}>
          <SafeAreaWrapper>
            <LoginRequiredScreen
              title={loginScreenProps?.title ?? "Connexion requise"}
              subtitle={
                loginScreenProps?.subtitle ??
                "Vous devez être connecté pour accéder à cette page"
              }
              showGuestOption={loginScreenProps?.showGuestOption ?? true}
              showBackButton={loginScreenProps?.showBackButton ?? true}
              icons={loginScreenProps?.icons}
              onBackPress={() => navigation?.goBack()}
            />
          </SafeAreaWrapper>
        </View>
      );
    }

    // Cas où l'utilisateur est authentifié mais n'a pas le rôle requis
    if (!hasAccess) {
      return (
        <View style={styles.fullScreenContainer}>
          <SafeAreaWrapper>
            <LoginRequiredScreen
              title="Accès refusé"
              navigation={navigation}
              subtitle="Votre rôle ne permet pas d'accéder à cette page"
              icons={{
                primary: <User size={60} color={Colors.RED} />,
                secondary: <Shield size={40} color={Colors.RED} />,
                benefits: [
                  { icon: <ArrowRight size={24} color={Colors.GREEN_TEXT} />, text: "Navigation fluide" },
                  { icon: <ShoppingCart size={24} color={Colors.GREEN_TEXT} />, text: "Panier sauvegardé" },
                ],
              }}
            />
          </SafeAreaWrapper>
        </View>
      );
    }

    // Si l'utilisateur est authentifié et a le rôle requis
    return (
      <SafeAreaWrapper>
        <ScreenComponent {...props}/>
      </SafeAreaWrapper>
    );
  };
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: Colors.WHITE,
  },
});
