import express,{Request,Response,NextFunction, Router} from "express";
const router = express.Router();

router.get('/',(req:Request,res:Response,next:NextFunction)=>{
      res.json({message:"Hello From Vendor"});
})

export {router as VendorRoute};