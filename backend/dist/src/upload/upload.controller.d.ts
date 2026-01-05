import { SupabaseService } from '../supabase/supabase.service';
interface UploadedFileType {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}
export declare class UploadController {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    uploadImage(file: UploadedFileType): Promise<{
        url: string;
    }>;
}
export {};
