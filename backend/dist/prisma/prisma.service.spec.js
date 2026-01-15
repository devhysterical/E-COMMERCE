"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _prismaservice = require("./prisma.service");
describe('PrismaService', ()=>{
    let service;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            providers: [
                _prismaservice.PrismaService
            ]
        }).compile();
        service = module.get(_prismaservice.PrismaService);
    });
    it('should be defined', ()=>{
        expect(service).toBeDefined();
    });
});

//# sourceMappingURL=prisma.service.spec.js.map