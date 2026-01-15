"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CategoriesService", {
    enumerable: true,
    get: function() {
        return CategoriesService;
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
let CategoriesService = class CategoriesService {
    async create(dto) {
        return this.prisma.category.create({
            data: dto
        });
    }
    async findAll() {
        return this.prisma.category.findMany({
            where: {
                deletedAt: null
            },
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });
    }
    async findOne(id) {
        const category = await this.prisma.category.findFirst({
            where: {
                id,
                deletedAt: null
            }
        });
        if (!category) {
            throw new _common.NotFoundException('Không tìm thấy danh mục');
        }
        return category;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.category.update({
            where: {
                id
            },
            data: dto
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.category.update({
            where: {
                id
            },
            data: {
                deletedAt: new Date()
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
CategoriesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], CategoriesService);

//# sourceMappingURL=categories.service.js.map