import { from, map, catchError, Observable } from 'rxjs';
import { environment } from '../config/environment';
import { configuredAxios as axios } from '../intercepteurs/main-interceptor';
import { Cart } from '../models/Cart';

export type CartItemRequest = {
  productId: number;
  quantity: number;
}

export interface ApplyCouponRequest {
  code: string;
  cartAmount: number;
}

export interface CouponResponse {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED' | 'FREE_DELIVERY';
  discountValue: number;
  discountPercentage?: number;
  message: string;
}


export const getCart$ = (): Observable<Cart> => {
  return from(
    axios.get(`${environment.apiBaseUrl}/cart`))
    .pipe(
      map((response) => {
        return response.data
      }),
      catchError((error) => {
        throw new Error(error.response?.data?.message || "Erreur de connexion");
      })
    );
}

export const addItemToCart$ = (payload: any) => {
  return from(
    axios.post(`${environment.apiBaseUrl}/cart/add-item`, payload))
    .pipe(
      map((response) => {
        return response.data
      }),
      catchError((error) => {
        throw new Error(error.response?.data?.message || "Erreur de connexion");
      })
    )
}

export const updateCartItemQuantity$ = (payload: CartItemRequest): Observable<any> => {
  return from(
    axios.put(`${environment.apiBaseUrl}/cart/update-item`, payload)
  ).pipe(
    map(
      (response) => response.data
    ), catchError((error) => {
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    })
  )
}

export const deleteItem$ = (cartItemId: number): Observable<any> => {
  return from(
    axios.delete(`${environment.apiBaseUrl}/cart/delete-item/${cartItemId}`)
  ).pipe(
    map(
      (resp) => resp.data
    )
    , catchError(
      (err) => {
        throw new Error(err.response?.data?.message || "Erreur de connexion");
      })
  )
}

export const clearCart$ = (): Observable<any> => {
  return from(
    axios.delete(`${environment.apiBaseUrl}/cart/clear`)
  ).pipe(
    map(
      (resp) => resp.data
    )
    , catchError(
      (err) => {
        throw new Error(err.response?.data?.message || "Erreur de connexion");
      })
  )
}

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