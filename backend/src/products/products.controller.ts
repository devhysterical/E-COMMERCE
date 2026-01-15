import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: 'price' | 'name' | 'createdAt',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.productsService.findAll(
      categoryId,
      search,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 12,
      sortBy || 'createdAt',
      sortOrder || 'desc',
      minPrice ? parseInt(minPrice, 10) : undefined,
      maxPrice ? parseInt(maxPrice, 10) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // ===== Product Images Endpoints =====

  @Get(':id/images')
  getImages(@Param('id') id: string) {
    return this.productsService.getImages(id);
  }

  @Post(':id/images')
  @Roles(Role.ADMIN)
  addImage(
    @Param('id') id: string,
    @Body() body: { imageUrl: string; isPrimary?: boolean },
  ) {
    return this.productsService.addImage(id, body.imageUrl, body.isPrimary);
  }

  @Delete(':id/images/:imageId')
  @Roles(Role.ADMIN)
  removeImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.productsService.removeImage(id, imageId);
  }

  @Patch(':id/images/:imageId/primary')
  @Roles(Role.ADMIN)
  setPrimaryImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.productsService.setPrimaryImage(id, imageId);
  }
}
