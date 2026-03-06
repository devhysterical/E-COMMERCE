import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class QueryNotificationDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
