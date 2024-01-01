import express,{Request,Response,NextFunction, Router} from "express";
import { addFood, getFoods, getVendorProfile, updateVendorProfile, updateVendorservice, vendorLogin, vendorLogout } from "../controllers";
import { requireAuth } from "../middlewares";
const router = express.Router();

router.post('/login',vendorLogin);
router.get('/logout',vendorLogout);

// require authorization
router.use(requireAuth)
router.get('/profile',getVendorProfile);
router.patch('/profile',updateVendorProfile);
router.patch('/service',updateVendorservice);

router.post('/food',addFood);
router.get('/foods',getFoods);

router.get('/',(req:Request,res:Response,next:NextFunction)=>{
      res.json({message:"Hello From Vendor"});
})

export {router as VendorRoute};