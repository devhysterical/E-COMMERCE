"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsersService", {
    enumerable: true,
    get: function() {
        return UsersService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
const _bcrypt = /*#__PURE__*/ _interop_require_wildcard(require("bcrypt"));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UsersService = class UsersService {
    async findOne(email) {
        return this.prisma.user.findUnique({
            where: {
                email
            }
        });
    }
    async create(data) {
        return this.prisma.user.create({
            data
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }
    async updateProfile(userId, dto) {
        const user = await this.findById(userId);
        if (!user) {
            throw new _common.NotFoundException('Người dùng không tồn tại');
        }
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                fullName: dto.fullName,
                phone: dto.phone,
                address: dto.address,
                dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
                avatarUrl: dto.avatarUrl
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = updatedUser;
        return result;
    }
    async changePassword(userId, dto) {
        const user = await this.findById(userId);
        if (!user) {
            throw new _common.NotFoundException('Người dùng không tồn tại');
        }
        const isPasswordValid = await _bcrypt.compare(dto.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new _common.NotFoundException('Mật khẩu hiện tại không đúng');
        }
        const hashedPassword = await _bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: hashedPassword
            }
        });
        return {
            message: 'Đổi mật khẩu thành công'
        };
    }
    async getProfile(userId) {
        const user = await this.findById(userId);
        if (!user) {
            throw new _common.NotFoundException('Người dùng không tồn tại');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
    }
    async findAll() {
        return this.prisma.user.findMany({
            where: {
                deletedAt: null
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async updateRole(userId, role) {
        const user = await this.findById(userId);
        if (!user) {
            throw new _common.NotFoundException('Người dùng không tồn tại');
        }
        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                role
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                createdAt: true
            }
        });
        return updatedUser;
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
UsersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], UsersService);

//# sourceMappingURL=users.service.js.map