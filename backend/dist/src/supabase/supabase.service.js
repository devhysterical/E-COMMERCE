"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
let SupabaseService = class SupabaseService {
    supabase;
    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_KEY trong .env');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
    }
    async uploadImage(bucket, file, fileName, contentType) {
        const { data, error } = await this.supabase.storage
            .from(bucket)
            .upload(fileName, file, {
            contentType,
            upsert: true,
        });
        if (error) {
            throw new Error(`Lỗi upload: ${error.message}`);
        }
        const { data: { publicUrl }, } = this.supabase.storage.from(bucket).getPublicUrl(data.path);
        return { url: publicUrl };
    }
    async deleteImage(bucket, path) {
        const { error } = await this.supabase.storage.from(bucket).remove([path]);
        if (error) {
            throw new Error(`Lỗi xóa file: ${error.message}`);
        }
    }
};
exports.SupabaseService = SupabaseService;
exports.SupabaseService = SupabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SupabaseService);
//# sourceMappingURL=supabase.service.js.map