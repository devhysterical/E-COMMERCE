"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NotificationsService", {
    enumerable: true,
    get: function() {
        return NotificationsService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
const _client = require("@prisma/client");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let NotificationsService = class NotificationsService {
    async create(dto) {
        return await this.prisma.notification.create({
            data: {
                userId: dto.userId,
                type: dto.type,
                title: dto.title,
                message: dto.message,
                metadata: dto.metadata ?? _client.Prisma.JsonNull
            }
        });
    }
    /** Tạo notification cho tất cả admin */ async createForAdmins(dto) {
        const admins = await this.prisma.user.findMany({
            where: {
                role: 'ADMIN',
                deletedAt: null
            },
            select: {
                id: true
            }
        });
        const data = admins.map((admin)=>({
                userId: admin.id,
                type: dto.type,
                title: dto.title,
                message: dto.message,
                metadata: dto.metadata ?? _client.Prisma.JsonNull
            }));
        return await this.prisma.notification.createMany({
            data
        });
    }
    async findAll(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.notification.findMany({
                where: {
                    userId
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            this.prisma.notification.count({
                where: {
                    userId
                }
            })
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async getUnreadCount(userId) {
        const count = await this.prisma.notification.count({
            where: {
                userId,
                isRead: false
            }
        });
        return {
            count
        };
    }
    async markAsRead(id, userId) {
        return await this.prisma.notification.updateMany({
            where: {
                id,
                userId
            },
            data: {
                isRead: true
            }
        });
    }
    async markAllAsRead(userId) {
        return await this.prisma.notification.updateMany({
            where: {
                userId,
                isRead: false
            },
            data: {
                isRead: true
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
NotificationsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], NotificationsService);

//# sourceMappingURL=notifications.service.js.map