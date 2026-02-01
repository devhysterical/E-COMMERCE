import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string, userId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException('Địa chỉ không tồn tại');
    }

    return address;
  }

  async create(userId: string, dto: CreateAddressDto) {
    // If this is the first address or marked as default, handle default logic
    if (dto.isDefault) {
      await this.clearDefaultAddress(userId);
    }

    // Check if this is the first address
    const existingCount = await this.prisma.address.count({
      where: { userId },
    });
    const isDefault = dto.isDefault || existingCount === 0;

    return this.prisma.address.create({
      data: {
        ...dto,
        userId,
        isDefault,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateAddressDto) {
    await this.findOne(id, userId);

    // If setting as default, clear other defaults first
    if (dto.isDefault) {
      await this.clearDefaultAddress(userId);
    }

    return this.prisma.address.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const address = await this.findOne(id, userId);

    await this.prisma.address.delete({ where: { id } });

    // If deleted address was default, set another as default
    if (address.isDefault) {
      const nextAddress = await this.prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      if (nextAddress) {
        await this.prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return { message: 'Đã xóa địa chỉ' };
  }

  async setDefault(id: string, userId: string) {
    await this.findOne(id, userId);
    await this.clearDefaultAddress(userId);

    return this.prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });
  }

  private async clearDefaultAddress(userId: string) {
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
}
