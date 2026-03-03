"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ContactService", {
    enumerable: true,
    get: function() {
        return ContactService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
const _emailservice = require("../email/email.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let ContactService = class ContactService {
    async create(dto) {
        const ticket = await this.prisma.contactTicket.create({
            data: dto
        });
        // Gửi email thông báo cho admin (không throw nếu lỗi)
        try {
            await this.emailService.sendContactNotificationEmail(ticket);
        } catch (error) {
            console.error('[CONTACT] Gửi email thông báo thất bại:', error);
        }
        return {
            message: 'Yêu cầu hỗ trợ đã được gửi thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.',
            ticketId: ticket.id
        };
    }
    async findAll(query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = query.status ? {
            status: query.status
        } : {};
        const [tickets, total] = await Promise.all([
            this.prisma.contactTicket.findMany({
                where,
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            this.prisma.contactTicket.count({
                where
            })
        ]);
        return {
            data: tickets,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async findOne(id) {
        return this.prisma.contactTicket.findUnique({
            where: {
                id
            }
        });
    }
    async updateStatus(id, dto) {
        return this.prisma.contactTicket.update({
            where: {
                id
            },
            data: dto
        });
    }
    constructor(prisma, emailService){
        this.prisma = prisma;
        this.emailService = emailService;
    }
};
ContactService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService,
        typeof _emailservice.EmailService === "undefined" ? Object : _emailservice.EmailService
    ])
], ContactService);

//# sourceMappingURL=contact.service.js.map