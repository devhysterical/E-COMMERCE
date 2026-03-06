"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _orderscontroller = require("./orders.controller");
const _ordersservice = require("./orders.service");
const _invoiceservice = require("./invoice.service");
const mockOrdersService = {
    createOrder: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findAllAdmin: jest.fn(),
    getStats: jest.fn(),
    updateStatus: jest.fn()
};
const mockInvoiceService = {
    generateInvoice: jest.fn()
};
describe('OrdersController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _orderscontroller.OrdersController
            ],
            providers: [
                {
                    provide: _ordersservice.OrdersService,
                    useValue: mockOrdersService
                },
                {
                    provide: _invoiceservice.InvoiceService,
                    useValue: mockInvoiceService
                }
            ]
        }).compile();
        controller = module.get(_orderscontroller.OrdersController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=orders.controller.spec.js.map