"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _categoriescontroller = require("./categories.controller");
const _categoriesservice = require("./categories.service");
const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
};
describe('CategoriesController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _categoriescontroller.CategoriesController
            ],
            providers: [
                {
                    provide: _categoriesservice.CategoriesService,
                    useValue: mockCategoriesService
                }
            ]
        }).compile();
        controller = module.get(_categoriescontroller.CategoriesController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=categories.controller.spec.js.map