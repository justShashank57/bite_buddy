"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.customerRoute = router;
// ----------------Create/Signup customer----------------
router.post('/signup', controllers_1.customerSignup);
// -----------------------Login--------------------------
router.post('/login', controllers_1.customerLogin);
// Authentication
router.use(middlewares_1.requireAuth);
// ------------------verify customer Account-------------
router.patch('/verify', controllers_1.customerVerify);
// -------------------OTP/request OTP--------------------
router.get('/otp', controllers_1.requestOtp);
// ------------------------Profile-----------------------
router.get('/profile', controllers_1.getCustomerProfile);
router.patch('/profile', controllers_1.editCustomerProfile);
//# sourceMappingURL=customerRoute.js.map