"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _productsservice = require("./products.service");
describe('ProductsService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _productsservice.ProductsService
            ]
        }).compile();
        service = module.get(_productsservice.ProductsService);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
});

//# sourceMappingURL=products.service.spec.js.map