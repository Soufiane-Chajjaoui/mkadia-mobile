import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../features/store';
import { refreshTokenAsync, logoutAsync } from '../features/auth/authSlice';
import { resetToLogin } from '../navigation/NavigationService';
import { TokenType } from '../enums/TokenType';
import { environment } from '../config/environment';
import { showGlobalError } from '../context/ToastContext';
import { getErrorMessage } from '../utils/errorMessages';

const PUBLIC_URLS = ['login', 'register', 'forgot-password', 'verify-email', 'public', 'resend-verification'];
const RESET_URLS = ['change-reset-password'];
const REFRESH_URLS = ['refresh-token'];
const ENCODED_URLS = ['change-reset-password', 'forgot-password'];

// URLs publiques avec méthode spécifique (GET uniquement)
const PUBLIC_GET_URLS = ['/reviews'];

interface ErrorResponse {
  message?: string;
  code?: string;
}

// 🛠️ Récupération des tokens
const getToken = (type: TokenType) => AsyncStorage.getItem(type);

// 📝 Encoder un objet en x-www-form-urlencoded
const toFormUrlEncoded = (body: any): string =>
  Object.keys(body)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`)
    .join('&');

// 🌐 Déterminer le type d'URL
const isPublicUrl = (url: string) => PUBLIC_URLS.some(u => url.includes(u));
const isPublicGetUrl = (url: string, method?: string) =>
  method?.toUpperCase() === 'GET' && PUBLIC_GET_URLS.some(u => url.includes(u));
const isResetUrl = (url: string) => RESET_URLS.some(u => url.includes(u));
const isRefreshUrl = (url: string) => REFRESH_URLS.some(u => url.includes(u));
const isEncodedUrl = (url: string) => ENCODED_URLS.some(u => url.includes(u));

// 📌 Intercepteur des requêtes
axios.interceptors.request.use(async (config: InternalAxiosRequestConfig & { __skipInterceptor?: boolean }) => {
  if (config.__skipInterceptor) return config;

  const url = config.url || '';
  const method = config.method || '';
  config.headers.set('Accept', 'application/json');

  // Vérifier si c'est une URL publique standard
  if (isPublicUrl(url)) return config;

  // Vérifier si c'est une URL publique GET (comme /api/v1/reviews en GET)
  if (isPublicGetUrl(url, method)) return config;

  // Reset token
  if (isResetUrl(url)) {
    const token = await getToken(TokenType.RESET_TOKEN);
    if (token) {
      config.headers.set('Token-Type', 'RESET');
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  // Refresh token
  if (isRefreshUrl(url)) {
    const token = await getToken(TokenType.REFRESH_TOKEN);
    if (token) {
      config.headers.set('Token-Type', 'REFRESH');
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }

  // Encoded body
  if (isEncodedUrl(url)) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.data = toFormUrlEncoded(config.data);
  } else {
    config.headers.set('Content-Type', 'application/json');
  }

  // Access token
  const accessToken = await getToken(TokenType.ACCESS_TOKEN);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const message = error.response?.data?.message || '';
    const url = originalRequest?.url || '';
    const method = originalRequest?.method || '';

    // ✅ Si c'est une URL publique (login, register, etc.)
    if (isPublicUrl(url)) {
      if (status) {
        const errorMessage = getErrorMessage(url, status, message);
        showGlobalError(errorMessage);
      }
      return Promise.reject(error);
    }

    // ✅ Si c'est une URL publique GET (comme /api/v1/reviews en GET)
    if (isPublicGetUrl(url, method)) {
      if (status) {
        const errorMessage = getErrorMessage(url, status, message);
        showGlobalError(errorMessage);
      }
      return Promise.reject(error);
    }

    // 🎯 Cas 401 ou 301 pour les URLs protégées
    if (status === 301 || status === 401) {
      const requiresRefresh = status === 301 || message.toLowerCase().includes('expired') || message.toLowerCase().includes('refresh');
      
      // 🔄 Tentative de refresh token
      if (requiresRefresh && !originalRequest._retry && !isRefreshUrl(url)) {
        originalRequest._retry = true;

        try {
          const refreshToken = await getToken(TokenType.REFRESH_TOKEN);
          if (!refreshToken) {
            throw new Error('Aucun refresh token disponible');
          }

          const { data } = await axios.post('/auth/refresh-token', {}, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              'Token-Type': 'REFRESH'
            },
            __skipInterceptor: true
          } as any);

          await AsyncStorage.setItem(TokenType.ACCESS_TOKEN, data.accessToken);
          if (data.refreshToken) {
            await AsyncStorage.setItem(TokenType.REFRESH_TOKEN, data.refreshToken);
          }

          store.dispatch(refreshTokenAsync(data.accessToken));
          originalRequest.headers!.Authorization = `Bearer ${data.accessToken}`;
          return axios(originalRequest);
          
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError);
          showGlobalError('Session expirée. Veuillez vous reconnecter.');
          store.dispatch(logoutAsync());
          resetToLogin();
          return Promise.reject(error);
        }
      }

      // ❌ 401 non-récupérable
      if (status === 401 && !requiresRefresh) {
        showGlobalError('Session expirée. Veuillez vous reconnecter.');
        store.dispatch(logoutAsync());
        resetToLogin();
      }
    }

    // ✅ Autres erreurs sur URLs protégées
    if (status && status >= 400) {
      const errorMessage = getErrorMessage(url, status, message);
      showGlobalError(errorMessage);
    }

    return Promise.reject(error);
  }
);

// 🌍 Config globale
axios.defaults.baseURL = environment.apiBaseUrl;
axios.defaults.timeout = 10000;

export { axios as configuredAxios };