import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateShippingZoneDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  fee: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minOrderFree?: number;

  @IsOptional()
  @IsString()
  estimatedDays?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
