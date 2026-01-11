import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  // Public: Lấy danh sách banners đang active
  async findAllActive() {
    return this.prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // Admin: Lấy tất cả banners
  async findAll() {
    return this.prisma.banner.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  // Admin: Lấy một banner theo ID
  async findOne(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });
    if (!banner) {
      throw new NotFoundException('Banner không tồn tại');
    }
    return banner;
  }

  // Admin: Tạo banner mới
  async create(dto: CreateBannerDto) {
    return this.prisma.banner.create({
      data: dto,
    });
  }

  // Admin: Cập nhật banner
  async update(id: string, dto: UpdateBannerDto) {
    await this.findOne(id);
    return this.prisma.banner.update({
      where: { id },
      data: dto,
    });
  }

  // Admin: Xóa banner
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.banner.delete({
      where: { id },
    });
  }
}
