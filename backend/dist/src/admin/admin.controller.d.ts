import { UsersService } from '../users/users.service';
declare class UpdateRoleDto {
    role: 'USER' | 'ADMIN';
}
export declare class AdminController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<{
        id: string;
        email: string;
        fullName: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
    updateUserRole(id: string, dto: UpdateRoleDto): Promise<{
        id: string;
        email: string;
        fullName: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
}
export {};
