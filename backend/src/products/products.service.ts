import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
    });
  }

  async findAll(categoryId?: string, search?: string, page = 1, limit = 12) {
    const skip = (page - 1) * limit;
    const where = {
      deletedAt: null,
      ...(categoryId && { categoryId }),
      ...(search && {
        name: { contains: search, mode: 'insensitive' as const },
      }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: true, images: { orderBy: { sortOrder: 'asc' } } },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: true,
        reviews: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!product) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ===== Product Images Management =====

  async addImage(productId: string, imageUrl: string, isPrimary = false) {
    await this.findOne(productId);

    // Nếu đặt làm ảnh chính, bỏ primary của các ảnh khác
    if (isPrimary) {
      await this.prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    // Lấy sortOrder tiếp theo
    const lastImage = await this.prisma.productImage.findFirst({
      where: { productId },
      orderBy: { sortOrder: 'desc' },
    });
    const sortOrder = lastImage ? lastImage.sortOrder + 1 : 0;

    return this.prisma.productImage.create({
      data: {
        productId,
        imageUrl,
        isPrimary,
        sortOrder,
      },
    });
  }

  async removeImage(productId: string, imageId: string) {
    const image = await this.prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });

    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    await this.prisma.productImage.delete({
      where: { id: imageId },
    });

    return { message: 'Đã xóa ảnh' };
  }

  async setPrimaryImage(productId: string, imageId: string) {
    const image = await this.prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });

    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    // Bỏ primary của tất cả ảnh
    await this.prisma.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    });

    // Đặt ảnh này làm primary
    return this.prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    });
  }

  async getImages(productId: string) {
    await this.findOne(productId);
    return this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
