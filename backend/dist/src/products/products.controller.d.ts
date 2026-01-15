import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
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
    findAll(categoryId?: string, search?: string, page?: string, limit?: string, sortBy?: 'price' | 'name' | 'createdAt', sortOrder?: 'asc' | 'desc', minPrice?: string, maxPrice?: string): Promise<{
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
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
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
    getImages(id: string): Promise<{
        id: string;
        imageUrl: string;
        createdAt: Date;
        sortOrder: number;
        productId: string;
        isPrimary: boolean;
    }[]>;
    addImage(id: string, body: {
        imageUrl: string;
        isPrimary?: boolean;
    }): Promise<{
        id: string;
        imageUrl: string;
        createdAt: Date;
        sortOrder: number;
        productId: string;
        isPrimary: boolean;
    }>;
    removeImage(id: string, imageId: string): Promise<{
        message: string;
    }>;
    setPrimaryImage(id: string, imageId: string): Promise<{
        id: string;
        imageUrl: string;
        createdAt: Date;
        sortOrder: number;
        productId: string;
        isPrimary: boolean;
    }>;
}
