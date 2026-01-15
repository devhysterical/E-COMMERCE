"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _reviewscontroller = require("./reviews.controller");
describe('ReviewsController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _reviewscontroller.ReviewsController
            ]
        }).compile();
        controller = module.get(_reviewscontroller.ReviewsController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=reviews.controller.spec.js.map