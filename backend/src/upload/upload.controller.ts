import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SupabaseService } from '../supabase/supabase.service';
import { randomUUID } from 'crypto';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface UploadedFileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('image')
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: UploadedFileType) {
    if (!file) {
      throw new BadRequestException('Không tìm thấy file');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Định dạng file không hợp lệ. Chỉ chấp nhận JPEG, PNG, WebP, GIF',
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File quá lớn. Tối đa 5MB');
    }

    // Tạo tên file unique
    const nameParts = file.originalname.split('.');
    const ext = nameParts.length > 1 ? nameParts.pop() : 'jpg';
    const fileName = `products/${randomUUID()}.${ext}`;

    const result = await this.supabaseService.uploadImage(
      'products',
      file.buffer,
      fileName,
      file.mimetype,
    );

    return result;
  }
}
