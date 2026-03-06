"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _productsservice = require("./products.service");
const _prismaservice = require("../prisma/prisma.service");
const _common = require("@nestjs/common");
const mockPrisma = {
    product: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn()
    },
    productImage: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn()
    }
};
describe('ProductsService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _productsservice.ProductsService,
                {
                    provide: _prismaservice.PrismaService,
                    useValue: mockPrisma
                }
            ]
        }).compile();
        service = module.get(_productsservice.ProductsService);
        jest.clearAllMocks();
    });
    const mockProduct = {
        id: 'prod-1',
        name: 'Áo thun',
        description: 'Áo thun cotton',
        price: 150000,
        stock: 50,
        imageUrl: null,
        categoryId: 'cat-1',
        deletedAt: null,
        category: {
            id: 'cat-1',
            name: 'Thời trang'
        },
        reviews: [],
        images: []
    };
    describe('create', ()=>{
        it('should create a product', async ()=>{
            mockPrisma.product.create.mockResolvedValue(mockProduct);
            const result = await service.create({
                name: 'Áo thun',
                price: 150000,
                stock: 50,
                categoryId: 'cat-1'
            });
            expect(result).toEqual(mockProduct);
            expect(mockPrisma.product.create).toHaveBeenCalledWith({
                data: {
                    name: 'Áo thun',
                    price: 150000,
                    stock: 50,
                    categoryId: 'cat-1'
                }
            });
        });
    });
    describe('findAll', ()=>{
        it('should return paginated products', async ()=>{
            mockPrisma.product.findMany.mockResolvedValue([
                mockProduct
            ]);
            mockPrisma.product.count.mockResolvedValue(1);
            const result = await service.findAll();
            expect(result.data).toHaveLength(1);
            expect(result.meta.total).toBe(1);
            expect(result.meta.page).toBe(1);
        });
        it('should filter by categoryId', async ()=>{
            mockPrisma.product.findMany.mockResolvedValue([]);
            mockPrisma.product.count.mockResolvedValue(0);
            await service.findAll('cat-1');
            const calls = mockPrisma.product.findMany.mock.calls;
            expect(calls[0][0].where).toHaveProperty('categoryId', 'cat-1');
        });
        it('should filter by search term', async ()=>{
            mockPrisma.product.findMany.mockResolvedValue([]);
            mockPrisma.product.count.mockResolvedValue(0);
            await service.findAll(undefined, 'áo');
            const calls = mockPrisma.product.findMany.mock.calls;
            expect(calls[0][0].where).toHaveProperty('name', {
                contains: 'áo',
                mode: 'insensitive'
            });
        });
        it('should filter by price range', async ()=>{
            mockPrisma.product.findMany.mockResolvedValue([]);
            mockPrisma.product.count.mockResolvedValue(0);
            await service.findAll(undefined, undefined, 1, 12, 'createdAt', 'desc', 100000, 500000);
            const calls = mockPrisma.product.findMany.mock.calls;
            expect(calls[0][0].where).toHaveProperty('price', {
                gte: 100000,
                lte: 500000
            });
        });
    });
    describe('findOne', ()=>{
        it('should return a product', async ()=>{
            mockPrisma.product.findFirst.mockResolvedValue(mockProduct);
            const result = await service.findOne('prod-1');
            expect(result).toEqual(mockProduct);
        });
        it('should throw NotFoundException if not found', async ()=>{
            mockPrisma.product.findFirst.mockResolvedValue(null);
            await expect(service.findOne('nonexistent')).rejects.toThrow(_common.NotFoundException);
        });
    });
    describe('update', ()=>{
        it('should update a product', async ()=>{
            const updated = {
                ...mockProduct,
                name: 'Áo thun mới'
            };
            mockPrisma.product.findFirst.mockResolvedValue(mockProduct);
            mockPrisma.product.update.mockResolvedValue(updated);
            const result = await service.update('prod-1', {
                name: 'Áo thun mới'
            });
            expect(result.name).toBe('Áo thun mới');
        });
        it('should throw if product not found', async ()=>{
            mockPrisma.product.findFirst.mockResolvedValue(null);
            await expect(service.update('nonexistent', {
                name: 'test'
            })).rejects.toThrow(_common.NotFoundException);
        });
    });
    describe('remove', ()=>{
        it('should soft-delete a product', async ()=>{
            mockPrisma.product.findFirst.mockResolvedValue(mockProduct);
            mockPrisma.product.update.mockResolvedValue({
                ...mockProduct,
                deletedAt: new Date()
            });
            await service.remove('prod-1');
            const calls = mockPrisma.product.update.mock.calls;
            expect(calls[0][0].data.deletedAt).toBeInstanceOf(Date);
        });
    });
    describe('searchSuggest', ()=>{
        it('should return search suggestions', async ()=>{
            mockPrisma.product.findMany.mockResolvedValue([
                {
                    id: 'prod-1',
                    name: 'Áo thun',
                    price: 150000,
                    imageUrl: null
                }
            ]);
            const result = await service.searchSuggest('áo');
            expect(result).toHaveLength(1);
        });
        it('should return empty array for empty query', async ()=>{
            const result = await service.searchSuggest('   ');
            expect(result).toEqual([]);
            expect(mockPrisma.product.findMany).not.toHaveBeenCalled();
        });
    });
    describe('getLowStockProducts', ()=>{
        it('should return products with low stock', async ()=>{
            const lowStockProduct = {
                ...mockProduct,
                stock: 3
            };
            mockPrisma.product.findMany.mockResolvedValue([
                lowStockProduct
            ]);
            const result = await service.getLowStockProducts(10);
            expect(result.products).toHaveLength(1);
            expect(result.threshold).toBe(10);
        });
    });
    describe('Image Management', ()=>{
        it('addImage should create a new image', async ()=>{
            mockPrisma.product.findFirst.mockResolvedValue(mockProduct);
            mockPrisma.productImage.findFirst.mockResolvedValue(null);
            mockPrisma.productImage.create.mockResolvedValue({
                id: 'img-1',
                productId: 'prod-1',
                imageUrl: 'https://example.com/img.jpg',
                isPrimary: false,
                sortOrder: 0
            });
            const result = await service.addImage('prod-1', 'https://example.com/img.jpg');
            expect(result.imageUrl).toBe('https://example.com/img.jpg');
        });
        it('removeImage should throw if image not found', async ()=>{
            mockPrisma.productImage.findFirst.mockResolvedValue(null);
            await expect(service.removeImage('prod-1', 'nonexistent')).rejects.toThrow(_common.NotFoundException);
        });
        it('setPrimaryImage should update primary flag', async ()=>{
            const img = {
                id: 'img-1',
                productId: 'prod-1',
                isPrimary: false
            };
            mockPrisma.productImage.findFirst.mockResolvedValue(img);
            mockPrisma.productImage.updateMany.mockResolvedValue({
                count: 2
            });
            mockPrisma.productImage.update.mockResolvedValue({
                ...img,
                isPrimary: true
            });
            const result = await service.setPrimaryImage('prod-1', 'img-1');
            expect(result.isPrimary).toBe(true);
        });
    });
});

//# sourceMappingURL=products.service.spec.js.map