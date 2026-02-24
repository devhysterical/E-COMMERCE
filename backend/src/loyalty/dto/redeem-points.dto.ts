import { IsNotEmpty, IsString } from 'class-validator';

export class RedeemPointsDto {
  @IsNotEmpty()
  @IsString()
  rewardId: string;
}
