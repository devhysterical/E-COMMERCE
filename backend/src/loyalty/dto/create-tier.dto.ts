import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateTierDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  minPoints: number;

  @IsOptional()
  @IsNumber()
  pointMultiplier?: number;

  @IsOptional()
  @IsString()
  benefits?: string;
}
