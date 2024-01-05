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
exports.checkUserExistence = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        //   the callback in verify gives error if token is fake and gives decoded payload if its original
        jsonwebtoken_1.default.verify(token, config_1.AUTH_SECRET, (err, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err.message);
                return res.redirect('/login');
            }
            else {
                req.user = decodedToken;
                console.log("Decoded token in RequireAuth function: ", decodedToken);
                return next();
            }
        }));
    }
    else {
        return res.redirect('/login');
    }
};
exports.requireAuth = requireAuth;
const checkUserExistence = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.jwt;
    if (token) {
        jsonwebtoken_1.default.verify(token, config_1.AUTH_SECRET, (err, payload) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else {
                res.locals.user = payload;
                next();
            }
        });
    }
    else {
        res.locals.user = null;
        next();
    }
});
exports.checkUserExistence = checkUserExistence;
//# sourceMappingURL=authMiddleware.js.map