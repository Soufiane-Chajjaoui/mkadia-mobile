import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenType } from "../../enums/TokenType";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
};

// Actions asynchrones
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(TokenType.ACCESS_TOKEN),
        AsyncStorage.getItem(TokenType.REFRESH_TOKEN),
      ]);

      return {
        accessToken,
        refreshToken,
        isAuthenticated: !!(accessToken && refreshToken),
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', error);
      return {
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      };
    }
  }
);

export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(TokenType.ACCESS_TOKEN, accessToken),
        AsyncStorage.setItem(TokenType.REFRESH_TOKEN, refreshToken),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tokens:', error);
      throw error;
    }
  }
);

export const refreshTokenAsync = createAsyncThunk(
  'auth/refreshToken',
  async (newAccessToken: string) => {
    try {
      await AsyncStorage.setItem(TokenType.ACCESS_TOKEN, newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du nouveau token:', error);
      throw error;
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TokenType.ACCESS_TOKEN),
        AsyncStorage.removeItem(TokenType.REFRESH_TOKEN),
      ]);
    } catch (error) {
      console.error('Erreur lors de la suppression des tokens:', error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Initialize Auth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.isLoading = false;
        state.isInitialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
      })
      
      // Login Async
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(loginAsync.rejected, (state) => {
        state.isLoading = false;
      })
      
      // Refresh Token Async
      .addCase(refreshTokenAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        state.isLoading = false;
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.isLoading = false;
      })
      
      // Logout Async
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export default authSlice.reducer;
