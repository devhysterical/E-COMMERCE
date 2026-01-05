import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: ReturnType<typeof createClient>;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        'Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_KEY trong .env',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  async uploadImage(
    bucket: string,
    file: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<{ url: string }> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw new Error(`Lỗi upload: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(bucket).getPublicUrl(data.path);

    return { url: publicUrl };
  }

  async deleteImage(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw new Error(`Lỗi xóa file: ${error.message}`);
    }
  }
}
