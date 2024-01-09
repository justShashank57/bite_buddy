import express,{Request,Response,NextFunction, Router} from "express";
import { CreateVendor, getTransactionById, getTransactions, getVendorById, getVendors } from "../controllers"; 

const router = express.Router();

router.post('/vendor',CreateVendor);
router.get('/vendors',getVendors);
router.get('/vendor/:id',getVendorById);

router.get('/transaction/:id',getTransactionById);
router.get('/transactions',getTransactions);

router.get('/',(req:Request,res:Response,next:NextFunction)=>{
      res.json({message:"Hello From Admin"});
})

export {router as AdminRoute};