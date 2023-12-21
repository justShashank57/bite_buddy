import express,{Request,Response,NextFunction, Router} from "express";
import { CreateVendor, getVendorById, getVendors } from "../controllers"; 

const router = express.Router();

router.post('/vendor',CreateVendor);
router.get('/getVendor',getVendors);
router.get('/vandor/:id',getVendorById);

router.get('/',(req:Request,res:Response,next:NextFunction)=>{
      res.json({message:"Hello From Admin"});
})

export {router as AdminRoute};