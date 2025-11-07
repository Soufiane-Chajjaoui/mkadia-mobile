import { from, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../config/environment';
import { configuredAxios as axios } from '../intercepteurs/main-interceptor';
import { User, UpdateUserRequest } from '../models/User';

/**
 * Récupérer les informations de l'utilisateur connecté
 * GET /user/current
 */
export const getCurrentUser$ = (): Observable<User> => {
  return from(
    axios.get(`${environment.apiBaseUrl}/user/profile`)
  ).pipe(
    map((response) => response.data.object),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur lors du chargement des informations utilisateur");
    })
  );
};

/**
 * Mettre à jour les informations de l'utilisateur connecté
 * PATCH /user/update
 */
export const updateUser$ = (payload: UpdateUserRequest): Observable<User> => {
  return from(
    axios.patch(`${environment.apiBaseUrl}/user/update-profile`, payload)
  ).pipe(
    map((response) => response.data.object),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur lors de la mise à jour des informations");
    })
  );
};

/**
 * Récupérer les commandes de l'utilisateur avec pagination
 * @param page - Numéro de page (0-indexed pour Spring Data JPA)
 * @param size - Nombre d'éléments par page
 */
export const getOrders$ = (page: number = 0, size: number = 10): Observable<any> => {
  return from(
    axios.get(`${environment.apiBaseUrl}/user/orders`, {
      params: { page, size }
    })
  ).pipe(
    map((response) => response.data),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur lors du chargement des commandes");
    })
  );
};

