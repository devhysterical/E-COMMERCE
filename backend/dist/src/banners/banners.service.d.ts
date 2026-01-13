import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
export declare class BannersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllActive(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        title: string;
        linkUrl: string | null;
    }[]>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        title: string;
        linkUrl: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        title: string;
        linkUrl: string | null;
    }>;
    create(dto: CreateBannerDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        title: string;
        linkUrl: string | null;
    }>;
    update(id: string, dto: UpdateBannerDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        title: string;
        linkUrl: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        title: string;
        linkUrl: string | null;
    }>;
}
