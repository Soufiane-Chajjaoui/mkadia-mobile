export interface CartItemProduct {
    id: number;
    name: string;
    description?: string;
    price: number;
    discount?: number;
    stock: number;
    unit: string;
    quantity: number; // unité de vente (ex: 1 pièce, 1kg)
    expirationDate?: string;
    image: string;
    createdAt?: string;
    updatedAt?: string;
}