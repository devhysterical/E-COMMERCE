import { OrdersService } from './orders.service';
import { OrderStatus, PaymentMethod } from '@prisma/client';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(userId: string, dto: {
        address: string;
        phone: string;
        paymentMethod?: PaymentMethod;
    }): Promise<{
        id: string;
        phone: string;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        momoTransId: string | null;
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
        phone: string;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        momoTransId: string | null;
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
        phone: string;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        momoTransId: string | null;
    }) | null>;
    findAllAdmin(): Promise<({
        user: {
            id: string;
            email: string;
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
            price: number;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        phone: string;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        momoTransId: string | null;
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
            id: string;
            email: string;
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
            price: number;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        phone: string;
        address: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        momoTransId: string | null;
    }>;
}
