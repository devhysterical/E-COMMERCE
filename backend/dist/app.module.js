"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AppModule", {
    enumerable: true,
    get: function() {
        return AppModule;
    }
});
const _common = require("@nestjs/common");
const _appcontroller = require("./app.controller");
const _appservice = require("./app.service");
const _prismamodule = require("./prisma/prisma.module");
const _usersmodule = require("./users/users.module");
const _authmodule = require("./auth/auth.module");
const _categoriesmodule = require("./categories/categories.module");
const _productsmodule = require("./products/products.module");
const _cartsmodule = require("./carts/carts.module");
const _ordersmodule = require("./orders/orders.module");
const _reviewsmodule = require("./reviews/reviews.module");
const _adminmodule = require("./admin/admin.module");
const _supabasemodule = require("./supabase/supabase.module");
const _uploadmodule = require("./upload/upload.module");
const _paymentmodule = require("./payment/payment.module");
const _bannersmodule = require("./banners/banners.module");
const _emailmodule = require("./email/email.module");
const _wishlistmodule = require("./wishlist/wishlist.module");
const _couponsmodule = require("./coupons/coupons.module");
const _reportsmodule = require("./reports/reports.module");
const _addressesmodule = require("./addresses/addresses.module");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AppModule = class AppModule {
};
AppModule = _ts_decorate([
    (0, _common.Module)({
        imports: [
            _prismamodule.PrismaModule,
            _supabasemodule.SupabaseModule,
            _emailmodule.EmailModule,
            _usersmodule.UsersModule,
            _authmodule.AuthModule,
            _categoriesmodule.CategoriesModule,
            _productsmodule.ProductsModule,
            _cartsmodule.CartsModule,
            _ordersmodule.OrdersModule,
            _reviewsmodule.ReviewsModule,
            _adminmodule.AdminModule,
            _uploadmodule.UploadModule,
            _paymentmodule.PaymentModule,
            _bannersmodule.BannersModule,
            _wishlistmodule.WishlistModule,
            _couponsmodule.CouponsModule,
            _reportsmodule.ReportsModule,
            _addressesmodule.AddressesModule
        ],
        controllers: [
            _appcontroller.AppController
        ],
        providers: [
            _appservice.AppService
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map