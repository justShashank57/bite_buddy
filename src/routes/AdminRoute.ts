import express,{Request,Response,NextFunction, Router} from "express";
import { CreateVendor, getDeliveryUsers, getTransactionById, getTransactions, getVendorById, getVendors, verifyDeliveryUser } from "../controllers"; 

const router = express.Router();

router.post('/vendor',CreateVendor);
router.get('/vendors',getVendors);
router.get('/vendor/:id',getVendorById);

router.get('/transaction/:id',getTransactionById);
router.get('/transactions',getTransactions);

router.put('/delivery/verify',verifyDeliveryUser);
router.get('/delivery/users',getDeliveryUsers);

router.get('/',(req:Request,res:Response,next:NextFunction)=>{
      res.json({message:"Hello From Admin"});
})

export {router as AdminRoute};