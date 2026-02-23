import { IsString, IsInt, IsOptional, Min } from 'class-validator';

export class AddFlashSaleItemDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  salePrice: number;

  @IsInt()
  @Min(1)
  saleQty: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  limitPerUser?: number;
}
