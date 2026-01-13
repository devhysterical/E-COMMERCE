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
        title: string;
        linkUrl: string | null;
        isActive: boolean;
    }[]>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        sortOrder: number;
        title: string;
        linkUrl: string | null;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        sortOrder: number;
        title: string;
        linkUrl: string | null;
        isActive: boolean;
    }>;
    create(dto: CreateBannerDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        sortOrder: number;
        title: string;
        linkUrl: string | null;
        isActive: boolean;
    }>;
    update(id: string, dto: UpdateBannerDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        sortOrder: number;
        title: string;
        linkUrl: string | null;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        sortOrder: number;
        title: string;
        linkUrl: string | null;
        isActive: boolean;
    }>;
}
