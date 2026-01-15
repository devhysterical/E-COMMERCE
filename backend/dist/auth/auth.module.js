"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AuthModule", {
    enumerable: true,
    get: function() {
        return AuthModule;
    }
});
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _passport = require("@nestjs/passport");
const _authservice = require("./auth.service");
const _authcontroller = require("./auth.controller");
const _usersmodule = require("../users/users.module");
const _jwtstrategy = require("./strategies/jwt.strategy");
const _supabasemodule = require("../supabase/supabase.module");
const _otpcacheservice = require("./otp-cache.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AuthModule = class AuthModule {
};
AuthModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _usersmodule.UsersModule,
            _passport.PassportModule,
            _supabasemodule.SupabaseModule,
            _jwt.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET || 'super-secret',
                signOptions: {
                    expiresIn: '1d'
                }
            })
        ],
        providers: [
            _authservice.AuthService,
            _jwtstrategy.JwtStrategy,
            _otpcacheservice.OtpCacheService
        ],
        controllers: [
            _authcontroller.AuthController
        ]
    })
], AuthModule);

//# sourceMappingURL=auth.module.js.map