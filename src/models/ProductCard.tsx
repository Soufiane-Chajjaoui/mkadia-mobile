import { Media } from "../types/Media";

export interface ProductCard {
    id: number;
    name: string;
    price: number;
    unit?: string;
    quantity?: number;
    urls?: Media[];
    discount: number;
}

export interface FavoriteProductCard extends ProductCard {
  description: string;
  expirationDate?: string;    // format ISO (ex: "2025-12-31")
  createdAt: string;          // format ISO (ex: "2025-12-31T10:00:00.000Z")
  updatedAt: string;          // format ISO (ex: "2025-12-31T10:00:00.000Z")
}
