import {
  IsString,
  IsDateString,
  IsArray,
  ValidateNested,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class FlashSaleItemDto {
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

export class CreateFlashSaleDto {
  @IsString()
  name: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlashSaleItemDto)
  items: FlashSaleItemDto[];
}
