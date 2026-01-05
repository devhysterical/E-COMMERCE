export declare class SupabaseService {
    private supabase;
    constructor();
    uploadImage(bucket: string, file: Buffer, fileName: string, contentType: string): Promise<{
        url: string;
    }>;
    deleteImage(bucket: string, path: string): Promise<void>;
}
