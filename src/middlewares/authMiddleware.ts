import { Middleware } from "@reduxjs/toolkit";
import { refreshTokenAsync, logoutAsync } from "../features/auth/authSlice";
import { addItemAsync } from "../features/cart/cartSlice";
import { navigate, resetToLogin } from "../navigation/NavigationService";
import { RootState, AppDispatch } from "../features/store";
import { JwtService } from "../services/JwtService";

const isTokenExpired = (token: string | null): boolean => {
  return JwtService.isExpiringSoon(token);
};

const PROTECTED_ACTION_PREFIXES = [
  'cart/addItem',
  'favorites/add',
  'favorites/remove',
  'favorites/load'
];

const PROTECTED_NAVIGATION_ROUTES = [
  'FavoritesTab',
  'Favorites'
];

// Variable pour éviter les appels multiples
let isRefreshing = false;

export const authMiddleware: Middleware = (store) => (next) => async (action: any) => {
  const state = store.getState() as RootState;
  const { accessToken, refreshToken, isAuthenticated } = state.auth;
  const dispatch = store.dispatch as AppDispatch;

  // Vérifier les actions protégées (Redux actions)
  if (action.type && PROTECTED_ACTION_PREFIXES.some(prefix => action.type.startsWith(prefix))) {
    console.log(`🔐 Action protégée: ${action.type}`);

    if (!isAuthenticated) {
      console.warn("⛔ Utilisateur non connecté pour action:", action.type);
      navigate("LoginRequired");
      return;
    }

    // Gestion du token expiré (code existant)...
    if (isTokenExpired(accessToken)) {
      // ... code de refresh existant
    }
  }

  // Vérifier les navigations protégées
  if (action.type === 'NAVIGATE' && action.payload) {
    const routeName = action.payload.name || action.payload.screen;
    
    if (PROTECTED_NAVIGATION_ROUTES.includes(routeName)) {
      console.log(`🔐 Navigation protégée: ${routeName}`);

      if (!isAuthenticated) {
        console.warn("⛔ Utilisateur non connecté pour navigation:", routeName);
        navigate("LoginRequired");
        return;
      }

      // Gestion du token expiré pour navigation
      if (isTokenExpired(accessToken)) {
        if (!refreshToken || isTokenExpired(refreshToken)) {
          console.warn("❌ Refresh Token expiré → déconnexion");
          await dispatch(logoutAsync());
          resetToLogin();
          return;
        }

        // Refresh le token avant de continuer la navigation
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const response = await fetch("https://api.monsite.com/auth/refresh", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken }),
            });
            
            if (response.ok) {
              const data = await response.json();
              await dispatch(refreshTokenAsync(data.accessToken));
              console.log("✅ Token rafraîchi pour navigation");
            } else {
              throw new Error("Erreur refresh");
            }
          } catch (error) {
            console.error("❌ Erreur refresh:", error);
            await dispatch(logoutAsync());
            resetToLogin();
            return;
          } finally {
            isRefreshing = false;
          }
        }
      }
    }
  }

  return next(action);
};
