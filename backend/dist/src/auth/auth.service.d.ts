import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SupabaseService } from '../supabase/supabase.service';
import { EmailService } from '../email/email.service';
import { OtpCacheService } from './otp-cache.service';
import { LoginDto, RegisterDto, ForgotPasswordDto, GoogleAuthDto } from './dto/auth.dto';
import { SendOtpDto } from './dto/otp.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    private supabaseService;
    private emailService;
    private otpCacheService;
    constructor(usersService: UsersService, jwtService: JwtService, supabaseService: SupabaseService, emailService: EmailService, otpCacheService: OtpCacheService);
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
