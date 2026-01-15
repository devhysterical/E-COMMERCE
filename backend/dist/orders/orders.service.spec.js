"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _ordersservice = require("./orders.service");
describe('OrdersService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _ordersservice.OrdersService
            ]
        }).compile();
        service = module.get(_ordersservice.OrdersService);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
});

//# sourceMappingURL=orders.service.spec.js.map