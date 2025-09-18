import axios from "axios";
import { from, Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { ProductCard } from "../models/ProductCard";
import { environment } from "../config/environment";
import { CategoryCard } from "../models/CategoryCard";
import { PaginatedResponse } from "../types/PaginatedResponse";
import { ProductDetails } from "../models/ProductDetails";

// Interface pour la réponse paginée

  export const getProducts$ = (): Observable<ProductCard[]> => {
    return from(axios.get(`${environment.apiBaseUrl}/public/products/top-products`)).pipe(
      map((response) => response.data),
      catchError((error) => {
        throw new Error(error);
      })
    );
  };

  // Nouvelle fonction pour la pagination
  export const getProductsPaginated$ = (page: number = 0, size: number = 10, stock : number = 10): Observable<PaginatedResponse<ProductCard>> => {
    return from(
      axios.get(`${environment.apiBaseUrl}/public/top-products`, {
        params: { page, size, stock}
      })
    ).pipe(
      map((response) => {
        const data = response.data;
        
        // Adapter la réponse de votre backend
        const adaptedResponse: PaginatedResponse<ProductCard> = {
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          pageSize: data.pageSize,
          totalRecords: data.totalRecords,
          elements: data.elements,
          hasMore: data.currentPage < (data.totalPages - 1)
        };
        console.log(adaptedResponse)
        
        return adaptedResponse;
      }),
      catchError((error) => {
        throw new Error(error);
      })
    );
  };

  export const getCategories$ = (): Observable<CategoryCard[]> => {
    return from(axios.get(`${environment.apiBaseUrl}/public/categories`)).pipe(
      map((response) => response.data),
      catchError((error) => {
        throw new Error(error);
      })
    );
  };

  export const getProductsPaginatedByCategory$ = (page: number = 0, size: number = 10, stock : number = 10, category: number): Observable<PaginatedResponse<ProductCard>> => {
    return from(
      axios.get(`${environment.apiBaseUrl}/public/products`, {
        params: { page, size, stock, category}
      })
    ).pipe(
      map((response) => {
        const data = response.data;
        // Adapter la réponse de votre backend
        const adaptedResponse: PaginatedResponse<ProductCard> = {
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          pageSize: data.pageSize,
          totalRecords: data.totalRecords,
          elements: data.elements,
          hasMore: data.currentPage < (data.totalPages - 1)
        };
        return adaptedResponse;
      }),
      catchError((error) => {
        throw new Error(error);
      })
    );
  };

  export const getProductById$ = (product : ProductCard) : Observable<ProductDetails> => {
    return from(
      axios.get(`${environment.apiBaseUrl}/public/product/${product.id}`)
    ).pipe(
      map((response)=> response.data),
      catchError((error) => {
        throw new Error(error)
      })
    );
};