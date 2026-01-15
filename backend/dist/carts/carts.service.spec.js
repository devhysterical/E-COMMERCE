"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _cartsservice = require("./carts.service");
describe('CartsService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _cartsservice.CartsService
            ]
        }).compile();
        service = module.get(_cartsservice.CartsService);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
});

//# sourceMappingURL=carts.service.spec.js.map