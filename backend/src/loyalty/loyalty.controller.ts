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
import { LoyaltyService } from './loyalty.service';
import { RedeemPointsDto } from './dto/redeem-points.dto';
import { AdjustPointsDto } from './dto/adjust-points.dto';
import { CreateTierDto } from './dto/create-tier.dto';
import { UpdateTierDto } from './dto/update-tier.dto';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('loyalty')
@UseGuards(JwtAuthGuard)
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  // --- User endpoints ---

  @Get('balance')
  getBalance(@Request() req: { user: { sub: string } }) {
    return this.loyaltyService.getBalance(req.user.sub);
  }

  @Get('history')
  getHistory(@Request() req: { user: { sub: string } }) {
    return this.loyaltyService.getHistory(req.user.sub);
  }

  @Get('rewards')
  getActiveRewards() {
    return this.loyaltyService.getActiveRewards();
  }

  @Get('tiers')
  getTiers() {
    return this.loyaltyService.getAllTiers();
  }

  @Post('redeem')
  redeem(
    @Request() req: { user: { sub: string } },
    @Body() dto: RedeemPointsDto,
  ) {
    return this.loyaltyService.redeemPoints(req.user.sub, dto.rewardId);
  }

  // --- Admin endpoints ---

  @Get('admin/tiers')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminGetTiers() {
    return this.loyaltyService.getAllTiers();
  }

  @Post('admin/tiers')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminCreateTier(@Body() dto: CreateTierDto) {
    return this.loyaltyService.createTier(dto);
  }

  @Patch('admin/tiers/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminUpdateTier(@Param('id') id: string, @Body() dto: UpdateTierDto) {
    return this.loyaltyService.updateTier(id, dto);
  }

  @Delete('admin/tiers/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminDeleteTier(@Param('id') id: string) {
    return this.loyaltyService.deleteTier(id);
  }

  @Get('admin/rewards')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminGetRewards() {
    return this.loyaltyService.getAllRewards();
  }

  @Post('admin/rewards')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminCreateReward(@Body() dto: CreateRewardDto) {
    return this.loyaltyService.createReward(dto);
  }

  @Patch('admin/rewards/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminUpdateReward(@Param('id') id: string, @Body() dto: UpdateRewardDto) {
    return this.loyaltyService.updateReward(id, dto);
  }

  @Delete('admin/rewards/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminDeleteReward(@Param('id') id: string) {
    return this.loyaltyService.deleteReward(id);
  }

  @Post('admin/adjust')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminAdjustPoints(@Body() dto: AdjustPointsDto) {
    return this.loyaltyService.adjustPoints(dto);
  }

  @Get('admin/users')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  adminGetUsersWithPoints() {
    return this.loyaltyService.getUsersWithPoints();
  }
}
