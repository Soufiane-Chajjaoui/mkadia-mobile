import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = 'CART_ITEMS';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  isInitialized: false,
  error: null,
};

// Actions asynchrones
export const initializeCart = createAsyncThunk(
  'cart/initialize',
  async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      const items = cartData ? JSON.parse(cartData) : [];
      
      return { items };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du panier:', error);
      return { items: [] };
    }
  }
);

export const addItemAsync = createAsyncThunk(
  'cart/addItem',
  async (item: CartItem, { getState }) => {
    try {
      const state = getState() as { cart: CartState };
      const existingItemIndex = state.cart.items.findIndex(i => i.productId === item.productId);
      
      let updatedItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Si l'item existe déjà, augmenter la quantité
        updatedItems = state.cart.items.map((i, index) => 
          index === existingItemIndex 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        // Sinon, ajouter le nouvel item
        updatedItems = [...state.cart.items, item];
      }
      
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
      return { items: updatedItems };
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'item:', error);
      throw error;
    }
  }
);

export const deleteItemAsync = createAsyncThunk(
  'cart/deleteItem',
  async (id: number, { getState }) => {
    try {
      const state = getState() as { cart: CartState };
      const updatedItems = state.cart.items.filter(item => item.id !== id);
      
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
      return { items: updatedItems };
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'item:', error);
      throw error;
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async () => {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
      return { items: [] };
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      throw error;
    }
  }
);

// Action synchrone pour les cas d'urgence (sans sauvegarde)
export const setCartItems = createAsyncThunk(
  'cart/setItems',
  async (items: CartItem[]) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      return { items };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des items:', error);
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Actions synchrones (sans persistance - pour les cas d'urgence)
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Cart
      .addCase(initializeCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.isLoading = false;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(initializeCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.error.message || 'Erreur d\'initialisation';
      })
      
      // Add Item Async
      .addCase(addItemAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItemAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addItemAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur lors de l\'ajout';
      })
      
      // Delete Item Async
      .addCase(deleteItemAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteItemAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteItemAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur lors de la suppression';
      })
      
      // Clear Cart Async
      .addCase(clearCartAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCartAsync.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur lors de la suppression du panier';
      })
      
      // Set Cart Items Async
      .addCase(setCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setCartItems.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(setCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Erreur lors de la sauvegarde';
      });
  },
});

export const { setError, clearError } = cartSlice.actions;

// Sélecteurs utiles
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartIsLoading = (state: { cart: CartState }) => state.cart.isLoading;
export const selectCartIsInitialized = (state: { cart: CartState }) => state.cart.isInitialized;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectCartItemCount = (state: { cart: CartState }) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;