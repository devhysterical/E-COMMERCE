import { BannersService } from './banners.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
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
    create(createBannerDto: CreateBannerDto): Promise<{
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
    update(id: string, updateBannerDto: UpdateBannerDto): Promise<{
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
