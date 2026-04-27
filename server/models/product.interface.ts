export enum ProductType {
    sandwich = "sandwich",
    fries = "fries",
    drink = "drink",
    menu = "menu"
}

export interface Product {
    _id: string;
    name: string;
    price: number;
    type: ProductType;
    items?: Product[]
}