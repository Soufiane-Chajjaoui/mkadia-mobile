import { catchError, from, map, Observable } from "rxjs";
import { environment } from "../config/environment";
import { LoginRequest } from "../types/LoginRequest";
import { LoginResponse } from "../types/LoginResponse";
import { SignupRequest } from "../types/SignUpRequest";
import { ResponseOperation } from "../types/ResponseOperation";
import { ResetPasswordRequest } from "../types/ResetPasswordRequest";
import axios from "../intercepteurs/auth-interceptor";


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

export const forgotPassword$ = (payload: ResetPasswordRequest): Observable<ResponseOperation<any>> => {

  return from(axios.post(`${environment.apiBaseUrl}/auth/forgot-password`,payload
  )).pipe(
    map((res) => res.data.message),
    catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    })
  )
}


export const changePassword$ = (payload: ResetPasswordRequest) => {

  return from(
    axios.patch(
      `${environment.apiBaseUrl}/auth/change-reset-password`,
      payload
    )
  ).pipe(
    map((res) => {
      console.log("✅ Change password success:", res.data);
      return res.data;
    }),
    catchError((error) => {
      console.error("❌ Change password error:", error.response?.data || error);
      throw new Error(error.response?.data?.message || "Connection error");
    })
  );
};

