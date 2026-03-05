import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  cart: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  cartItem: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
};

describe('CartsService', () => {
  let service: CartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CartsService>(CartsService);
    jest.clearAllMocks();
  });

  const mockCart = {
    id: 'cart-1',
    userId: 'user-1',
    cartItems: [],
    createdAt: new Date(),
  };

  const mockCartWithItems = {
    ...mockCart,
    cartItems: [
      {
        id: 'item-1',
        cartId: 'cart-1',
        productId: 'prod-1',
        quantity: 2,
        product: { id: 'prod-1', name: 'Sản phẩm A', price: 100000 },
      },
    ],
  };

  describe('getCart', () => {
    it('should return existing cart', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue(mockCartWithItems);

      const result = await service.getCart('user-1');

      expect(result).toEqual(mockCartWithItems);
      expect(mockPrisma.cart.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: { cartItems: { include: { product: true } } },
      });
    });

    it('should create new cart if not exists', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue(null);
      mockPrisma.cart.create.mockResolvedValue(mockCart);

      const result = await service.getCart('user-1');

      expect(result).toEqual(mockCart);
      expect(mockPrisma.cart.create).toHaveBeenCalledWith({
        data: { userId: 'user-1' },
        include: { cartItems: { include: { product: true } } },
      });
    });
  });

  describe('addToCart', () => {
    it('should update quantity if item already exists', async () => {
      const existingItem = {
        id: 'item-1',
        cartId: 'cart-1',
        productId: 'prod-1',
        quantity: 2,
      };
      mockPrisma.cart.findUnique.mockResolvedValue(mockCart);
      mockPrisma.cartItem.findFirst.mockResolvedValue(existingItem);
      mockPrisma.cartItem.update.mockResolvedValue({
        ...existingItem,
        quantity: 5,
      });

      const result = await service.addToCart('user-1', 'prod-1', 3);

      expect(result.quantity).toBe(5);
      expect(mockPrisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 'item-1' },
        data: { quantity: 5 },
      });
    });

    it('should create new item if not exists', async () => {
      const newItem = {
        id: 'item-2',
        cartId: 'cart-1',
        productId: 'prod-2',
        quantity: 1,
      };
      mockPrisma.cart.findUnique.mockResolvedValue(mockCart);
      mockPrisma.cartItem.findFirst.mockResolvedValue(null);
      mockPrisma.cartItem.create.mockResolvedValue(newItem);

      const result = await service.addToCart('user-1', 'prod-2', 1);

      expect(result).toEqual(newItem);
      expect(mockPrisma.cartItem.create).toHaveBeenCalledWith({
        data: { cartId: 'cart-1', productId: 'prod-2', quantity: 1 },
      });
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', async () => {
      const updated = { id: 'item-1', quantity: 5 };
      mockPrisma.cartItem.update.mockResolvedValue(updated);

      const result = await service.updateQuantity('item-1', 5);

      expect(result).toEqual(updated);
    });

    it('should delete item if quantity is 0', async () => {
      mockPrisma.cartItem.delete.mockResolvedValue({ id: 'item-1' });

      await service.updateQuantity('item-1', 0);

      expect(mockPrisma.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 'item-1' },
      });
    });

    it('should delete item if quantity is negative', async () => {
      mockPrisma.cartItem.delete.mockResolvedValue({ id: 'item-1' });

      await service.updateQuantity('item-1', -1);

      expect(mockPrisma.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 'item-1' },
      });
    });
  });

  describe('removeItem', () => {
    it('should delete the cart item', async () => {
      mockPrisma.cartItem.delete.mockResolvedValue({ id: 'item-1' });

      await service.removeItem('item-1');

      expect(mockPrisma.cartItem.delete).toHaveBeenCalledWith({
        where: { id: 'item-1' },
      });
    });
  });

  describe('clearCart', () => {
    it('should delete all items in the cart', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue(mockCart);
      mockPrisma.cartItem.deleteMany.mockResolvedValue({ count: 3 });

      await service.clearCart('user-1');

      expect(mockPrisma.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 'cart-1' },
      });
    });
  });
});
