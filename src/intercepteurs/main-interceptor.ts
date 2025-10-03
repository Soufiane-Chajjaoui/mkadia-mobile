import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenType } from '../enums/TokenType';
import { store } from '../features/store';
import { refreshTokenAsync, logoutAsync } from '../features/auth/authSlice';
import { resetToLogin } from '../navigation/NavigationService';
import { environment } from '../config/environment';

// Configuration des URLs spéciales
export const urlsHasResetToken = ['change-reset-password'];
export const urlPatternsEncodedBody = ['change-reset-password', 'forgot-password'];
export const urlHasRefresh = ['refresh-token'];

// URLs qui n'ont besoin d'aucun token
const PUBLIC_URLS = [
  'login',
  'register', 
  'forgot-password',
  'verify-email',
  'public',
  'resend-verification'
];

// Interface pour la réponse de refresh token
interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

interface ErrorResponse {
  message?: string;
  code?: string;
}

class ApiInterceptor {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: string) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  private isPublicUrl(url: string): boolean {
    return PUBLIC_URLS.some(publicUrl => url.includes(publicUrl));
  }

  private isResetTokenUrl(url: string): boolean {
    return urlsHasResetToken.some(resetUrl => url.includes(resetUrl));
  }

  private isRefreshTokenUrl(url: string): boolean {
    return urlHasRefresh.some(refreshUrl => url.includes(refreshUrl));
  }

  private isEncodedBodyUrl(url: string): boolean {
    return urlPatternsEncodedBody.some(encodedUrl => url.includes(encodedUrl));
  }

  private async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TokenType.ACCESS_TOKEN);
    } catch (error) {
      console.error('Erreur récupération access token:', error);
      return null;
    }
  }

  private async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TokenType.REFRESH_TOKEN);
    } catch (error) {
      console.error('Erreur récupération refresh token:', error);
      return null;
    }
  }

  private async getResetToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TokenType.RESET_TOKEN);
    } catch (error) {
      console.error('Erreur récupération reset token:', error);
      return null;
    }
  }

  private processFailedQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token!);
      }
    });

    this.failedQueue = [];
  }

  private setupRequestInterceptor() {
    axios.interceptors.request.use(
      async (config: InternalAxiosRequestConfig & { __skipInterceptor?: boolean }) => {
        // Skip interceptor pour certaines requêtes (comme le refresh)
        if (config.__skipInterceptor) {
          return config;
        }

        const url = config.url || '';

        console.log(`🌐 Requête: ${config.method?.toUpperCase()} ${url}`);

        // Headers par défaut
        config.headers.set("Content-Type", "application/json");
        config.headers.set("Accept", "application/json");

        // URLs publiques - pas de token nécessaire
        if (this.isPublicUrl(url)) {
          console.log('📂 URL publique - pas d\'authentification requise');
          return config;
        }

        // URLs avec reset token
        if (this.isResetTokenUrl(url)) {
          console.log('🔐 URL avec reset token');
          const resetToken = await this.getResetToken();
          
          if (resetToken) {
            config.headers.set("Token-Type", "RESET");
            config.headers.Authorization = `Bearer ${resetToken}`;
            console.log('✅ Reset token ajouté');
          } else {
            console.warn('⚠️ Reset token manquant pour URL protégée');
          }
          
          return config;
        }

        // URLs avec refresh token
        if (this.isRefreshTokenUrl(url)) {
          console.log('🔄 URL avec refresh token');
          const refreshToken = await this.getRefreshToken();
          
          if (refreshToken) {
            
            config.headers.set("Token-Type", "REFRESH");
            config.headers.Authorization = `Bearer ${refreshToken}`;
            
            console.log('✅ Refresh token ajouté');
          } else {
            console.warn('⚠️ Refresh token manquant');
          }
          
          return config;
        }

        // URLs avec encoded body
        if (this.isEncodedBodyUrl(url)) {

          console.log('📝 URL avec body encodé');
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          config.data = this.toFormUrlEncoded(config.data);
          if (url.includes("change-reset-password")) {
            return config;
          }
        }

        // Toutes les autres URLs - utiliser access token
        console.log('🔒 URL protégée - ajout access token');
        const accessToken = await this.getAccessToken();
        
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
          console.log('✅ Access token ajouté');
        } else {
          console.warn('⚠️ Access token manquant pour URL protégée');
          // Ne pas rejeter ici, laisser le serveur répondre avec 401
        }

        return config;
      },
      (error) => {
        console.error('❌ Erreur intercepteur request:', error);
        return Promise.reject(error);
      }
    );
  }

  private setupResponseInterceptor() {
    axios.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ Réponse: ${response.status} ${response.config.url}`);
        return response;
      },
      async (error: AxiosError<ErrorResponse>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const url = originalRequest?.url || '';

        console.error(`❌ Erreur: ${error.response?.status} ${url}`);

        // Erreur 401 - Token invalide/expiré OU 301 avec message de refresh
        if (error.response?.status === 401 || 
            (error.response?.status === 301 && 
             error.response?.data?.message?.includes("refresh token to reconstruct your"))) {
          console.log('🚨 Erreur 401/301 - Token invalide/expiré ou refresh requis');

          // Ne pas retry les URLs publiques ou de reset/refresh
          if (this.isPublicUrl(url) || this.isResetTokenUrl(url) || this.isRefreshTokenUrl(url)) {
            console.log('📂 URL publique/reset/refresh - pas de retry');
            return Promise.reject(this.createApiError(error));
          }

          // Éviter les boucles infinies
          if (originalRequest._retry) {
            console.log('🔄 Retry déjà tenté - arrêt');
            store.dispatch(logoutAsync());
            resetToLogin();
            return Promise.reject(this.createApiError(error));
          }

          originalRequest._retry = true;

          // Si un refresh est déjà en cours, ajouter à la queue
          if (this.isRefreshing) {
            console.log('⏳ Refresh en cours - ajout à la queue');
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers!.Authorization = `Bearer ${token}`;
              return axios(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          console.log('🔄 Tentative de refresh du token');
          this.isRefreshing = true;

          try {
            const refreshToken = await this.getRefreshToken();
            
            if (!refreshToken) {
              throw new Error('Refresh token manquant');
            }

            // Faire l'appel de refresh directement avec axios
            const refreshResponse = await axios.post('/auth/refresh-token', {}, {
              headers: {
                'Authorization': `Bearer ${refreshToken}`,
                'Token-Type': 'REFRESH',
                'Content-Type': 'application/json'
              },
              // Éviter que cette requête passe par l'intercepteur
              __skipInterceptor: true
            } as any);

            if (refreshResponse.data && refreshResponse.data.accessToken) {
              const newAccessToken = refreshResponse.data.accessToken;
              const newRefreshToken = refreshResponse.data.refreshToken; // Au cas où le refresh token change aussi
              
              // Sauvegarder les nouveaux tokens
              await AsyncStorage.setItem(TokenType.ACCESS_TOKEN, newAccessToken);
              if (newRefreshToken) {
                await AsyncStorage.setItem(TokenType.REFRESH_TOKEN, newRefreshToken);
              }
              
              // Optionnel: Mettre à jour le Redux store si nécessaire
              store.dispatch(refreshTokenAsync(newAccessToken));
              
              console.log('✅ Token refreshé avec succès');
              
              // Mettre à jour la requête originale
              originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`;
              
              // Traiter la queue
              this.processFailedQueue(null, newAccessToken);
              
              // Retry la requête originale
              return axios(originalRequest);
            } else {
              throw new Error('Réponse de refresh invalide');
            }
          } catch (refreshError) {
            console.error('❌ Échec du refresh token:', refreshError);
            
            // Traiter la queue avec l'erreur
            this.processFailedQueue(refreshError);
            
            // Déconnecter l'utilisateur
            store.dispatch(logoutAsync());
            resetToLogin();
            
            return Promise.reject(this.createApiError(error));
          } finally {
            this.isRefreshing = false;
          }
        }

        // Autres erreurs HTTP
        return Promise.reject(this.createApiError(error));
      }
    );
  }

    private createApiError(error: AxiosError<ErrorResponse>): ApiError {
    const status = error.response?.status || 0;
    const data = error.response?.data;

    const message = data?.message || error.message || "Une erreur est survenue";
    const code = data?.code || error.code;

    return { message, status, code };
    }

  // Méthode pour nettoyer les intercepteurs si nécessaire
  public cleanup() {
    axios.interceptors.request.clear();
    axios.interceptors.response.clear();
  }

  public toFormUrlEncoded(body: any): string {
  const formBody: string[] = [];
  for (const key in body) {
    if (body.hasOwnProperty(key)) {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(body[key]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
  }
  return formBody.join('&');
}
}

// Instance singleton
const apiInterceptor = new ApiInterceptor();

// Configuration Axios par défaut
axios.defaults.baseURL = environment.apiBaseUrl;
axios.defaults.timeout = 10000; // 10 secondes

export default apiInterceptor;
export { axios as configuredAxios };
export type { ApiError, RefreshTokenResponse };
