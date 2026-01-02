import { PrismaService } from '../prisma/prisma.service';
import { CartsService } from '../carts/carts.service';
export declare class OrdersService {
    private prisma;
    private cartsService;
    constructor(prisma: PrismaService, cartsService: CartsService);
    createOrder(userId: string, address: string, phone: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        address: string;
        phone: string;
    }>;
    findAll(userId: string): Promise<({
        orderItems: ({
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
            price: number;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        address: string;
        phone: string;
    })[]>;
    findOne(id: string, userId: string): Promise<({
        orderItems: ({
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
            price: number;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        address: string;
        phone: string;
    }) | null>;
}
