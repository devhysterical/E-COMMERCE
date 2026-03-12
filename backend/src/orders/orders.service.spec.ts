import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { CartsService } from '../carts/carts.service';
import { EmailService } from '../email/email.service';
import { ShippingService } from '../shipping/shipping.service';
import { FlashSaleService } from '../flash-sale/flash-sale.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderStatus, PaymentStatus } from '@prisma/client';

type TransactionClient = Record<string, Record<string, jest.Mock>>;
type TransactionFn = (tx: TransactionClient) => Promise<unknown>;

const mockPrisma = {
  order: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  },
  coupon: { findUnique: jest.fn() },
  couponUsage: { findUnique: jest.fn(), create: jest.fn() },
  $transaction: jest.fn(),
};

const mockCartsService = {
  getCart: jest.fn(),
};

const mockEmailService = {
  sendOrderConfirmationEmail: jest.fn(),
  sendOrderStatusUpdateEmail: jest.fn(),
};

const mockShippingService = {
  calculateFee: jest.fn(),
};

const mockFlashSaleService = {
  checkFlashSalePrice: jest.fn(),
  incrementSoldQty: jest.fn(),
};

const mockLoyaltyService = {
  earnPoints: jest.fn(),
};

const mockNotificationsService = {
  create: jest.fn(),
  createForAdmins: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CartsService, useValue: mockCartsService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: ShippingService, useValue: mockShippingService },
        { provide: FlashSaleService, useValue: mockFlashSaleService },
        { provide: LoyaltyService, useValue: mockLoyaltyService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  const mockOrder = {
    id: 'order-1',
    userId: 'user-1',
    totalAmount: 300000,
    discountAmount: 0,
    shippingFee: 0,
    status: 'PENDING' as OrderStatus,
    address: '123 Nguyễn Huệ',
    phone: '0901234567',
    deletedAt: null,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING' as PaymentStatus,
    orderItems: [
      {
        id: 'oi-1',
        orderId: 'order-1',
        productId: 'prod-1',
        quantity: 2,
        price: 150000,
        product: { id: 'prod-1', name: 'Áo thun', stock: 50 },
      },
    ],
    user: { id: 'user-1', email: 'test@example.com', fullName: 'Test' },
  };

  const mockCart = {
    id: 'cart-1',
    userId: 'user-1',
    cartItems: [
      {
        id: 'ci-1',
        cartId: 'cart-1',
        productId: 'prod-1',
        quantity: 2,
        product: { id: 'prod-1', name: 'Áo thun', price: 150000, stock: 50 },
      },
    ],
  };

  // ==================== CREATE ORDER ====================
  describe('createOrder', () => {
    it('should throw if cart is empty', async () => {
      mockCartsService.getCart.mockResolvedValue({
        id: 'cart-1',
        cartItems: [],
      });

      await expect(
        service.createOrder('user-1', '123 Đường ABC', '0901234567'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create order with COD payment', async () => {
      mockCartsService.getCart.mockResolvedValue(mockCart);
      mockFlashSaleService.checkFlashSalePrice.mockResolvedValue(null);

      const createdOrder = { ...mockOrder };
      mockPrisma.$transaction.mockImplementation(async (fn: TransactionFn) => {
        return await fn({
          order: { create: jest.fn().mockResolvedValue(createdOrder) },
          orderItem: { create: jest.fn() },
          product: {
            findUnique: jest
              .fn()
              .mockResolvedValue({ stock: 50, name: 'Áo thun' }),
            update: jest.fn(),
          },
          cartItem: { deleteMany: jest.fn() },
          user: {
            findUnique: jest.fn().mockResolvedValue({
              id: 'user-1',
              email: 'test@example.com',
            }),
          },
          couponUsage: { create: jest.fn() },
          coupon: { update: jest.fn() },
        });
      });

      const result = await service.createOrder(
        'user-1',
        '123 Nguyễn Huệ',
        '0901234567',
        'COD',
      );

      expect(result.id).toBe('order-1');
    });

    it('should apply shipping fee when province provided', async () => {
      mockCartsService.getCart.mockResolvedValue(mockCart);
      mockFlashSaleService.checkFlashSalePrice.mockResolvedValue(null);
      mockShippingService.calculateFee.mockResolvedValue({ fee: 30000 });

      mockPrisma.$transaction.mockImplementation(async (fn: TransactionFn) => {
        return await fn({
          order: {
            create: jest.fn().mockResolvedValue({
              ...mockOrder,
              shippingFee: 30000,
              totalAmount: 330000,
            }),
          },
          orderItem: { create: jest.fn() },
          product: {
            findUnique: jest
              .fn()
              .mockResolvedValue({ stock: 50, name: 'Áo thun' }),
            update: jest.fn(),
          },
          cartItem: { deleteMany: jest.fn() },
          user: { findUnique: jest.fn().mockResolvedValue(null) },
          couponUsage: { create: jest.fn() },
          coupon: { update: jest.fn() },
        });
      });

      const result = await service.createOrder(
        'user-1',
        '123 ABC',
        '0901234567',
        'COD',
        undefined,
        'Hà Nội',
      );

      expect(mockShippingService.calculateFee).toHaveBeenCalledWith(
        'Hà Nội',
        300000,
      );
      expect(result.shippingFee).toBe(30000);
    });
  });

  // ==================== FIND ALL ====================
  describe('findAll', () => {
    it('should return paginated user orders', async () => {
      mockPrisma.order.findMany.mockResolvedValue([mockOrder]);
      mockPrisma.order.count.mockResolvedValue(1);

      const result = await service.findAll('user-1');

      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1', deletedAt: null },
          skip: 0,
          take: 10,
        }),
      );
    });

    it('should respect page and limit params', async () => {
      mockPrisma.order.findMany.mockResolvedValue([]);
      mockPrisma.order.count.mockResolvedValue(25);

      const result = await service.findAll('user-1', 3, 5);

      expect(result.data).toHaveLength(0);
      expect(result.meta).toEqual({
        total: 25,
        page: 3,
        limit: 5,
        totalPages: 5,
      });
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 5,
        }),
      );
    });
  });

  // ==================== FIND ONE ====================
  describe('findOne', () => {
    it('should return a specific order', async () => {
      mockPrisma.order.findFirst.mockResolvedValue(mockOrder);

      const result = await service.findOne('order-1', 'user-1');

      expect(result).toEqual(mockOrder);
    });

    it('should return null if not found', async () => {
      mockPrisma.order.findFirst.mockResolvedValue(null);

      const result = await service.findOne('nonexistent', 'user-1');

      expect(result).toBeNull();
    });
  });

  // ==================== FIND ALL ADMIN ====================
  describe('findAllAdmin', () => {
    it('should return paginated orders for admin', async () => {
      mockPrisma.order.findMany.mockResolvedValue([mockOrder]);
      mockPrisma.order.count.mockResolvedValue(1);

      const result = await service.findAllAdmin();

      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      });
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { deletedAt: null },
          skip: 0,
          take: 20,
        }),
      );
    });

    it('should respect page and limit params', async () => {
      mockPrisma.order.findMany.mockResolvedValue([]);
      mockPrisma.order.count.mockResolvedValue(50);

      const result = await service.findAllAdmin(2, 15);

      expect(result.meta).toEqual({
        total: 50,
        page: 2,
        limit: 15,
        totalPages: 4,
      });
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 15,
          take: 15,
        }),
      );
    });
  });

  // ==================== UPDATE STATUS ====================
  describe('updateStatus', () => {
    it('should throw if order not found', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('nonexistent', OrderStatus.DELIVERED),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update status normally (non-cancelled)', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);
      mockPrisma.order.update.mockResolvedValue({
        ...mockOrder,
        status: 'SHIPPED' as OrderStatus,
        user: { id: 'user-1', email: 'test@example.com', fullName: 'Test' },
      });

      const result = await service.updateStatus('order-1', OrderStatus.SHIPPED);

      expect(result.status).toBe('SHIPPED');
    });

    it('should restore stock when cancelled', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(mockOrder);
      const cancelledOrder = {
        ...mockOrder,
        status: 'CANCELLED' as OrderStatus,
      };
      mockPrisma.$transaction.mockImplementation(async (fn: TransactionFn) => {
        return await fn({
          product: { update: jest.fn() },
          order: { update: jest.fn().mockResolvedValue(cancelledOrder) },
        });
      });

      const result = await service.updateStatus(
        'order-1',
        OrderStatus.CANCELLED,
      );

      expect(result.status).toBe('CANCELLED');
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });

  // ==================== GET STATS ====================
  describe('getStats', () => {
    it('should return order statistics', async () => {
      mockPrisma.order.count.mockResolvedValue(50);
      mockPrisma.order.aggregate.mockResolvedValue({
        _sum: { totalAmount: 5000000 },
      });
      mockPrisma.order.groupBy.mockResolvedValue([
        { status: 'PENDING', _count: { status: 10 } },
        { status: 'DELIVERED', _count: { status: 30 } },
      ]);

      const result = await service.getStats();

      expect(result.totalOrders).toBe(50);
      expect(result.totalRevenue).toBe(5000000);
      expect(result.ordersByStatus).toHaveProperty('PENDING', 10);
      expect(result.ordersByStatus).toHaveProperty('DELIVERED', 30);
    });

    it('should handle zero revenue', async () => {
      mockPrisma.order.count.mockResolvedValue(0);
      mockPrisma.order.aggregate.mockResolvedValue({
        _sum: { totalAmount: null },
      });
      mockPrisma.order.groupBy.mockResolvedValue([]);

      const result = await service.getStats();

      expect(result.totalOrders).toBe(0);
      expect(result.totalRevenue).toBe(0);
    });
  });

  // ==================== UPDATE PAYMENT STATUS ====================
  describe('updatePaymentStatus', () => {
    it('should update payment status', async () => {
      const updated = {
        ...mockOrder,
        paymentStatus: PaymentStatus.COMPLETED,
        momoTransId: 'MOMO123',
      };
      mockPrisma.order.update.mockResolvedValue(updated);

      const result = await service.updatePaymentStatus(
        'order-1',
        PaymentStatus.COMPLETED,
        'MOMO123',
      );

      expect(result.paymentStatus).toBe('COMPLETED');
      expect(mockPrisma.order.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: {
          paymentStatus: PaymentStatus.COMPLETED,
          momoTransId: 'MOMO123',
        },
      });
    });
  });
});
