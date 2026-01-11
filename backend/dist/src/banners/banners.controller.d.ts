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
        title: string;
        linkUrl: string | null;
        isActive: boolean;
        sortOrder: number;
    }[]>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        title: string;
        linkUrl: string | null;
        isActive: boolean;
        sortOrder: number;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        title: string;
        linkUrl: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
    create(createBannerDto: CreateBannerDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        title: string;
        linkUrl: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
    update(id: string, updateBannerDto: UpdateBannerDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        title: string;
        linkUrl: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        imageUrl: string;
        title: string;
        linkUrl: string | null;
        isActive: boolean;
        sortOrder: number;
    }>;
}
