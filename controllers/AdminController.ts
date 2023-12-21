import { Request,Response,NextFunction } from "express";
import { createVendorInput } from "../DTO";
import { vendor } from "../model";

export const CreateVendor = async(req:Request,res:Response,next:NextFunction) =>{
      const {name,ownerName,address,phone,password,email,foodType,pincode} = <createVendorInput>req.body;
      const createdVendor = await vendor.create({
            name:name,
            address:address,
            ownerName:ownerName,
            phone:phone,
            password:password,
            email:email,
            foodType:foodType,
            pincode:pincode,
            salt:'shashank',
            serviceAvailable:false,
            coverImages:[]
      })
      res.json(createdVendor);
}

export const getVendors = async(req:Request,res:Response,next:NextFunction) =>{

}

export const getVendorById = async(req:Request,res:Response,next:NextFunction) =>{

}