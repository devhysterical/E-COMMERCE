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
    create(createBannerDto: CreateBannerDto): Promise<{
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
    update(id: string, updateBannerDto: UpdateBannerDto): Promise<{
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
