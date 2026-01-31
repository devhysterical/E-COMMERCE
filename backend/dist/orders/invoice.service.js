"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InvoiceService", {
    enumerable: true,
    get: function() {
        return InvoiceService;
    }
});
const _common = require("@nestjs/common");
const _prismaservice = require("../prisma/prisma.service");
const _pdfkit = /*#__PURE__*/ _interop_require_default(require("pdfkit"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
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
let InvoiceService = class InvoiceService {
    async generateInvoice(orderId, userId, res) {
        // Lấy thông tin đơn hàng
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                userId,
                deletedAt: null
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        phone: true
                    }
                },
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        }
                    }
                },
                coupon: {
                    select: {
                        code: true,
                        discountType: true,
                        discountValue: true
                    }
                }
            }
        });
        if (!order) {
            throw new _common.NotFoundException('Đơn hàng không tồn tại');
        }
        // Tạo PDF document
        const doc = new _pdfkit.default({
            size: 'A4',
            margin: 50,
            info: {
                Title: `Hóa đơn #${orderId.slice(0, 8).toUpperCase()}`,
                Author: 'L-TECH Solutions'
            }
        });
        // Set response headers
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="invoice-${orderId.slice(0, 8)}.pdf"`
        });
        // Pipe PDF to response
        doc.pipe(res);
        // ========== HEADER ==========
        doc.fontSize(24).font('Helvetica-Bold').fillColor('#4F46E5').text('L-TECH SOLUTIONS', 50, 50);
        doc.fontSize(10).font('Helvetica').fillColor('#64748B').text('Premium Electronics & Technology', 50, 80);
        // Invoice title
        doc.fontSize(28).font('Helvetica-Bold').fillColor('#1E293B').text('HOA DON', 400, 50, {
            align: 'right'
        });
        doc.fontSize(12).font('Helvetica').fillColor('#64748B').text(`#${orderId.slice(0, 8).toUpperCase()}`, 400, 85, {
            align: 'right'
        });
        // Divider
        doc.moveTo(50, 110).lineTo(545, 110).stroke('#E2E8F0');
        // ========== ORDER INFO ==========
        const infoY = 130;
        // Left column - Customer info
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#64748B').text('KHACH HANG:', 50, infoY);
        doc.fontSize(11).font('Helvetica').fillColor('#1E293B').text(order.user?.fullName || 'N/A', 50, infoY + 15).text(order.user?.email || '', 50, infoY + 30).text(order.phone || '', 50, infoY + 45);
        // Right column - Order info
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#64748B').text('THONG TIN DON HANG:', 350, infoY);
        const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        doc.fontSize(11).font('Helvetica').fillColor('#1E293B').text(`Ngay dat: ${orderDate}`, 350, infoY + 15).text(`Trang thai: ${this.getStatusLabel(order.status)}`, 350, infoY + 30).text(`Thanh toan: ${order.paymentMethod === 'COD' ? 'COD' : 'MoMo'}`, 350, infoY + 45);
        // Shipping address
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#64748B').text('DIA CHI GIAO HANG:', 50, infoY + 75);
        doc.fontSize(11).font('Helvetica').fillColor('#1E293B').text(order.address, 50, infoY + 90, {
            width: 300
        });
        // ========== ORDER ITEMS TABLE ==========
        const tableTop = 280;
        // Table header
        doc.rect(50, tableTop, 495, 25).fill('#F1F5F9');
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#475569').text('SAN PHAM', 60, tableTop + 8).text('SO LUONG', 320, tableTop + 8, {
            width: 70,
            align: 'center'
        }).text('DON GIA', 390, tableTop + 8, {
            width: 70,
            align: 'right'
        }).text('THANH TIEN', 460, tableTop + 8, {
            width: 75,
            align: 'right'
        });
        // Table rows
        let rowY = tableTop + 35;
        let subtotal = 0;
        for (const item of order.orderItems){
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            doc.fontSize(10).font('Helvetica').fillColor('#1E293B').text(item.product.name, 60, rowY, {
                width: 250
            }).text(item.quantity.toString(), 320, rowY, {
                width: 70,
                align: 'center'
            }).text(this.formatPrice(item.price), 390, rowY, {
                width: 70,
                align: 'right'
            }).text(this.formatPrice(itemTotal), 460, rowY, {
                width: 75,
                align: 'right'
            });
            rowY += 25;
            // Draw row separator
            doc.moveTo(50, rowY - 5).lineTo(545, rowY - 5).stroke('#E2E8F0');
        }
        // ========== TOTALS ==========
        const totalsY = rowY + 20;
        // Subtotal
        doc.fontSize(10).font('Helvetica').fillColor('#64748B').text('Tam tinh:', 380, totalsY).fillColor('#1E293B').text(this.formatPrice(subtotal), 460, totalsY, {
            width: 75,
            align: 'right'
        });
        // Discount (if any)
        if (order.discountAmount > 0) {
            doc.fontSize(10).font('Helvetica').fillColor('#64748B').text('Giam gia:', 380, totalsY + 20).fillColor('#22C55E').text(`-${this.formatPrice(order.discountAmount)}`, 460, totalsY + 20, {
                width: 75,
                align: 'right'
            });
        }
        // Shipping
        doc.fontSize(10).font('Helvetica').fillColor('#64748B').text('Phi van chuyen:', 380, totalsY + (order.discountAmount > 0 ? 40 : 20)).fillColor('#22C55E').text('Mien phi', 460, totalsY + (order.discountAmount > 0 ? 40 : 20), {
            width: 75,
            align: 'right'
        });
        // Total
        const totalLineY = totalsY + (order.discountAmount > 0 ? 70 : 50);
        doc.moveTo(350, totalLineY).lineTo(545, totalLineY).stroke('#E2E8F0');
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#1E293B').text('TONG CONG:', 380, totalLineY + 10).fillColor('#4F46E5').text(this.formatPrice(order.totalAmount), 460, totalLineY + 10, {
            width: 75,
            align: 'right'
        });
        // ========== FOOTER ==========
        const footerY = 750;
        doc.moveTo(50, footerY).lineTo(545, footerY).stroke('#E2E8F0');
        doc.fontSize(9).font('Helvetica').fillColor('#94A3B8').text('Cam on quy khach da mua hang tai L-TECH Solutions!', 50, footerY + 15, {
            align: 'center',
            width: 495
        }).text('Moi thac mac xin lien he: support@ltech.vn | Hotline: 1900-xxxx', 50, footerY + 30, {
            align: 'center',
            width: 495
        });
        // Finalize PDF
        doc.end();
    }
    formatPrice(amount) {
        return new Intl.NumberFormat('vi-VN').format(amount) + ' d';
    }
    getStatusLabel(status) {
        const labels = {
            PENDING: 'Cho xu ly',
            PROCESSING: 'Dang xu ly',
            SHIPPED: 'Dang giao',
            DELIVERED: 'Da giao',
            CANCELLED: 'Da huy'
        };
        return labels[status] || status;
    }
    constructor(prisma){
        this.prisma = prisma;
    }
};
InvoiceService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _prismaservice.PrismaService === "undefined" ? Object : _prismaservice.PrismaService
    ])
], InvoiceService);

//# sourceMappingURL=invoice.service.js.map