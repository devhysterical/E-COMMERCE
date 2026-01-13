import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private prisma;
    constructor(prisma: PrismaService);
    getWishlist(userId: string): Promise<{
        id: string;
        productId: string;
        createdAt: Date;
        product: {
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                description: string | null;
            };
        } & {
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
    }[]>;
    addToWishlist(userId: string, productId: string): Promise<{
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
        createdAt: Date;
        productId: string;
        userId: string;
    }>;
    removeFromWishlist(userId: string, productId: string): Promise<{
        message: string;
    }>;
    isInWishlist(userId: string, productId: string): Promise<boolean>;
    toggleWishlist(userId: string, productId: string): Promise<{
        inWishlist: boolean;
        message: string;
    }>;
}
