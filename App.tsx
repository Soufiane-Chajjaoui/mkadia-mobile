/**
 * MKADIA Mobile App - CORRIGÉ DEEP LINKING
 */

import { Linking, useColorScheme} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import React, { useEffect } from 'react';
import RootNavigator, { linking } from './src/navigation/RootNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { navigate, navigationRef } from './src/navigation/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenType } from './src/enums/TokenType';
import { useAppDispatch } from './src/hooks/useRedux';
import { initializeAuth } from './src/features/auth/authSlice';
import { initializeCart } from './src/features/cart/cartSlice';
import { store } from './src/features/store';

// Composant interne qui utilise les hooks Redux
const AppContent: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useAppDispatch(); // Maintenant à l'intérieur du Provider

  useEffect(() => {
    // Vérifie si l'app est ouverte avec un lien au démarrage
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("URL de démarrage détectée:", url);
        handleDeepLink(url);
      }
    });

    // Écoute si un lien arrive pendant que l'app est ouverte
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Deep link en cours d'exécution:", url);
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);
  
  const handleDeepLink = (url: string) => {
    console.log("🔗 Deeplink reçu:", url);
    
    // Attendre que la navigation soit prête
    setTimeout(async () => {
      try {
        // Pattern simplifié et plus robuste
        if (url.includes('change-password')) {
          // Extraire le token de différentes façons
          let token = null;
          let email = null;
          
          // Cas 1: mkadia://change-password/TOKEN123
          const pathMatch = url.match(/change-password\/([^?&]+)/);
          if (pathMatch) {
            token = pathMatch[1];
          }
          
          // Cas 2: mkadia://change-password?token=TOKEN123
          const queryMatch = url.match(/[?&]token=([^&]+)/);
          if (queryMatch) {
            token = queryMatch[1];
          }
          
          // Extraire l'email depuis les paramètres de requête
          const emailMatch = url.match(/[?&]email=([^&]+)/);
          if (emailMatch) {
            email = decodeURIComponent(emailMatch[1]);
          }
          
          if (token) {
            console.log("✅ Token trouvé:", token);
            console.log("📧 Email trouvé:", email || "Non fourni");
            
            try {
              // ✅ CORRECT: Store the token
              await AsyncStorage.setItem(TokenType.RESET_TOKEN, token);
              console.log("💾 Token stocké avec succès");
              
              // ✅ CORRECT: Retrieve and verify the token was stored
              const storedToken = await AsyncStorage.getItem(TokenType.RESET_TOKEN);
              console.log(`📋 Token vérifié dans AsyncStorage: ${storedToken}`);
              
              if (storedToken === token) {
                console.log("✅ Vérification du token réussie");
              } else {
                console.error("❌ Erreur: le token stocké ne correspond pas");
              }
              
            } catch (storageError) {
              console.error("🚨 Erreur lors du stockage du token:", storageError);
              // Continue navigation even if storage fails
            }
            
            // Navigate with token and email
            navigate("ChangePassword", {
              token, 
              email: email || null 
            });
            return;
          }
        }
        
        console.log("❌ Aucun pattern valide trouvé dans:", url);
      } catch (error) {
        console.error("❌ Erreur lors du traitement du deep link:", error);
      }
    }, 100); // Petit délai pour s'assurer que la navigation est prête
  };

  useEffect(() => {
    const init = async () => {
      dispatch(initializeAuth());
      dispatch(initializeCart());

      await BootSplash.hide({ fade: true });
    };

    init();
  }, [dispatch]);

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <RootNavigator />
    </NavigationContainer>
  );
};

// Composant App principal
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;