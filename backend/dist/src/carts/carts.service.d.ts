import { PrismaService } from '../prisma/prisma.service';
export declare class CartsService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): Promise<{
        cartItems: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                description: string | null;
                price: number;
                stock: number;
                imageUrl: string | null;
                categoryId: string;
            };
        } & {
            id: string;
            productId: string;
            cartId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    addToCart(userId: string, productId: string, quantity: number): Promise<{
        id: string;
        productId: string;
        cartId: string;
        quantity: number;
    }>;
    updateQuantity(itemId: string, quantity: number): Promise<{
        id: string;
        productId: string;
        cartId: string;
        quantity: number;
    }>;
    removeItem(itemId: string): Promise<{
        id: string;
        productId: string;
        cartId: string;
        quantity: number;
    }>;
    clearCart(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
