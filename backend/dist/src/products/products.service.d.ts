import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateProductDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        categoryId: string;
    }>;
    findAll(categoryId?: string, search?: string, page?: number, limit?: number, sortBy?: 'price' | 'name' | 'createdAt', sortOrder?: 'asc' | 'desc', minPrice?: number, maxPrice?: number): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
            images: {
                id: string;
                imageUrl: string;
                createdAt: Date;
                sortOrder: number;
                productId: string;
                isPrimary: boolean;
            }[];
        } & {
            id: string;
            name: string;
            description: string | null;
            price: number;
            stock: number;
            imageUrl: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
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
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        images: {
            id: string;
            imageUrl: string;
            createdAt: Date;
            sortOrder: number;
            productId: string;
            isPrimary: boolean;
        }[];
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            rating: number;
            comment: string | null;
            userId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        categoryId: string;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        categoryId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        price: number;
        stock: number;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        categoryId: string;
    }>;
    addImage(productId: string, imageUrl: string, isPrimary?: boolean): Promise<{
        id: string;
        imageUrl: string;
        createdAt: Date;
        sortOrder: number;
        productId: string;
        isPrimary: boolean;
    }>;
    removeImage(productId: string, imageId: string): Promise<{
        message: string;
    }>;
    setPrimaryImage(productId: string, imageId: string): Promise<{
        id: string;
        imageUrl: string;
        createdAt: Date;
        sortOrder: number;
        productId: string;
        isPrimary: boolean;
    }>;
    getImages(productId: string): Promise<{
        id: string;
        imageUrl: string;
        createdAt: Date;
        sortOrder: number;
        productId: string;
        isPrimary: boolean;
    }[]>;
}
