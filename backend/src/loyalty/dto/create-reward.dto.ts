import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateRewardDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  pointsCost: number;

  @IsNotEmpty()
  @IsString()
  rewardType: string; // COUPON | FREE_SHIPPING

  @IsOptional()
  @IsInt()
  couponValue?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
