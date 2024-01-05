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
exports.getVendorById = exports.getVendors = exports.CreateVendor = exports.findVendor = void 0;
const model_1 = require("../model");
const utility_1 = require("../utility");
const findVendor = (vendorId, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        console.log("findVendor called with email: ", email);
        return yield model_1.vendor.findOne({ email: email });
    }
    else {
        console.log("findVendor called with VendorID: ", vendorId);
        return yield model_1.vendor.findById(vendorId);
    }
});
exports.findVendor = findVendor;
const CreateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, ownerName, address, phone, password, email, foodType, pincode } = req.body;
        const existingVendor = yield (0, exports.findVendor)("", email);
        if (existingVendor) {
            return res.json({ "message": "Vendor Already Exists" });
        }
        // generate salt
        const salt = yield (0, utility_1.generateSalt)();
        // generate password
        const hashedPassword = yield (0, utility_1.generatePassword)(password, salt);
        const createdVendor = yield model_1.vendor.create({
            name: name,
            address: address,
            ownerName: ownerName,
            phone: phone,
            password: hashedPassword,
            email: email,
            foodType: foodType,
            pincode: pincode,
            salt: salt,
            serviceAvailable: false,
            coverImages: [],
            foods: []
        });
        return res.json(createdVendor);
    }
    catch (err) {
        console.log("ERROR FOUND in createVendor.");
        return res.json(err);
    }
});
exports.CreateVendor = CreateVendor;
const getVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield model_1.vendor.find();
    if (vendors) {
        res.json({ vendors });
    }
    else {
        res.json({ "messgage": "No Vendors Found." });
    }
});
exports.getVendors = getVendors;
const getVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.id;
    const foundVendor = yield (0, exports.findVendor)(vendorId);
    if (foundVendor) {
        res.json({ foundVendor });
    }
    else {
        res.json({ "message": "Vendor data not available." });
    }
});
exports.getVendorById = getVendorById;
//# sourceMappingURL=AdminController.js.map