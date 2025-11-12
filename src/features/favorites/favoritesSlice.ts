// favoritesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Observable, firstValueFrom } from "rxjs";
import { getFavorites$, addToFavorites$, removeFromFavorites$ } from "../../apis/FavoriteAPI";

// 🔑 Clé de stockage local
const FAVORITES_STORAGE_KEY = "FAVORITE_ITEMS";

// 🌟 Interfaces
export interface FavoriteItem {
  id: number;
  productId: number;
}

interface FavoritesState {
  items: FavoriteItem[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

// 🌟 État initial
const initialState: FavoritesState = {
  items: [],
  isLoading: false,
  isInitialized: false,
  error: null,
};

// 🔹 Utilitaire : convertir Observable RxJS en Promise
const firstValueFromRx = <T>(obs: Observable<T>): Promise<T> => {
  return firstValueFrom(obs);
};

// 🧩 Initialiser favoris depuis backend ou fallback local
export const initializeFavorites = createAsyncThunk(
  "favorites/initialize",
  async (_, { rejectWithValue }) => {
    try {
      // 🔹 Charger depuis backend via RxJS
      const favoriteItems = await firstValueFromRx(getFavorites$());
      const items: FavoriteItem[] = favoriteItems.map((f: any) => ({
        id: f.id,
        productId: f.product.id,
      }));

      // 🔹 Sauvegarder localement
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
      return { items };
    } catch (error) {
      console.warn("⚠️ Backend inaccessible, fallback local");

      // 🔹 Charger depuis AsyncStorage si backend indisponible
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      const items = stored ? JSON.parse(stored) : [];
      return { items };
    }
  }
);

// ❤️ Ajouter ou retirer un favori
export const toggleFavoriteAsync = createAsyncThunk(
  "favorites/toggle",
  async (item: FavoriteItem, { getState }) => {
    const state = getState() as { favorites: FavoritesState };
    const existingFavorite = state.favorites.items.find(fav => fav.productId === item.productId);

    let updatedItems: FavoriteItem[] = [];

    try {
      if (existingFavorite) {
        // 🔹 Supprimer du backend via RxJS
        await firstValueFromRx(removeFromFavorites$(existingFavorite.id));
        updatedItems = state.favorites.items.filter(f => f.id !== existingFavorite.id);
      } else {
        // 🔹 Ajouter au backend via RxJS
        const response = await firstValueFromRx(addToFavorites$(item.productId));
        // Le backend retourne le nouvel objet favori avec son ID
        const newFavorite: FavoriteItem = {
          id: response.id || Date.now(), // Utiliser l'ID du backend
          productId: item.productId
        };
        updatedItems = [...state.favorites.items, newFavorite];
      }

      // 🔹 Sauvegarder localement
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedItems));

      return { items: updatedItems };
    } catch (error: any) {
      console.error("Erreur de synchronisation des favoris:", error.message || error);
      throw error;
    }
  }
);

// 🗑️ Tout vider (local + backend)
export const clearFavoritesAsync = createAsyncThunk(
  "favorites/clear",
  async () => {
    try {
      // Note: Vous devriez avoir une API pour supprimer tous les favoris
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
      return { items: [] };
    } catch (error: any) {
      console.error("Erreur de suppression globale des favoris:", error.message || error);
      throw error;
    }
  }
);

// 🔹 Slice
const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeFavorites.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.isInitialized = true;
        state.isLoading = false;
      })
      .addCase(initializeFavorites.rejected, (state, action) => {
        state.isInitialized = true;
        state.isLoading = false;
        state.error = action.error.message || "Erreur d'initialisation";
      })
      .addCase(toggleFavoriteAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.isLoading = false;
      })
      .addCase(toggleFavoriteAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Erreur lors du toggle";
      })
      .addCase(clearFavoritesAsync.fulfilled, (state) => {
        state.items = [];
        state.isLoading = false;
      });
  },
});

export const { setError, clearError } = favoritesSlice.actions;

// 🔹 Sélecteurs
export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.items;
export const selectFavoritesCount = (state: { favorites: FavoritesState }) => state.favorites.items.length;
export const selectFavoritesIsLoading = (state: { favorites: FavoritesState }) => state.favorites.isLoading;
export const selectIsFavorite = (productId: number) => (state: { favorites: FavoritesState }) => 
  state.favorites.items.some(item => item.productId === productId);

export default favoritesSlice.reducer;