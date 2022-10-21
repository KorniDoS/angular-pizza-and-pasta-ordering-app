export interface Pizza{
    id: number,
    name: string;
    type: string;
    toppings?: string[];
    image?: string[];
    description?: string;
    price: number | string;
    crust?: string;
    size?: string;
    quantity?: number;
}