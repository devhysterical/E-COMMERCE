import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(userId: string, dto: {
        address: string;
        phone: string;
    }): Promise<{
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
