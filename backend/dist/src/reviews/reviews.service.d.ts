import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateReviewDto): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string | null;
        };
    } & {
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    findByProduct(productId: string): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string | null;
        };
    } & {
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string | null;
        };
    } & {
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    update(id: string, userId: string, userRole: string, dto: UpdateReviewDto): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string | null;
        };
    } & {
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    remove(id: string, userId: string, userRole: string): Promise<{
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    getProductStats(productId: string): Promise<{
        averageRating: number;
        totalReviews: number;
    }>;
}
