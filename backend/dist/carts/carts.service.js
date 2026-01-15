"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CartsService", {
    enumerable: true,
    get: function() {
        return CartsService;
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
let CartsService = class CartsService {
    async getCart(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: {
                userId
            },
            include: {
                cartItems: {
                    include: {
                        product: true
                    }
                }
            }
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    userId
                },
                include: {
                    cartItems: {
                        include: {
                            product: true
                        }
                    }
                }
            });
        }
        return cart;
    }
    async addToCart(userId, productId, quantity) {
        const cart = await this.getCart(userId);
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        });
        if (existingItem) {
            return this.prisma.cartItem.update({
                where: {
                    id: existingItem.id
                },
                data: {
                    quantity: existingItem.quantity + quantity
                }
            });
        }
        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity
            }
        });
    }
    async updateQuantity(itemId, quantity) {
        if (quantity <= 0) {
            return this.prisma.cartItem.delete({
                where: {
                    id: itemId
                }
            });
        }
        return this.prisma.cartItem.update({
            where: {
                id: itemId
            },
            data: {
                quantity
            }
        });
    }
    async removeItem(itemId) {
        return this.prisma.cartItem.delete({
            where: {
                id: itemId
            }
        });
    }
    async clearCart(userId) {
        const cart = await this.getCart(userId);
        return this.prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id
            }
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
CartsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], CartsService);

//# sourceMappingURL=carts.service.js.map