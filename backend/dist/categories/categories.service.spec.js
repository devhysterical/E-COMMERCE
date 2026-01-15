"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _categoriesservice = require("./categories.service");
describe('CategoriesService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _categoriesservice.CategoriesService
            ]
        }).compile();
        service = module.get(_categoriesservice.CategoriesService);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
});

//# sourceMappingURL=categories.service.spec.js.map