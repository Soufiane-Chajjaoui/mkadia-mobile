import React from 'react';
import { Heart, ShoppingCart, Star, User, Lock } from 'lucide-react-native';
import { Colors } from '../constants/DesignSystem';
import { LoginRequiredScreenProps } from '../screens/auth/LoginRequired/LoginRequiredScreen';

/**
 * 🎨 Configuration centralisée pour les écrans LoginRequired
 * Utilisé par BottomTabNavigator et les hooks/composants qui redirigent vers la connexion
 */

export type LoginRequiredContext = 
  | 'favorites' 
  | 'profile' 
  | 'cart' 
  | 'default';

export const getLoginRequiredConfig = (
  context: LoginRequiredContext
): Partial<LoginRequiredScreenProps> => {
  switch (context) {
    case 'favorites':
      return {
        title: "Connexion requise",
        subtitle: "Connectez-vous pour accéder à vos favoris et retrouver vos produits préférés",
        showGuestOption: true,
        showBackButton: false,
        icons: {
          primary: <Heart size={60} color={Colors.RED_ICON} />,
          secondary: <Star size={40} color={Colors.ORANGE_ICON} />,
          benefits: [
            { 
              icon: <Heart size={24} color={Colors.GREEN_TEXT} />, 
              text: "Sauvegardez vos produits favoris" 
            },
            { 
              icon: <ShoppingCart size={24} color={Colors.GREEN_TEXT} />, 
              text: "Accès rapide à vos préférences" 
            },
          ],
        },
      };

    case 'profile':
      return {
        title: "Connexion requise",
        subtitle: "Connectez-vous pour accéder à votre profil et gérer vos informations",
        showGuestOption: true,
        showBackButton: false,
        icons: {
          primary: <User size={60} color={Colors.GREEN_BG} />,
          secondary: <Lock size={40} color={Colors.DARK_GREEN_BG} />,
          benefits: [
            { 
              icon: <User size={24} color={Colors.GREEN_TEXT} />, 
              text: "Gérez vos informations personnelles" 
            },
            { 
              icon: <ShoppingCart size={24} color={Colors.GREEN_TEXT} />, 
              text: "Suivez vos commandes" 
            },
          ],
        },
      };

    case 'cart':
      return {
        title: "Synchronisez votre panier",
        subtitle: "Connectez-vous pour profiter d'une expérience d'achat complète et sécurisée",
        showGuestOption: true,
        showBackButton: false,
        icons: {
          primary: <ShoppingCart size={60} color={Colors.GREEN_BG} />,
          secondary: <Star size={40} color={Colors.ORANGE_ICON} />,
          benefits: [
            {
              icon: <ShoppingCart size={24} color={Colors.GREEN_TEXT} />,
              text: "Synchronisez votre panier sur tous vos appareils"
            },
            {
              icon: <Heart size={24} color={Colors.GREEN_TEXT} />,
              text: "Gardez vos produits préférés en sécurité"
            },
            {
              icon: <Star size={24} color={Colors.GREEN_TEXT} />,
              text: "Profitez d'offres exclusives et de réductions"
            },
          ],
        },
      };

    default:
      return {
        title: "Connexion requise",
        subtitle: "Vous devez être connecté pour accéder à cette page",
        showGuestOption: true,
        showBackButton: true,
      };
  }
};

