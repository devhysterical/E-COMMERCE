import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: { user: { sub: string } },
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(req.user.sub, dto);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @Get('product/:productId/stats')
  getProductStats(@Param('productId') productId: string) {
    return this.reviewsService.getProductStats(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req: { user: { sub: string; role: string } },
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, req.user.sub, req.user.role, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req: { user: { sub: string; role: string } },
  ) {
    return this.reviewsService.remove(id, req.user.sub, req.user.role);
  }
}
