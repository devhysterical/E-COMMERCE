import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(req: {
        user: {
            userId: string;
        };
    }): Promise<{
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
    addToWishlist(req: {
        user: {
            userId: string;
        };
    }, productId: string): Promise<{
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
    removeFromWishlist(req: {
        user: {
            userId: string;
        };
    }, productId: string): Promise<{
        message: string;
    }>;
    toggleWishlist(req: {
        user: {
            userId: string;
        };
    }, productId: string): Promise<{
        inWishlist: boolean;
        message: string;
    }>;
    checkWishlist(req: {
        user: {
            userId: string;
        };
    }, productId: string): Promise<{
        inWishlist: boolean;
    }>;
}
