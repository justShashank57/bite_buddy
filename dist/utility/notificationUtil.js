"use strict";
// email
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestOtp = exports.generateOtp = void 0;
const config_1 = require("../config");
// notifications
// otp
const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiry };
};
exports.generateOtp = generateOtp;
const onRequestOtp = (otp, toPhoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountSid = config_1.twilio_sid;
        const authToken = config_1.twilio_authToken;
        const client = require('twilio')(accountSid, authToken);
        const response = yield client.messages.create({
            body: `Your OTP is : ${otp}`,
            from: '+12018841609',
            to: `+91${toPhoneNumber}`
        });
        return response;
    }
    catch (error) {
        console.log("ERROR in requesting OTP : ", error);
        return error;
    }
});
exports.onRequestOtp = onRequestOtp;
// payment notifications or mails
//# sourceMappingURL=notificationUtil.js.map