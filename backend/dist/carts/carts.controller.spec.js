"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _cartscontroller = require("./carts.controller");
const _cartsservice = require("./carts.service");
const mockCartsService = {
    getCart: jest.fn(),
    addToCart: jest.fn(),
    updateQuantity: jest.fn(),
    removeItem: jest.fn(),
    clearCart: jest.fn()
};
describe('CartsController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _cartscontroller.CartsController
            ],
            providers: [
                {
                    provide: _cartsservice.CartsService,
                    useValue: mockCartsService
                }
            ]
        }).compile();
        controller = module.get(_cartscontroller.CartsController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=carts.controller.spec.js.map