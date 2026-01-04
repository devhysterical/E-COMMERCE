import { UsersService } from './users.service';
import type { UpdateProfileDto, ChangePasswordDto } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: {
        user: {
            sub: string;
        };
    }): Promise<{
        id: string;
        email: string;
        fullName: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    updateProfile(req: {
        user: {
            sub: string;
        };
    }, dto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        fullName: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    changePassword(req: {
        user: {
            sub: string;
        };
    }, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
