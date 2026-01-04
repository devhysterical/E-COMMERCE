import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    // Kiểm tra sản phẩm tồn tại
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        userId,
        productId: dto.productId,
      },
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });
  }

  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Đánh giá không tồn tại');
    }

    return review;
  }

  async update(
    id: string,
    userId: string,
    userRole: string,
    dto: UpdateReviewDto,
  ) {
    const review = await this.findOne(id);

    // Chỉ owner hoặc admin mới được sửa
    if (review.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền sửa đánh giá này');
    }

    return this.prisma.review.update({
      where: { id },
      data: dto,
      include: {
        user: {
          select: { id: true, fullName: true, email: true },
        },
      },
    });
  }

  async remove(id: string, userId: string, userRole: string) {
    const review = await this.findOne(id);

    // Chỉ owner hoặc admin mới được xóa
    if (review.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Bạn không có quyền xóa đánh giá này');
    }

    return this.prisma.review.delete({
      where: { id },
    });
  }

  async getProductStats(productId: string) {
    const stats = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      averageRating: stats._avg.rating ?? 0,
      totalReviews: stats._count.rating,
    };
  }
}
