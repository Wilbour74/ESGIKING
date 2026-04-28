export enum ProductType {
    burger = 'burger',
    sandwich = 'sandwich',
    wrap = 'wrap',
    finger_food = 'finger_food',
    drink = 'drink',
}

export enum ProductCategory {
    main = 'main',
    side = 'side',
    dessert = 'dessert',
    drink = 'drink',
}

export interface Product {
    _id: string;
    name: string;
    price: number;
    type: ProductType;
    category: ProductCategory;
}