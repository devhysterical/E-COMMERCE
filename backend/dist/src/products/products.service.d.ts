import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProductDto): Promise<{
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
    }>;
    findAll(categoryId?: string, search?: string, page?: number, limit?: number): Promise<{
        data: ({
            category: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                description: string | null;
            };
            images: {
                id: string;
                createdAt: Date;
                productId: string;
                imageUrl: string;
                sortOrder: number;
                isPrimary: boolean;
            }[];
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            comment: string | null;
            productId: string;
            userId: string;
        }[];
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            description: string | null;
        };
        images: {
            id: string;
            createdAt: Date;
            productId: string;
            imageUrl: string;
            sortOrder: number;
            isPrimary: boolean;
        }[];
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
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
    addImage(productId: string, imageUrl: string, isPrimary?: boolean): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        imageUrl: string;
        sortOrder: number;
        isPrimary: boolean;
    }>;
    removeImage(productId: string, imageId: string): Promise<{
        message: string;
    }>;
    setPrimaryImage(productId: string, imageId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        imageUrl: string;
        sortOrder: number;
        isPrimary: boolean;
    }>;
    getImages(productId: string): Promise<{
        id: string;
        createdAt: Date;
        productId: string;
        imageUrl: string;
        sortOrder: number;
        isPrimary: boolean;
    }[]>;
}
