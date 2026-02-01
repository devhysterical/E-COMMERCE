import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @MinLength(1)
  label: string; // "Home", "Office", "Other"

  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  @MinLength(1)
  phone: string;

  @IsString()
  @MinLength(1)
  province: string;

  @IsString()
  @MinLength(1)
  district: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsString()
  @MinLength(1)
  street: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
