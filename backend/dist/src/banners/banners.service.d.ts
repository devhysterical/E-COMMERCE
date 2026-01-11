import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
export declare class BannersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllActive(): Promise<{
        id: string;
        title: string;
        description: string | null;
        imageUrl: string;
        linkUrl: string | null;
        isActive: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findAll(): Promise<{
        id: string;
        title: string;
        description: string | null;
        imageUrl: string;
        linkUrl: string | null;
        isActive: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        imageUrl: string;
        linkUrl: string | null;
        isActive: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateBannerDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        imageUrl: string;
        linkUrl: string | null;
        isActive: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateBannerDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        imageUrl: string;
        linkUrl: string | null;
        isActive: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        imageUrl: string;
        linkUrl: string | null;
        isActive: boolean;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
