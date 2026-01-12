export declare class SupabaseService {
    private supabase;
    constructor();
    uploadImage(bucket: string, file: Buffer, fileName: string, contentType: string): Promise<{
        url: string;
    }>;
    deleteImage(bucket: string, path: string): Promise<void>;
    sendPasswordResetEmail(email: string, redirectUrl: string): Promise<void>;
    getUserFromAccessToken(accessToken: string): Promise<{
        id: string;
        email: string;
        fullName: string | null;
        avatarUrl: string | null;
    } | null>;
    sendOtpEmail(email: string, otp: string): Promise<void>;
}
