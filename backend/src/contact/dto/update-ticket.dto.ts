import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { TicketStatus } from '@prisma/client';

export class UpdateTicketDto {
  @IsEnum(TicketStatus, { message: 'Trạng thái không hợp lệ' })
  @IsOptional()
  status?: TicketStatus;

  @IsString({ message: 'Ghi chú phải là chuỗi' })
  @IsOptional()
  @MaxLength(1000)
  adminNote?: string;
}
