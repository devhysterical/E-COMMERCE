import { PrismaService } from '../prisma/prisma.service';
import { CartsService } from '../carts/carts.service';
import { OrderStatus } from '@prisma/client';
export declare class OrdersService {
    private prisma;
    private cartsService;
    constructor(prisma: PrismaService, cartsService: CartsService);
    createOrder(userId: string, address: string, phone: string): Promise<{
        id: string;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        address: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
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
            quantity: number;
            price: number;
            orderId: string;
        })[];
    } & {
        id: string;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        address: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
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
            quantity: number;
            price: number;
            orderId: string;
        })[];
    } & {
        id: string;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        address: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
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
            quantity: number;
            price: number;
            orderId: string;
        })[];
    } & {
        id: string;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        address: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
    })[]>;
    updateStatus(id: string, status: OrderStatus): Promise<{
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
            quantity: number;
            price: number;
            orderId: string;
        })[];
    } & {
        id: string;
        totalAmount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        address: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
    }>;
    getStats(): Promise<{
        totalOrders: number;
        totalRevenue: number;
        ordersByStatus: Record<string, number>;
    }>;
}
