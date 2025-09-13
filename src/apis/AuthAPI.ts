import axios from "axios";
import { catchError, from, map, Observable } from "rxjs";
import { environment } from "../config/environment";
import { LoginRequest } from "../types/LoginRequest";
import { LoginResponse } from "../types/LoginResponse";
import { SignupRequest } from "../types/SignUpRequest";
import { ResponseOperation } from "../types/ResponseOperation";


export const login$ = (payload: LoginRequest): Observable<ResponseOperation<LoginResponse>> => {
  return from(
    axios.post<ResponseOperation<LoginResponse>>(`${environment.apiBaseUrl}/auth/login`, payload, {
      headers: { "Content-Type": "application/json" },
    })
  ).pipe(
    map((response) => {
      console.log(response)
      return response.data;
    }),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    })
  );
};

export const signup$ = (payload: SignupRequest): Observable<any> => {
  return from(
    axios.post<any>(`${environment.apiBaseUrl}/auth/register`, payload, {
      headers: { "Content-Type": "application/json" },
    })
  ).pipe(
    map((response) => response.data),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    })
  );
};