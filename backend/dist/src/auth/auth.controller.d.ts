import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, ForgotPasswordDto, GoogleAuthDto } from './dto/auth.dto';
import { SendOtpDto } from './dto/otp.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    sendOtp(dto: SendOtpDto): Promise<{
        message: string;
    }>;
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        fullName: string | null;
        phone: string | null;
        address: string | null;
        dateOfBirth: Date | null;
        avatarUrl: string | null;
        authProvider: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            fullName: string | null;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    googleAuth(dto: GoogleAuthDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            fullName: string | null;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
}
