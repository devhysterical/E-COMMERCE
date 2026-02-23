import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto';
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto';
import { AddFlashSaleItemDto } from './dto/add-item.dto';

@Injectable()
export class FlashSaleService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFlashSaleDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (end <= start) {
      throw new BadRequestException('endTime phải sau startTime');
    }

    return this.prisma.flashSale.create({
      data: {
        name: dto.name,
        startTime: start,
        endTime: end,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            salePrice: item.salePrice,
            saleQty: item.saleQty,
            limitPerUser: item.limitPerUser ?? 1,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: { select: { name: true, price: true, imageUrl: true } },
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.flashSale.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, price: true, imageUrl: true },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const sale = await this.prisma.flashSale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!sale) throw new NotFoundException('Flash Sale not found');
    return sale;
  }

  async update(id: string, dto: UpdateFlashSaleDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.startTime) data.startTime = new Date(dto.startTime);
    if (dto.endTime) data.endTime = new Date(dto.endTime);

    return this.prisma.flashSale.update({
      where: { id },
      data,
      include: {
        items: {
          include: {
            product: { select: { name: true, price: true, imageUrl: true } },
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.flashSale.delete({ where: { id } });
  }

  async addItem(flashSaleId: string, dto: AddFlashSaleItemDto) {
    await this.findOne(flashSaleId);

    const existing = await this.prisma.flashSaleItem.findUnique({
      where: {
        flashSaleId_productId: {
          flashSaleId,
          productId: dto.productId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Product already in this flash sale');
    }

    return this.prisma.flashSaleItem.create({
      data: {
        flashSaleId,
        productId: dto.productId,
        salePrice: dto.salePrice,
        saleQty: dto.saleQty,
        limitPerUser: dto.limitPerUser ?? 1,
      },
      include: {
        product: { select: { name: true, price: true, imageUrl: true } },
      },
    });
  }

  async removeItem(flashSaleId: string, itemId: string) {
    const item = await this.prisma.flashSaleItem.findFirst({
      where: { id: itemId, flashSaleId },
    });

    if (!item) throw new NotFoundException('Flash sale item not found');

    return this.prisma.flashSaleItem.delete({ where: { id: itemId } });
  }

  async getActiveFlashSales() {
    const now = new Date();

    return this.prisma.flashSale.findMany({
      where: {
        isActive: true,
        startTime: { lte: now },
        endTime: { gte: now },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true,
                stock: true,
              },
            },
          },
        },
      },
    });
  }

  async checkFlashSalePrice(
    productId: string,
    userId: string,
  ): Promise<{ salePrice: number; flashSaleItemId: string } | null> {
    const now = new Date();

    const flashSaleItem = await this.prisma.flashSaleItem.findFirst({
      where: {
        productId,
        flashSale: {
          isActive: true,
          startTime: { lte: now },
          endTime: { gte: now },
        },
      },
      include: {
        flashSale: { select: { startTime: true } },
      },
    });

    if (!flashSaleItem) return null;

    // Check stock availability
    if (flashSaleItem.soldQty >= flashSaleItem.saleQty) return null;

    // Check user purchase limit during this flash sale
    const userPurchaseCount = await this.prisma.orderItem.count({
      where: {
        productId,
        order: {
          userId,
          status: { notIn: ['CANCELLED'] },
          createdAt: { gte: flashSaleItem.flashSale.startTime },
        },
      },
    });

    if (userPurchaseCount >= flashSaleItem.limitPerUser) return null;

    return {
      salePrice: flashSaleItem.salePrice,
      flashSaleItemId: flashSaleItem.id,
    };
  }

  async incrementSoldQty(flashSaleItemId: string, qty: number) {
    return this.prisma.flashSaleItem.update({
      where: { id: flashSaleItemId },
      data: { soldQty: { increment: qty } },
    });
  }
}
