import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(req: {
        user: {
            sub: string;
        };
    }, dto: CreateReviewDto): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        comment: string | null;
        productId: string;
        userId: string;
    }>;
    findByProduct(productId: string): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        comment: string | null;
        productId: string;
        userId: string;
    })[]>;
    getProductStats(productId: string): Promise<{
        averageRating: number;
        totalReviews: number;
    }>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        comment: string | null;
        productId: string;
        userId: string;
    }>;
    update(id: string, req: {
        user: {
            sub: string;
            role: string;
        };
    }, dto: UpdateReviewDto): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        comment: string | null;
        productId: string;
        userId: string;
    }>;
    remove(id: string, req: {
        user: {
            sub: string;
            role: string;
        };
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        comment: string | null;
        productId: string;
        userId: string;
    }>;
}
