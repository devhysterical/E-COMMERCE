"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UploadController", {
    enumerable: true,
    get: function() {
        return UploadController;
    }
});
const _common = require("@nestjs/common");
const _platformexpress = require("@nestjs/platform-express");
const _jwtauthguard = require("../auth/guards/jwt-auth.guard");
const _rolesguard = require("../common/guards/roles.guard");
const _rolesdecorator = require("../common/decorators/roles.decorator");
const _supabaseservice = require("../supabase/supabase.service");
const _crypto = require("crypto");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
let UploadController = class UploadController {
    async uploadImage(file) {
        if (!file) {
            throw new _common.BadRequestException('Không tìm thấy file');
        }
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            throw new _common.BadRequestException('Định dạng file không hợp lệ. Chỉ chấp nhận JPEG, PNG, WebP, GIF');
        }
        if (file.size > MAX_FILE_SIZE) {
            throw new _common.BadRequestException('File quá lớn. Tối đa 5MB');
        }
        // Tạo tên file unique
        const nameParts = file.originalname.split('.');
        const ext = nameParts.length > 1 ? nameParts.pop() : 'jpg';
        const fileName = `products/${(0, _crypto.randomUUID)()}.${ext}`;
        const result = await this.supabaseService.uploadImage('products', file.buffer, fileName, file.mimetype);
        return result;
    }
    constructor(supabaseService){
        this.supabaseService = supabaseService;
    }
};
_ts_decorate([
    (0, _common.Post)('image'),
    (0, _rolesdecorator.Roles)('ADMIN'),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    _ts_param(0, (0, _common.UploadedFile)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof UploadedFileType === "undefined" ? Object : UploadedFileType
    ]),
    _ts_metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImage", null);
UploadController = _ts_decorate([
    (0, _common.Controller)('upload'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard, _rolesguard.RolesGuard),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _supabaseservice.SupabaseService === "undefined" ? Object : _supabaseservice.SupabaseService
    ])
], UploadController);

//# sourceMappingURL=upload.controller.js.map