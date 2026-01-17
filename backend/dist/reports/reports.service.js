"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReportsService", {
    enumerable: true,
    get: function() {
        return ReportsService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
const _exceljs = /*#__PURE__*/ _interop_require_wildcard(require("exceljs"));
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
let ReportsService = class ReportsService {
    // Export Orders to Excel
    async exportOrders(startDate, endDate) {
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = startDate;
            }
            if (endDate) {
                where.createdAt.lte = endDate;
            }
        }
        const orders = await this.prisma.order.findMany({
            where,
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true
                    }
                },
                orderItems: {
                    include: {
                        product: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        const workbook = new _exceljs.Workbook();
        workbook.creator = 'E-Commerce Admin';
        workbook.created = new Date();
        const sheet = workbook.addWorksheet('Đơn hàng');
        // Headers
        sheet.columns = [
            {
                header: 'Mã đơn',
                key: 'id',
                width: 36
            },
            {
                header: 'Khách hàng',
                key: 'customer',
                width: 25
            },
            {
                header: 'Email',
                key: 'email',
                width: 30
            },
            {
                header: 'Sản phẩm',
                key: 'products',
                width: 40
            },
            {
                header: 'Tổng tiền',
                key: 'total',
                width: 15
            },
            {
                header: 'Giảm giá',
                key: 'discount',
                width: 12
            },
            {
                header: 'Trạng thái',
                key: 'status',
                width: 15
            },
            {
                header: 'Thanh toán',
                key: 'payment',
                width: 12
            },
            {
                header: 'Địa chỉ',
                key: 'address',
                width: 35
            },
            {
                header: 'Ngày đặt',
                key: 'date',
                width: 18
            }
        ];
        // Style header
        sheet.getRow(1).font = {
            bold: true
        };
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FF4F46E5'
            }
        };
        sheet.getRow(1).font = {
            bold: true,
            color: {
                argb: 'FFFFFFFF'
            }
        };
        // Data rows
        const statusLabels = {
            PENDING: 'Chờ xử lý',
            PROCESSING: 'Đang xử lý',
            SHIPPED: 'Đang giao',
            DELIVERED: 'Đã giao',
            CANCELLED: 'Đã hủy'
        };
        orders.forEach((order)=>{
            const products = order.orderItems.map((item)=>`${item.product.name} x${item.quantity}`).join(', ');
            sheet.addRow({
                id: order.id,
                customer: order.user?.fullName || 'N/A',
                email: order.user?.email || 'N/A',
                products,
                total: order.totalAmount,
                discount: order.discountAmount || 0,
                status: statusLabels[order.status] || order.status,
                payment: order.paymentMethod,
                address: order.address,
                date: new Date(order.createdAt).toLocaleDateString('vi-VN')
            });
        });
        // Auto-fit và thêm border
        sheet.eachRow((row, rowNumber)=>{
            row.eachCell((cell)=>{
                cell.border = {
                    top: {
                        style: 'thin'
                    },
                    left: {
                        style: 'thin'
                    },
                    bottom: {
                        style: 'thin'
                    },
                    right: {
                        style: 'thin'
                    }
                };
                if (rowNumber > 1) {
                    cell.alignment = {
                        vertical: 'middle',
                        wrapText: true
                    };
                }
            });
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return new _common.StreamableFile(Buffer.from(buffer), {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            disposition: `attachment; filename="orders_${Date.now()}.xlsx"`
        });
    }
    // Export Products Inventory to Excel
    async exportProducts() {
        const products = await this.prisma.product.findMany({
            where: {
                deletedAt: null
            },
            include: {
                category: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
        const workbook = new _exceljs.Workbook();
        workbook.creator = 'E-Commerce Admin';
        workbook.created = new Date();
        const sheet = workbook.addWorksheet('Tồn kho sản phẩm');
        // Headers
        sheet.columns = [
            {
                header: 'Mã sản phẩm',
                key: 'id',
                width: 36
            },
            {
                header: 'Tên sản phẩm',
                key: 'name',
                width: 40
            },
            {
                header: 'Danh mục',
                key: 'category',
                width: 20
            },
            {
                header: 'Giá (đ)',
                key: 'price',
                width: 15
            },
            {
                header: 'Tồn kho',
                key: 'stock',
                width: 12
            },
            {
                header: 'Trạng thái',
                key: 'status',
                width: 15
            },
            {
                header: 'Ngày tạo',
                key: 'createdAt',
                width: 18
            }
        ];
        // Style header
        sheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FF4F46E5'
            }
        };
        sheet.getRow(1).font = {
            bold: true,
            color: {
                argb: 'FFFFFFFF'
            }
        };
        // Data rows
        products.forEach((product)=>{
            const row = sheet.addRow({
                id: product.id,
                name: product.name,
                category: product.category?.name || 'N/A',
                price: product.price,
                stock: product.stock,
                status: product.stock === 0 ? 'Hết hàng' : product.stock <= 10 ? 'Sắp hết' : 'Còn hàng',
                createdAt: new Date(product.createdAt).toLocaleDateString('vi-VN')
            });
            // Highlight low stock
            if (product.stock <= 10) {
                row.getCell('stock').fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: product.stock === 0 ? 'FFFECACA' : 'FFFEF3C7'
                    }
                };
            }
        });
        // Add borders
        sheet.eachRow((row)=>{
            row.eachCell((cell)=>{
                cell.border = {
                    top: {
                        style: 'thin'
                    },
                    left: {
                        style: 'thin'
                    },
                    bottom: {
                        style: 'thin'
                    },
                    right: {
                        style: 'thin'
                    }
                };
            });
        });
        const buffer = await workbook.xlsx.writeBuffer();
        return new _common.StreamableFile(Buffer.from(buffer), {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            disposition: `attachment; filename="products_inventory_${Date.now()}.xlsx"`
        });
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
ReportsService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], ReportsService);

//# sourceMappingURL=reports.service.js.map