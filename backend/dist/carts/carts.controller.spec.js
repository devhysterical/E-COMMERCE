"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _cartscontroller = require("./carts.controller");
describe('CartsController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _cartscontroller.CartsController
            ]
        }).compile();
        controller = module.get(_cartscontroller.CartsController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=carts.controller.spec.js.map