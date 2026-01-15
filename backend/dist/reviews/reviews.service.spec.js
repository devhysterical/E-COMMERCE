"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _reviewsservice = require("./reviews.service");
describe('ReviewsService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _reviewsservice.ReviewsService
            ]
        }).compile();
        service = module.get(_reviewsservice.ReviewsService);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
});

//# sourceMappingURL=reviews.service.spec.js.map