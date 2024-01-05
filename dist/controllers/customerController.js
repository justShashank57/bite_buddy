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
Object.defineProperty(exports, "__esModule", { value: true });
exports.editCustomerProfile = exports.getCustomerProfile = exports.requestOtp = exports.customerVerify = exports.customerLogin = exports.customerSignup = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const DTO_1 = require("../DTO");
const utility_1 = require("../utility");
const customer_1 = require("../model/customer");
const maxAge = 3 * 24 * 60 * 60;
const customerSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(DTO_1.createCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, password, phone } = customerInputs;
    const existingUser = yield customer_1.customer.findOne({ email: email });
    if (existingUser) {
        return res.status(409).json({ message: "A user exists with the provided email ID." });
    }
    const salt = yield (0, utility_1.generateSalt)();
    const userPassword = yield (0, utility_1.generatePassword)(password, salt);
    const { otp, expiry } = (0, utility_1.generateOtp)();
    const result = yield customer_1.customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0
    });
    if (result) {
        //  send otp to customer
        console.log("The result id is: ", result.id);
        yield (0, utility_1.onRequestOtp)(otp, phone);
        // generate token 
        const token = yield (0, utility_1.generateSignature)({
            _id: result.id,
            email: result.email,
            verified: result.verified,
        });
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        console.log("created JWT cookie.");
        // send the result to client
        return res.status(200).json({ token: token, verified: result.verified, email: result.email });
    }
    return res.json({ message: "Error with signUp." });
});
exports.customerSignup = customerSignup;
const customerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginInputs = (0, class_transformer_1.plainToClass)(DTO_1.userLoginInputs, req.body);
    const loginErrors = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: false } });
    if (loginErrors.length > 0) {
        return res.status(400).json(loginErrors);
    }
    const { email, password } = loginInputs;
    const Customer = yield customer_1.customer.findOne({ email: email });
    if (Customer) {
        const validation = yield (0, utility_1.validatePassword)(password, Customer.password, Customer.salt);
        if (validation) {
            //  generate signature
            const token = yield (0, utility_1.generateSignature)({
                _id: Customer.id,
                email: Customer.email,
                verified: Customer.verified
            });
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            console.log("Created JWT cookie.");
            return res.status(200).json({ token: token, verified: Customer.verified, email: Customer.email });
        }
        else {
            return res.status(400).json({ message: "Invalid Password." });
        }
    }
    return res.status(404).json({ message: "Login error" });
});
exports.customerLogin = customerLogin;
const customerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const Customer = req.user;
    //  console.log(Customer)
    if (Customer) {
        const profile = yield customer_1.customer.findById(Customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomerResponse = yield profile.save();
                // generate signature
                const token = yield (0, utility_1.generateSignature)({
                    _id: updatedCustomerResponse.id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified,
                });
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                console.log("created JWT cookie.");
                return res.status(200).json({
                    token: token,
                    verified: updatedCustomerResponse.verified,
                    email: updatedCustomerResponse.email
                });
            }
        }
        else {
            return res.status(400).json({ message: "session not valid" });
        }
    }
    return res.status(400).json({ message: "Error with OTP validation." });
});
exports.customerVerify = customerVerify;
const requestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Customer = req.user;
    if (Customer) {
        const profile = yield customer_1.customer.findById(Customer._id);
        if (profile) {
            const { otp, expiry } = (0, utility_1.generateOtp)();
            profile.otp = otp;
            profile.otp_expiry = expiry;
            yield profile.save();
            yield (0, utility_1.onRequestOtp)(otp, profile.phone);
            return res.status(200).json({ message: "OTP sent to your registered mobile number." });
        }
    }
    return res.status(400).json({ message: "Error with OTP Request." });
});
exports.requestOtp = requestOtp;
const getCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Customer = req.user;
    if (Customer) {
        const profile = yield customer_1.customer.findById(Customer._id);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    return res.status(400).json({ message: "Error while fetching Profile." });
});
exports.getCustomerProfile = getCustomerProfile;
const editCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Customer = req.user;
    const profileInputs = (0, class_transformer_1.plainToClass)(DTO_1.editCustomerProfileInputs, req.body);
    const profileInputErrors = yield (0, class_validator_1.validate)(profileInputs, { validationError: { target: false } });
    if (profileInputErrors.length > 0) {
        return res.status(400).json(profileInputErrors);
    }
    const { firstName, lastName, address } = profileInputs;
    if (Customer) {
        const profile = yield customer_1.customer.findById(Customer._id);
        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = yield profile.save();
            return res.status(200).json(profile);
        }
    }
});
exports.editCustomerProfile = editCustomerProfile;
//# sourceMappingURL=customerController.js.map