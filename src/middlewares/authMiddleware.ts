import { Middleware } from "@reduxjs/toolkit";
import { refreshTokenAsync, logoutAsync } from "../features/auth/authSlice";
import { addItemAsync } from "../features/cart/cartSlice";
import { jwtDecode } from "jwt-decode";
import { navigate, resetToLogin } from "../navigation/NavigationService";
import { RootState, AppDispatch } from "../features/store";

interface JwtPayload {
  exp: number;
  iat?: number;
  sub?: string;
}

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const marginTime = 5 * 60 * 1000; // 5 minutes en ms
    
    return currentTime >= (expirationTime - marginTime);
  } catch {
    return true;
  }
};

const PROTECTED_ACTION_PREFIXES = ['cart/addItem'];


// Variable pour éviter les appels multiples
let isRefreshing = false;

export const authMiddleware: Middleware = (store) => (next) => async (action: any) => {
  const state = store.getState() as RootState;
  const { accessToken, refreshToken, isAuthenticated } = state.auth;
  const dispatch = store.dispatch as AppDispatch;

  // Vérifier les actions protégées
  if (action.type && PROTECTED_ACTION_PREFIXES.includes(action.type)) {
    console.log(`🔐 Action protégée: ${action.type}`);

    // Utilisateur non connecté
    if (!isAuthenticated) {
      console.warn("⛔ Utilisateur non connecté");
      navigate("LoginRequired");
      return; // Bloquer l'action
    }

    // Token expiré
    if (isTokenExpired(accessToken)) {
      console.log("⚠️ Access Token expiré");
      
      // Refresh token aussi expiré
      if (!refreshToken || isTokenExpired(refreshToken)) {
        console.warn("❌ Refresh Token expiré → déconnexion");
        await dispatch(logoutAsync());
        resetToLogin();
        return; // Bloquer l'action
      }

      // Refresh le token
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
            console.log("✅ Token rafraîchi");
          } else {
            throw new Error("Erreur refresh");
          }
        } catch (error) {
          console.error("❌ Erreur refresh:", error);
          await dispatch(logoutAsync());
          resetToLogin();
          return; // Bloquer l'action
        } finally {
          isRefreshing = false;
        }
      }
    }
  }

  return next(action);
};