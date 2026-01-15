"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _core = require("@nestjs/core");
const _appmodule = require("./app.module");
const _common = require("@nestjs/common");
const _express = require("express");
async function bootstrap() {
    const app = await _core.NestFactory.create(_appmodule.AppModule);
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
    // Kích hoạt CORS
    app.enableCors();
    await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();

//# sourceMappingURL=main.js.map