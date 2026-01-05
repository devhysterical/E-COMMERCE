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
    findAll(categoryId?: string, search?: string, page?: string, limit?: string): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
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
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            comment: string | null;
            userId: string;
            productId: string;
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
}
