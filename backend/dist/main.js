"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appmodule = require("./app.module");
const _common = require("@nestjs/common");
const _express = require("express");
const _helmet = /*#__PURE__*/ _interop_require_default(require("helmet"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule);
    // Security headers
    app.use((0, _helmet.default)());
    // Tăng body limit để hỗ trợ upload hình ảnh base64
    app.use((0, _express.json)({
        limit: '10mb'
    }));
    app.use((0, _express.urlencoded)({
        extended: true,
        limit: '10mb'
    }));
    // Kích hoạt ValidationPipe toàn cục
    app.useGlobalPipes(new _common.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    // Cấu hình CORS chặt chẽ
    const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map((origin)=>origin.trim());
    app.enableCors({
        origin: allowedOrigins,
        methods: [
            'GET',
            'POST',
            'PUT',
            'PATCH',
            'DELETE'
        ],
        credentials: true
    });
    await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();

//# sourceMappingURL=main.js.map