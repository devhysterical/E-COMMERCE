"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "AddressesModule", {
    enumerable: true,
    get: function() {
        return AddressesModule;
    }
});
const _common = require("@nestjs/common");
const _addressescontroller = require("./addresses.controller");
const _addressesservice = require("./addresses.service");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let AddressesModule = class AddressesModule {
};
AddressesModule = _ts_decorate([
    (0, _common.Module)({
        controllers: [
            _addressescontroller.AddressesController
        ],
        providers: [
            _addressesservice.AddressesService
        ],
        exports: [
            _addressesservice.AddressesService
        ]
    })
], AddressesModule);

//# sourceMappingURL=addresses.module.js.map