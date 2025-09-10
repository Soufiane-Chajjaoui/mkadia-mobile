import { Middleware } from "@reduxjs/toolkit";
import { refreshAccessToken, logout } from "../features/auth/authSlice";
import { addItem } from "../features/cart/cartSlice";
import {jwtDecode} from "jwt-decode"; // ✅ importer par défaut

interface JwtPayload {
  exp: number; // expiration en secondes
  iat?: number; // issued at
  sub?: string; // id user
}

// ✅ utilitaire avec jwt-decode
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true; // en cas de JWT corrompu
  }
};

export const authMiddleware: Middleware = (store) => (next) => async (action) => {
  const state = store.getState() as any; // 👈 si tu veux éviter `any`, utilise RootState
  const { accessToken, refreshToken, isAuthenticated } = state.auth;

  // 🎯 Intercepter une action sensible (ex: ajout panier)
  if (addItem.match(action)) {
    if (!isAuthenticated) {
      console.warn("⛔ Utilisateur non connecté");
      // ⚡ ici tu peux déclencher navigation → Login
      return;
    }

    // ⚡ Vérifier accessToken
    if (isTokenExpired(accessToken)) {
      console.log("⚠️ Access Token expiré → tentative refresh...");

      // ⚡ Vérifier refreshToken
      if (!refreshToken || isTokenExpired(refreshToken)) {
        console.warn("❌ Refresh Token expiré → déconnexion");
        store.dispatch(logout());
        return;
      }

      try {
        // ✅ appel API refresh
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
          return;
        }
      } catch (err) {
        console.error("❌ Erreur lors du refresh token", err);
        store.dispatch(logout());
        return;
      }
    }
  }

  return next(action);
};
