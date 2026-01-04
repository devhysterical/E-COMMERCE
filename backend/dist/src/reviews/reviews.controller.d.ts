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
        rating: number;
        comment: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
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
        rating: number;
        comment: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
    remove(id: string, req: {
        user: {
            sub: string;
            role: string;
        };
    }): Promise<{
        id: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
    }>;
}
