import { Media } from "./Media";

export interface ProductCard {
    id: string;
    name: string;
    price: number;
    unit: string;
    quantity: number;
    urls: Media[];
    discount?: number;
}