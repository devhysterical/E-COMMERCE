"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _productscontroller = require("./products.controller");
const _productsservice = require("./products.service");
const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    searchSuggest: jest.fn(),
    getRelatedProducts: jest.fn(),
    getLowStockProducts: jest.fn(),
    getImages: jest.fn(),
    addImage: jest.fn(),
    removeImage: jest.fn(),
    setPrimaryImage: jest.fn()
};
describe('ProductsController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _productscontroller.ProductsController
            ],
            providers: [
                {
                    provide: _productsservice.ProductsService,
                    useValue: mockProductsService
                }
            ]
        }).compile();
        controller = module.get(_productscontroller.ProductsController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=products.controller.spec.js.map