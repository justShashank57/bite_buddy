import express,{Request,Response,NextFunction, Router} from "express";
import { addFood, getCurrentOrders, getFoods, getOrderDetails, getVendorProfile, processOrder, updateVendorCoverImage, updateVendorProfile, updateVendorservice, vendorLogin, vendorLogout } from "../controllers";
import { requireAuth } from "../middlewares";
import multer from 'multer';

const router = express.Router();

const imageStorage = multer.diskStorage({
      destination: function (req, file, cb) {
          cb(null, 'images');
      },
      filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, uniqueSuffix + '_' + file.originalname);
      }
  });
  
const upload = multer({ storage: imageStorage }).array('images', 10);

router.post('/login',vendorLogin);
router.get('/logout',vendorLogout);

// require authorization
router.use(requireAuth)
router.get('/profile',getVendorProfile);
router.patch('/profile',updateVendorProfile);
router.patch('/service',updateVendorservice);
router.patch('/coverImage',upload,updateVendorCoverImage);

router.post('/food',upload,addFood);
router.get('/foods',getFoods);

// order
router.get('/orders',getCurrentOrders);
router.put('/order/:id/process',processOrder);
router.get('/order/:id',getOrderDetails);

router.get('/',(req:Request,res:Response,next:NextFunction)=>{
      res.json({message:"Hello From Vendor"});
})

export {router as VendorRoute};