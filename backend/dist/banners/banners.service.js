"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BannersService", {
    enumerable: true,
    get: function() {
        return BannersService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let BannersService = class BannersService {
    // Public: Lấy danh sách banners đang active
    async findAllActive() {
        return this.prisma.banner.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                sortOrder: 'asc'
            }
        });
    }
    // Admin: Lấy tất cả banners
    async findAll() {
        return this.prisma.banner.findMany({
            orderBy: {
                sortOrder: 'asc'
            }
        });
    }
    // Admin: Lấy một banner theo ID
    async findOne(id) {
        const banner = await this.prisma.banner.findUnique({
            where: {
                id
            }
        });
        if (!banner) {
            throw new _common.NotFoundException('Banner không tồn tại');
        }
        return banner;
    }
    // Admin: Tạo banner mới
    async create(dto) {
        return this.prisma.banner.create({
            data: dto
        });
    }
    // Admin: Cập nhật banner
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.banner.update({
            where: {
                id
            },
            data: dto
        });
    }
    // Admin: Xóa banner
    async remove(id) {
        await this.findOne(id);
        return this.prisma.banner.delete({
            where: {
                id
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
BannersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], BannersService);

//# sourceMappingURL=banners.service.js.map