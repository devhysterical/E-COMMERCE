"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _testing = require("@nestjs/testing");
const _authcontroller = require("./auth.controller");
const _authservice = require("./auth.service");
const mockAuthService = {
    sendOtp: jest.fn(),
    register: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    googleAuth: jest.fn()
};
describe('AuthController', ()=>{
    let controller;
    beforeEach(async ()=>{
        const module = await _testing.Test.createTestingModule({
            controllers: [
                _authcontroller.AuthController
            ],
            providers: [
                {
                    provide: _authservice.AuthService,
                    useValue: mockAuthService
                }
            ]
        }).compile();
        controller = module.get(_authcontroller.AuthController);
    });
    it('should be defined', ()=>{
        expect(controller).toBeDefined();
    });
});

//# sourceMappingURL=auth.controller.spec.js.map