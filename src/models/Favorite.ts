import { FavoriteProductCard } from "./ProductCard";

export interface Favorite {
  id: number;
  product: FavoriteProductCard;
  createdAt: string;
  updatedAt: string;
}