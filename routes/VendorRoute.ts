import express,{Request,Response,NextFunction, Router} from "express";
import { getVendorProfile, updateVendorProfile, updateVendorservice, vendorLogin, vendorLogout } from "../controllers";
import { requireAuth } from "../middlewares";
const router = express.Router();

router.post('/login',vendorLogin);
router.get('/logout',vendorLogout);

// require authorization
router.get('/profile',requireAuth,getVendorProfile);
router.patch('/profile',requireAuth,updateVendorProfile);
router.patch('/service',requireAuth,updateVendorservice);

router.get('/',(req:Request,res:Response,next:NextFunction)=>{
      res.json({message:"Hello From Vendor"});
})

export {router as VendorRoute};