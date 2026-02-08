import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ShippingService } from './shipping.service';
import {
  CreateShippingZoneDto,
  UpdateShippingZoneDto,
  AssignProvincesDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  // ===== PUBLIC ENDPOINTS =====

  // Get all active zones (public)
  @Get('zones')
  async getActiveZones() {
    return this.shippingService.getActiveZones();
  }

  // Calculate shipping fee by province (public)
  @Get('fee')
  async calculateFee(
    @Query('province') province: string,
    @Query('orderTotal') orderTotal?: string,
  ) {
    const total = orderTotal ? parseInt(orderTotal, 10) : undefined;
    return this.shippingService.calculateFee(province, total);
  }

  // Get all provinces with zones (public)
  @Get('provinces')
  async getAllProvinces() {
    return this.shippingService.getAllProvinces();
  }

  // ===== ADMIN ENDPOINTS =====

  // Get all zones (admin)
  @Get('admin/zones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllZones() {
    return this.shippingService.getAllZones();
  }

  // Get zone by ID (admin)
  @Get('admin/zones/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getZoneById(@Param('id') id: string) {
    return this.shippingService.getZoneById(id);
  }

  // Create zone (admin)
  @Post('admin/zones')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createZone(@Body() dto: CreateShippingZoneDto) {
    return this.shippingService.createZone(dto);
  }

  // Update zone (admin)
  @Patch('admin/zones/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateZone(
    @Param('id') id: string,
    @Body() dto: UpdateShippingZoneDto,
  ) {
    return this.shippingService.updateZone(id, dto);
  }

  // Delete zone (admin)
  @Delete('admin/zones/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteZone(@Param('id') id: string) {
    return this.shippingService.deleteZone(id);
  }

  // Assign provinces to zone (admin)
  @Post('admin/zones/:id/provinces')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async assignProvinces(
    @Param('id') id: string,
    @Body() dto: AssignProvincesDto,
  ) {
    return this.shippingService.assignProvinces(id, dto.provinces);
  }
}
