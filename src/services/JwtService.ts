import { jwtDecode } from 'jwt-decode';

/**
 * 🔐 Interface pour le payload JWT
 */
export interface JwtPayload {
  sub: string; // Email de l'utilisateur
  firstName?: string;
  lastName?: string;
  userId?: number;
  id?: number;
  roles?: string[];
  exp?: number;
  iat?: number;
}

/**
 * 🔐 Service pour gérer le décodage et l'extraction d'informations du JWT
 */
export class JwtService {
  /**
   * Décoder un token JWT
   * @param token - Le token JWT à décoder
   * @returns Le payload décodé ou null si erreur
   */
  static decode(token: string | null): JwtPayload | null {
    if (!token) return null;
    
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Erreur lors du décodage du JWT:', error);
      return null;
    }
  }

  /**
   * Extraire l'ID utilisateur du token JWT
   * @param token - Le token JWT
   * @returns L'ID utilisateur ou null
   */
  static getUserId(token: string | null): number | null {
    const payload = this.decode(token);
    if (!payload) return null;

    // Essayer différents champs possibles pour l'ID utilisateur
    if (payload.id) return payload.id;
    return null;
  }

  /**
   * Extraire l'email de l'utilisateur du token JWT
   * @param token - Le token JWT
   * @returns L'email ou null
   */
  static getUserEmail(token: string | null): string | null {
    const payload = this.decode(token);
    return payload?.sub || null;
  }

  /**
   * Extraire le prénom de l'utilisateur du token JWT
   * @param token - Le token JWT
   * @returns Le prénom ou null
   */
  static getFirstName(token: string | null): string | null {
    const payload = this.decode(token);
    return payload?.firstName || null;
  }

  /**
   * Extraire le nom de famille de l'utilisateur du token JWT
   * @param token - Le token JWT
   * @returns Le nom de famille ou null
   */
  static getLastName(token: string | null): string | null {
    const payload = this.decode(token);
    return payload?.lastName || null;
  }

  /**
   * Extraire les rôles du token JWT
   * @param token - Le token JWT
   * @returns Les rôles ou un tableau vide
   */
  static getRoles(token: string | null): string[] {
    const payload = this.decode(token);
    return payload?.roles || [];
  }

  /**
   * Vérifier si le token est expiré
   * @param token - Le token JWT
   * @returns true si expiré, false sinon
   */
  static isExpired(token: string | null): boolean {
    const payload = this.decode(token);
    if (!payload?.exp) return true;

    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    return currentTime >= expirationTime;
  }

  /**
   * Vérifier si le token expire bientôt (dans les 5 minutes)
   * @param token - Le token JWT
   * @returns true si expire bientôt, false sinon
   */
  static isExpiringSoon(token: string | null): boolean {
    const payload = this.decode(token);
    if (!payload?.exp) return true;

    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const marginTime = 5 * 60 * 1000; // 5 minutes
    
    return currentTime >= (expirationTime - marginTime);
  }

  /**
   * Obtenir le temps restant avant expiration (en secondes)
   * @param token - Le token JWT
   * @returns Le temps restant en secondes ou 0 si expiré
   */
  static getTimeUntilExpiration(token: string | null): number {
    const payload = this.decode(token);
    if (!payload?.exp) return 0;

    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const timeRemaining = expirationTime - currentTime;
    
    return timeRemaining > 0 ? Math.floor(timeRemaining / 1000) : 0;
  }
}

