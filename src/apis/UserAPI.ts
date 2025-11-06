import { from, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../config/environment';
import { configuredAxios as axios } from '../intercepteurs/main-interceptor';
import { User } from '../models/User';

/**
 * Récupérer les informations de l'utilisateur connecté
 * GET /user/current
 */
export const getCurrentUser$ = (): Observable<User> => {
  return from(
    axios.get(`${environment.apiBaseUrl}/users/profile`)
  ).pipe(
    map((response) => response.data.object),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur lors du chargement des informations utilisateur");
    })
  );
};
