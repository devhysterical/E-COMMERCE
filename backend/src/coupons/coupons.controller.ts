import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import {
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponDto,
} from './dto/coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('coupons')
@UseGuards(JwtAuthGuard)
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  // ===== User Endpoints =====

  // GET /coupons/available - Lấy danh sách mã giảm giá khả dụng
  @Get('available')
  getAvailableCoupons() {
    return this.couponsService.getAvailableCoupons();
  }

  // POST /coupons/validate - Validate coupon code
  @Post('validate')
  validateCoupon(
    @Body() dto: ValidateCouponDto,
    @Request() req: { user: { userId: string } },
  ) {
    return this.couponsService.validateCoupon(dto, req.user.userId);
  }

  // ===== Admin Endpoints =====

  // GET /coupons/admin - Lấy tất cả coupons
  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.couponsService.findAll();
  }

  // GET /coupons/admin/:id - Lấy chi tiết coupon
  @Get('admin/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  // POST /coupons/admin - Tạo coupon mới
  @Post('admin')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  // PATCH /coupons/admin/:id - Cập nhật coupon
  @Patch('admin/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    return this.couponsService.update(id, dto);
  }

  // DELETE /coupons/admin/:id - Xóa coupon
  @Delete('admin/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
