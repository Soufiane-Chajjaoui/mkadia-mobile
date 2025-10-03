import { CartItem } from "./CartItem";

export interface Cart {
    id: number;
    items: CartItem[];
    createdAt?: string;
    updatedAt?: string;
}