export interface Product {
    _id: string;
    name: string;
    price: number;
    items?: Product[]
}