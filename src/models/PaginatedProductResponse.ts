import { ProductCard } from "./ProductCard";

export interface PaginatedProductResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  elements: ProductCard[];
  // Propriétés calculées pour la compatibilité
  products?: ProductCard[];
  hasMore?: boolean;
}