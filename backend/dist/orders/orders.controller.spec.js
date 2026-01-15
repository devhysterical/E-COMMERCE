"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _orderscontroller = require("./orders.controller");
describe('OrdersController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _orderscontroller.OrdersController
            ]
        }).compile();
        controller = module.get(_orderscontroller.OrdersController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=orders.controller.spec.js.map