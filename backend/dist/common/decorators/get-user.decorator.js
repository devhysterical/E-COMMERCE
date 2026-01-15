"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GetUser", {
    enumerable: true,
    get: function() {
        return GetUser;
    }
});
const _common = require("@nestjs/common");
const GetUser = (0, _common.createParamDecorator)((data, ctx)=>{
    const request = ctx.switchToHttp().getRequest();
    if (data) {
        return request.user[data];
    }
    return request.user;
});

//# sourceMappingURL=get-user.decorator.js.map