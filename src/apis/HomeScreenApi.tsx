import axios from "axios";
import { from, Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { ProductCard } from "../models/ProductCard";
import { environment } from "../config/environment";

// Création d’un observable pour un GET
export const getProducts$ = () : Observable<ProductCard[]> => {
  return from(axios.get(`${environment.apiBaseUrl}/public/products/best-seller`)).pipe(
    map((response) => response.data), // extraire uniquement les données
    catchError((error) => {
      throw new Error(error);
    })
  );
};
