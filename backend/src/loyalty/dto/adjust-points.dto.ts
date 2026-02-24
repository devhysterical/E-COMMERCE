import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class AdjustPointsDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsInt()
  points: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
