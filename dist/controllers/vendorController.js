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
exports.vendorLogout = exports.getFoods = exports.addFood = exports.updateVendorservice = exports.updateVendorCoverImage = exports.updateVendorProfile = exports.getVendorProfile = exports.vendorLogin = void 0;
const AdminController_1 = require("./AdminController");
const utility_1 = require("../utility");
const model_1 = require("../model");
const maxAge = 3 * 24 * 60 * 60;
const vendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingVendor = yield (0, AdminController_1.findVendor)('', email);
    if (existingVendor) {
        const validation = yield (0, utility_1.validatePassword)(password, existingVendor.password, existingVendor.salt);
        if (validation) {
            const signature = yield (0, utility_1.generateSignature)({
                __id: existingVendor.id,
                email: existingVendor.email,
                foodType: existingVendor.foodType,
                name: existingVendor.name
            });
            res.cookie('jwt', signature, { httpOnly: true, maxAge: maxAge * 1000 });
            console.log("Created JWT Cookie");
            return res.status(201).json({ "vendorId": existingVendor.id });
        }
        else {
            return res.json({ "message": "Password is not valid." });
        }
    }
    else {
        res.json({ "message": "Login Credentials not valid." });
    }
});
exports.vendorLogin = vendorLogin;
// authorization required
const getVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield (0, AdminController_1.findVendor)(user.__id);
        return res.status(201).json(existingVendor);
    }
    else {
        return res.json({ "message": "Vendor information not found." });
    }
});
exports.getVendorProfile = getVendorProfile;
const updateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userFromReq = req.user;
    const { name, email, foodType, phone } = req.body;
    if (userFromReq) {
        const existingVendor = yield (0, AdminController_1.findVendor)(userFromReq.__id);
        if (existingVendor) {
            //  all fields are mandatory to fill otherwise it will give error
            existingVendor.name = name;
            existingVendor.email = email;
            existingVendor.foodType = foodType;
            existingVendor.phone = phone;
            const savedResult = yield existingVendor.save();
            return res.json(savedResult);
        }
        return res.status(201).json(existingVendor);
    }
    else {
        return res.json({ "message": "Vendor information not found." });
    }
});
exports.updateVendorProfile = updateVendorProfile;
const updateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            const existingUser = yield (0, AdminController_1.findVendor)(user.__id);
            if (existingUser) {
                const files = req.files;
                //  console.log("Files: ",files);
                const images = files.map((file) => file.filename);
                //  console.log("images: ",images);
                existingUser.coverImages.push(...images);
                const savedResult = yield existingUser.save();
                return res.json(savedResult);
            }
        }
        return res.json({ "message": "something went wrong with Profile photo." });
    }
    catch (err) {
        console.log("Error found in UpdateCoverImage function: ", err);
        return res.json(err);
    }
});
exports.updateVendorCoverImage = updateVendorCoverImage;
const updateVendorservice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userFromReq = req.user;
    if (userFromReq) {
        const existingVendor = yield (0, AdminController_1.findVendor)(userFromReq.__id);
        if (existingVendor) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            const savedResult = yield existingVendor.save();
            return res.json(savedResult);
        }
    }
    else {
        return res.json({ "message": "Vendor information not found." });
    }
});
exports.updateVendorservice = updateVendorservice;
const addFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            const { name, description, category, foodType, readyTime, price } = req.body;
            const existingUser = yield (0, AdminController_1.findVendor)(user.__id);
            if (existingUser) {
                const files = req.files;
                console.log("Files: ", files);
                const images = files.map((file) => file.filename);
                console.log("images: ", images);
                const createdFood = yield model_1.food.create({
                    vendorId: existingUser._id,
                    name: name,
                    description: description,
                    category: category,
                    foodType: foodType,
                    images: images,
                    readyTime: readyTime,
                    price: price
                });
                existingUser.foods.push(createdFood);
                const savedResult = yield existingUser.save();
                return res.json(savedResult);
            }
        }
        return res.json({ "message": "something went wrong with add food." });
    }
    catch (err) {
        console.log("Error found in addFood function: ", err);
        return res.json(err);
    }
});
exports.addFood = addFood;
// search for foods with respect to vendor
const getFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foods = yield model_1.food.find({ vendorId: user.__id });
        if (foods) {
            return res.json(foods);
        }
        else {
            return res.json({ "message": "No food item added." });
        }
    }
});
exports.getFoods = getFoods;
const vendorLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
});
exports.vendorLogout = vendorLogout;
//# sourceMappingURL=vendorController.js.map