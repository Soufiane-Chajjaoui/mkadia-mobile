import { CartItemProduct } from "./CartItemProduct";

export interface CartItem {
    id: number;
    product : CartItemProduct;
    quantity: number;
    createdAt?: string;
    updatedAt?: string;
}