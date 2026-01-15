"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _productscontroller = require("./products.controller");
describe('ProductsController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _productscontroller.ProductsController
            ]
        }).compile();
        controller = module.get(_productscontroller.ProductsController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=products.controller.spec.js.map