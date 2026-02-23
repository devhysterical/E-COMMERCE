import { IsString, IsDateString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateFlashSaleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
