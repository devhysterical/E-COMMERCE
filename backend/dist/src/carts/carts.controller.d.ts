import { CartsService } from './carts.service';
export declare class CartsController {
    private readonly cartsService;
    constructor(cartsService: CartsService);
    getCart(userId: string): Promise<{
        cartItems: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                price: number;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            cartId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addToCart(userId: string, dto: {
        productId: string;
        quantity: number;
    }): Promise<{
        id: string;
        cartId: string;
        productId: string;
        quantity: number;
    }>;
    updateQuantity(itemId: string, quantity: number): Promise<{
        id: string;
        cartId: string;
        productId: string;
        quantity: number;
    }>;
    removeItem(itemId: string): Promise<{
        id: string;
        cartId: string;
        productId: string;
        quantity: number;
    }>;
}
