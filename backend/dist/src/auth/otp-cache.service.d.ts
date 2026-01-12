export declare class OtpCacheService {
    private cache;
    private readonly TTL_MS;
    generateOtp(): string;
    set(email: string, otp: string): void;
    get(email: string): string | null;
    verify(email: string, otp: string): boolean;
    delete(email: string): void;
    canResend(email: string): {
        canResend: boolean;
        waitSeconds: number;
    };
}
