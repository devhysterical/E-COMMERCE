"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _categoriescontroller = require("./categories.controller");
describe('CategoriesController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _categoriescontroller.CategoriesController
            ]
        }).compile();
        controller = module.get(_categoriescontroller.CategoriesController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=categories.controller.spec.js.map