export interface Pasta{
    id: number;
    name: string;
    type: string;
    toppings?: string[];
    image?: string[];
    description?: string;
    price: number | string;
    quantity?: number;
    crust?: string;
    size?: string;
}