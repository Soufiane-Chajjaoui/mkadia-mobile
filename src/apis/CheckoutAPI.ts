import { from, map, catchError, Observable } from "rxjs";
import { environment } from "../config/environment";
import { configuredAxios as axios } from '../intercepteurs/main-interceptor';
import { CheckoutRequest, DeliveryAddress } from "../types/CheckoutTypes";

export interface ApplyCouponRequest {
  code: string | "";
  cartAmount: number;
}

export interface CouponResponse {
  code: string;
  discountType?: 'PERCENTAGE' | 'FIXED' | 'FREE_DELIVERY';
  discountValue?: number;
  discountPercentage?: number;
  message?: string;
}


export const checkout$ = (payload: CheckoutRequest) : Observable<any> => {
    console.log('🌐 API: Sending checkout request to:', `${environment.apiBaseUrl}/checkout/confirm`);
    console.log('📤 API: Payload:', JSON.stringify(payload, null, 2));

    return from(
      axios.post(`${environment.apiBaseUrl}/checkout/confirm`, payload)
    ).pipe(
      map((response) => {
        console.log('📥 API: Response received:', response.data);
        return response.data;
      }),
      catchError((error) => {
        console.error('🔴 API: Error occurred:', error);
        console.error('🔴 API: Error response:', error.response?.data);
        console.error('🔴 API: Error status:', error.response?.status);
        const errorMessage = error.response?.data?.message || "Erreur de connexion";
        console.error('🔴 API: Error message:', errorMessage);
        throw new Error(errorMessage);
      })
    );
}

export const getAddresses$ = (): Observable<DeliveryAddress[]> => {
  return from(
    axios.get(`${environment.apiBaseUrl}/addresses`) // ou /user/addresses
  ).pipe(
    map((resp) => resp.data),
    catchError((err) => {
      const message = err.response?.data?.message || "Erreur lors du chargement des adresses";
      throw new Error(message);
    })
  );
};

// ✅ Sauvegarder une nouvelle adresse
export const saveAddress$ = (address: DeliveryAddress): Observable<DeliveryAddress> => {
  return from(
    axios.post(`${environment.apiBaseUrl}/addresses`, address)
  ).pipe(
    map((resp) => resp.data),
    catchError((err) => {
      const message = err.response?.data?.message || "Erreur lors de la sauvegarde de l'adresse";
      throw new Error(message);
    })
  );
};

// ✅ Supprimer une adresse
export const deleteAddress$ = (addressId: string): Observable<void> => {
  return from(
    axios.delete(`${environment.apiBaseUrl}/addresses/${addressId}`)
  ).pipe(
    map((resp) => resp.data),
    catchError((err) => {
      const message = err.response?.data?.message || "Erreur lors de la suppression";
      throw new Error(message);
    })
  );
};

// ✅ Définir une adresse par défaut
export const setDefaultAddress$ = (addressId: string): Observable<void> => {
  return from(
    axios.put(`${environment.apiBaseUrl}/addresses/${addressId}/default`)
  ).pipe(
    map((resp) => resp.data),
    catchError((err) => {
      const message = err.response?.data?.message || "Erreur lors de la mise à jour";
      throw new Error(message);
    })
  );
};

export const applyPromoCode$ = (
  promoCode: string,
  cartAmount: number
): Observable<CouponResponse> => {
  return from(
    axios.post<CouponResponse>(`${environment.apiBaseUrl}/coupons/apply`, {
      code: promoCode,
      cartAmount: cartAmount
    })
  ).pipe(
    map((resp) => resp.data),
    catchError((err) => {
      const message = err.response?.data?.message || "Code promo invalide";
      throw new Error(message);
    })
  );
};