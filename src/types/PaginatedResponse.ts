import { ProductCard } from "../models/ProductCard";

export interface PaginatedResponse<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  elements: Array<T>;
  hasMore?: boolean;
}