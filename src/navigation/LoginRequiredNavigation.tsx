import React from 'react';
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from './NavigationService';
import { getLoginRequiredConfig, LoginRequiredContext } from '../config/loginRequiredConfig';
import LoginRequiredScreen from '../screens/auth/LoginRequired/LoginRequiredScreen';

/**
 * 🚀 Fonction utilitaire pour naviguer vers l'écran LoginRequired avec un contexte spécifique
 * 
 * @param context - Le contexte qui détermine les icônes et messages à afficher
 * 
 * @example
 * // Dans useFavorites
 * navigateToLoginRequired('favorites');
 * 
 * // Dans useCart
 * navigateToLoginRequired('cart');
 */
export const navigateToLoginRequired = (context: LoginRequiredContext = 'default') => {
  const config = getLoginRequiredConfig(context);
  
  // Navigation vers l'écran LoginRequired avec les paramètres
  if (navigationRef.current?.isReady()) {
    navigationRef.current.dispatch(
      CommonActions.navigate({
        name: 'LoginRequired',
        params: {
          context,
          ...config,
        },
      })
    );
  }
};

/**
 * 🎨 Composant LoginRequired qui récupère les paramètres de navigation
 * et affiche l'écran avec la bonne configuration
 */
export const LoginRequiredScreenWithParams: React.FC<{ route?: any; navigation?: any }> = ({ 
  route, 
  navigation 
}) => {
  const context = route?.params?.context || 'default';
  const config = getLoginRequiredConfig(context);
  
  return (
    <LoginRequiredScreen
      {...config}
      navigation={navigation}
      onBackPress={() => navigation?.goBack()}
    />
  );
};

