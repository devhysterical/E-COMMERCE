import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShippingZoneDto, UpdateShippingZoneDto } from './dto';

@Injectable()
export class ShippingService {
  constructor(private prisma: PrismaService) {}

  // Get all active zones (public)
  async getActiveZones() {
    return this.prisma.shippingZone.findMany({
      where: { isActive: true },
      include: { provinces: true },
      orderBy: { name: 'asc' },
    });
  }

  // Get all zones (admin)
  async getAllZones() {
    return this.prisma.shippingZone.findMany({
      include: { provinces: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get zone by ID
  async getZoneById(id: string) {
    const zone = await this.prisma.shippingZone.findUnique({
      where: { id },
      include: { provinces: true },
    });
    if (!zone) {
      throw new NotFoundException('Shipping zone not found');
    }
    return zone;
  }

  // Create zone
  async createZone(dto: CreateShippingZoneDto) {
    return this.prisma.shippingZone.create({
      data: {
        name: dto.name,
        fee: dto.fee,
        minOrderFree: dto.minOrderFree,
        estimatedDays: dto.estimatedDays,
        isActive: dto.isActive ?? true,
      },
      include: { provinces: true },
    });
  }

  // Update zone
  async updateZone(id: string, dto: UpdateShippingZoneDto) {
    await this.getZoneById(id); // Check exists
    return this.prisma.shippingZone.update({
      where: { id },
      data: dto,
      include: { provinces: true },
    });
  }

  // Delete zone
  async deleteZone(id: string) {
    await this.getZoneById(id); // Check exists
    await this.prisma.shippingZone.delete({ where: { id } });
    return { message: 'Shipping zone deleted successfully' };
  }

  // Assign provinces to zone
  async assignProvinces(zoneId: string, provinces: string[]) {
    await this.getZoneById(zoneId); // Check exists

    // Remove existing provinces for this zone
    await this.prisma.shippingProvince.deleteMany({
      where: { zoneId },
    });

    // Create new province mappings
    await this.prisma.shippingProvince.createMany({
      data: provinces.map((province) => ({
        zoneId,
        province,
      })),
      skipDuplicates: true,
    });

    return this.getZoneById(zoneId);
  }

  // Calculate shipping fee by province
  async calculateFee(province: string, orderTotal?: number) {
    // Find zone for this province
    const shippingProvince = await this.prisma.shippingProvince.findUnique({
      where: { province },
      include: { zone: true },
    });

    if (!shippingProvince || !shippingProvince.zone.isActive) {
      // Default fee if province not in any zone
      return {
        fee: 0,
        zone: null,
        isFreeShipping: false,
        message: 'Province not in shipping zones',
      };
    }

    const zone = shippingProvince.zone;

    // Check free shipping threshold
    const isFreeShipping = zone.minOrderFree
      ? (orderTotal ?? 0) >= zone.minOrderFree
      : false;

    return {
      fee: isFreeShipping ? 0 : zone.fee,
      zone: {
        id: zone.id,
        name: zone.name,
        estimatedDays: zone.estimatedDays,
        minOrderFree: zone.minOrderFree,
      },
      isFreeShipping,
      message: isFreeShipping
        ? `Miễn phí vận chuyển cho đơn từ ${zone.minOrderFree?.toLocaleString('vi-VN')}đ`
        : null,
    };
  }

  // Get all provinces with their zones
  async getAllProvinces() {
    return this.prisma.shippingProvince.findMany({
      include: { zone: { select: { id: true, name: true, fee: true } } },
      orderBy: { province: 'asc' },
    });
  }
}
