import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  // Lấy danh sách wishlist của user
  async getWishlist(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt,
      product: item.product,
    }));
  }

  // Thêm sản phẩm vào wishlist
  async addToWishlist(userId: string, productId: string) {
    // Kiểm tra product tồn tại
    const product = await this.prisma.product.findUnique({
      where: { id: productId, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // Thêm vào wishlist (upsert để tránh duplicate)
    const item = await this.prisma.wishlistItem.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      update: {}, // Không update gì nếu đã tồn tại
      create: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });

    return item;
  }

  // Xóa sản phẩm khỏi wishlist
  async removeFromWishlist(userId: string, productId: string) {
    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (!item) {
      throw new NotFoundException(
        'Sản phẩm không có trong danh sách yêu thích',
      );
    }

    await this.prisma.wishlistItem.delete({
      where: { id: item.id },
    });

    return { message: 'Đã xóa khỏi danh sách yêu thích' };
  }

  // Kiểm tra sản phẩm có trong wishlist không
  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    return !!item;
  }

  // Toggle wishlist (thêm nếu chưa có, xóa nếu đã có)
  async toggleWishlist(userId: string, productId: string) {
    const isInWishlist = await this.isInWishlist(userId, productId);

    if (isInWishlist) {
      await this.removeFromWishlist(userId, productId);
      return { inWishlist: false, message: 'Đã xóa khỏi danh sách yêu thích' };
    } else {
      await this.addToWishlist(userId, productId);
      return { inWishlist: true, message: 'Đã thêm vào danh sách yêu thích' };
    }
  }
}
