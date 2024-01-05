"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.VendorRoute = router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '_' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
router.post('/login', controllers_1.vendorLogin);
router.get('/logout', controllers_1.vendorLogout);
// require authorization
router.use(middlewares_1.requireAuth);
router.get('/profile', controllers_1.getVendorProfile);
router.patch('/profile', controllers_1.updateVendorProfile);
router.patch('/service', controllers_1.updateVendorservice);
router.patch('/coverImage', upload, controllers_1.updateVendorCoverImage);
router.post('/food', upload, controllers_1.addFood);
router.get('/foods', controllers_1.getFoods);
router.get('/', (req, res, next) => {
    res.json({ message: "Hello From Vendor" });
});
//# sourceMappingURL=VendorRoute.js.map