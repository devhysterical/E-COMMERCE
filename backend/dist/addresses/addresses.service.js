"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddressesService", {
    enumerable: true,
    get: function() {
        return AddressesService;
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
let AddressesService = class AddressesService {
    async findAll(userId) {
        return this.prisma.address.findMany({
            where: {
                userId
            },
            orderBy: [
                {
                    isDefault: 'desc'
                },
                {
                    createdAt: 'desc'
                }
            ]
        });
    }
    async findOne(id, userId) {
        const address = await this.prisma.address.findFirst({
            where: {
                id,
                userId
            }
        });
        if (!address) {
            throw new _common.NotFoundException('Địa chỉ không tồn tại');
        }
        return address;
    }
    async create(userId, dto) {
        // If this is the first address or marked as default, handle default logic
        if (dto.isDefault) {
            await this.clearDefaultAddress(userId);
        }
        // Check if this is the first address
        const existingCount = await this.prisma.address.count({
            where: {
                userId
            }
        });
        const isDefault = dto.isDefault || existingCount === 0;
        return this.prisma.address.create({
            data: {
                ...dto,
                userId,
                isDefault
            }
        });
    }
    async update(id, userId, dto) {
        await this.findOne(id, userId);
        // If setting as default, clear other defaults first
        if (dto.isDefault) {
            await this.clearDefaultAddress(userId);
        }
        return this.prisma.address.update({
            where: {
                id
            },
            data: dto
        });
    }
    async remove(id, userId) {
        const address = await this.findOne(id, userId);
        await this.prisma.address.delete({
            where: {
                id
            }
        });
        // If deleted address was default, set another as default
        if (address.isDefault) {
            const nextAddress = await this.prisma.address.findFirst({
                where: {
                    userId
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            if (nextAddress) {
                await this.prisma.address.update({
                    where: {
                        id: nextAddress.id
                    },
                    data: {
                        isDefault: true
                    }
                });
            }
        }
        return {
            message: 'Đã xóa địa chỉ'
        };
    }
    async setDefault(id, userId) {
        await this.findOne(id, userId);
        await this.clearDefaultAddress(userId);
        return this.prisma.address.update({
            where: {
                id
            },
            data: {
                isDefault: true
            }
        });
    }
    async clearDefaultAddress(userId) {
        await this.prisma.address.updateMany({
            where: {
                userId,
                isDefault: true
            },
            data: {
                isDefault: false
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
AddressesService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], AddressesService);

//# sourceMappingURL=addresses.service.js.map