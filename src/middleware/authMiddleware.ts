import { Middleware } from "@reduxjs/toolkit";
import { refreshAccessToken, logout } from "../features/auth/authSlice";
import { addItem } from "../features/cart/cartSlice";
import { jwtDecode } from "jwt-decode";
import { resetToLogin } from "../navigation/NavigationService";

interface JwtPayload {
  exp: number;
  iat?: number;
  sub?: string;
}

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};

export const authMiddleware: Middleware = (store) => (next) => async (action) => {
  const state = store.getState() as any;
  const { accessToken, refreshToken, isAuthenticated } = state.auth;

  if (addItem.match(action)) {
    if (!isAuthenticated) {
      console.warn("⛔ Utilisateur non connecté");
      resetToLogin();
      return;
    }
    
    if (isTokenExpired(accessToken)) {
      console.log("⚠️ Access Token expiré → tentative refresh...");
      
      if (!refreshToken || isTokenExpired(refreshToken)) {
        console.warn("❌ Refresh Token expiré → déconnexion");
        store.dispatch(logout());
        // ✅ Reset complet vers Login
        resetToLogin();
        return;
      }

      try {
        const response = await fetch("https://api.monsite.com/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        
        if (response.ok) {
          const data = await response.json();
          store.dispatch(refreshAccessToken(data.accessToken));
        } else {
          store.dispatch(logout());
          resetToLogin();
          return;
        }
      } catch (err) {
        console.error("❌ Erreur lors du refresh token", err);
        store.dispatch(logout());
        resetToLogin();
        return;
      }
    }
  }

  return next(action);
};