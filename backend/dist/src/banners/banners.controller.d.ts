import { BannersService } from './banners.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
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
    create(createBannerDto: CreateBannerDto): Promise<{
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
    update(id: string, updateBannerDto: UpdateBannerDto): Promise<{
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
