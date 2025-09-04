import { Media } from "./Media";

export interface ProductCard {
    id: string;
    name: string;
    price: string;
    unit: string;
    quantity: number;
    urls: Media[];
    discount?: string;
}