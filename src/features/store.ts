import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import { authMiddleware } from "../middleware/authMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});

// ✅ définir les types APRÈS l'initialisation
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
