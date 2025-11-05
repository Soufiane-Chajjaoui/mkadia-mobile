import { from, Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { environment } from "../config/environment";
import { configuredAxios as axios } from "../intercepteurs/main-interceptor";
import { Review, ReviewRequest } from "../models/Review";
import { PaginatedResponse } from "../types/PaginatedResponse";

/**
 * Récupérer les avis avec pagination
 * GET /api/v1/reviews?productId={productId}&page={page}&size={size}
 */
export const getReviews$ = (
  productId: number,
  page: number = 0,
  size: number = 5
): Observable<PaginatedResponse<Review>> => {
  return from(
    axios.get(`${environment.apiBaseUrl}/reviews`, {
      params: { productId, page, size }
    })
  ).pipe(
    map((response) => {
      const data = response.data;
      const adaptedResponse: PaginatedResponse<Review> = {
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        pageSize: data.pageSize,
        totalRecords: data.totalRecords,
        elements: data.elements || [],
        hasMore: data.currentPage < (data.totalPages - 1)
      };
      return adaptedResponse;
    }),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur lors du chargement des avis");
    })
  );
};

/**
 * Ajouter un avis (nécessite authentification)
 * POST /api/v1/reviews
 */
export const addReview$ = (review: ReviewRequest): Observable<Review> => {
  return from(
    axios.post(`${environment.apiBaseUrl}/reviews`, review)
  ).pipe(
    map((response) => response.data),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur lors de l'ajout de l'avis");
    })
  );
};

/**
 * Modifier un avis (nécessite authentification)
 * PUT /api/v1/reviews/{reviewId}
 */
export const updateReview$ = (reviewId: number, review: ReviewRequest): Observable<Review> => {
  return from(
    axios.put(`${environment.apiBaseUrl}/${reviewId}`, review)
  ).pipe(
    map((response) => response.data),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur lors de la modification de l'avis");
    })
  );
};

/**
 * Supprimer un avis (nécessite authentification)
 * DELETE /api/v1/reviews/{reviewId}
 */
export const deleteReview$ = (reviewId: number): Observable<void> => {
  return from(
    axios.delete(`${environment.apiBaseUrl}/reviews/${reviewId}`)
  ).pipe(
    map((response) => response.data),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur lors de la suppression de l'avis");
    })
  );
};

