import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(userId: string, dto: {
        address: string;
        phone: string;
    }): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
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
            productId: string;
            quantity: number;
            price: number;
            orderId: string;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
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
            productId: string;
            quantity: number;
            price: number;
            orderId: string;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        address: string;
        phone: string;
    }) | null>;
    findAllAdmin(): Promise<({
        user: {
            email: string;
            id: string;
            fullName: string | null;
        };
        orderItems: ({
            product: {
                id: string;
                name: string;
                imageUrl: string | null;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            price: number;
            orderId: string;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        address: string;
        phone: string;
    })[]>;
    getStats(): Promise<{
        totalOrders: number;
        totalRevenue: number;
        ordersByStatus: Record<string, number>;
    }>;
    updateStatus(id: string, dto: {
        status: OrderStatus;
    }): Promise<{
        user: {
            email: string;
            id: string;
            fullName: string | null;
        };
        orderItems: ({
            product: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            price: number;
            orderId: string;
        })[];
    } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        address: string;
        phone: string;
    }>;
}
