import axios from "axios";
import { catchError, from, map, Observable } from "rxjs";
import { environment } from "../config/environment";
import { LoginRequest } from "../types/LoginRequest";
import { LoginResponse } from "../types/LoginResponse";


export const login$ = (payload: LoginRequest): Observable<LoginResponse> => {
  return from(
    axios.post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, payload, {
      headers: { "Content-Type": "application/json" },
    })
  ).pipe(
    map((response) => response.data),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    })
  );
};