import { from, Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { environment } from "../config/environment";
import { configuredAxios as axios } from "../intercepteurs/main-interceptor";
import { Favorite } from "../models/Favorite";

export const getFavorites$ = (): Observable<Favorite[]> => {
  return from(axios.get(`${environment.apiBaseUrl}/favorites`)).pipe(
    map((response) => response.data),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur lors du chargement des favoris");
    })
  );
};

export const addToFavorites$ = (productId: number): Observable<any> => {
  return from(
    axios.post(`${environment.apiBaseUrl}/favorites/${productId}`)
  ).pipe(
    map((response) => response.data),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur lors de l'ajout aux favoris");
    })
  );
};

export const removeFromFavorites$ = (productId: number): Observable<any> => {
  return from(
    axios.delete(`${environment.apiBaseUrl}/favorites/${productId}`)
  ).pipe(
    map((response) => response.data),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur lors de la suppression des favoris");
    })
  );
};
