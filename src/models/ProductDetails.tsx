import { ProductCard } from "./ProductCard";

// Interface étendue pour le ProductDTO complet
export interface ProductDetails extends ProductCard {
  description?: string;
  sku?: string;
  barcode?: string;
  brand?: string;
  origin?: string;
  stock?: number;
  newProduct?: boolean;
  featured?: boolean;
  expirationDate?: string;
  metaTitle?: string;
  metaDesc?: string;
  discountPercentage?: number
}