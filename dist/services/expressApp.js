"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("../routes");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const middlewares_1 = require("../middlewares");
const path_1 = __importDefault(require("path"));
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use('/images', express_1.default.static(path_1.default.join(__dirname, './images')));
    // to provide 'user' local variable to the req-res cycle
    app.use(middlewares_1.checkUserExistence);
    app.use('/admin', routes_1.AdminRoute);
    app.use('/vendor', routes_1.VendorRoute);
    app.use(routes_1.shoppingRoute);
    app.use('/customer', routes_1.customerRoute);
    return app;
});
//# sourceMappingURL=expressApp.js.map