import { Request,Response,NextFunction } from "express";
import { createVendorInput } from "../DTO";
import { vendor } from "../model";
import { generatePassword, generateSalt } from "../utility";

export const CreateVendor = async(req:Request,res:Response,next:NextFunction) =>{
      const {name,ownerName,address,phone,password,email,foodType,pincode} = <createVendorInput>req.body;
      
      const existingVendor = await vendor.findOne({email:email});
      if(existingVendor){
            return res.json({"message":"Vendor Already Exists"});
      }
      // generate salt
      const salt =await generateSalt();
      // generate password
      const hashedPassword =await generatePassword(password,salt);
      const createdVendor = await vendor.create({
            name:name,
            address:address,
            ownerName:ownerName,
            phone:phone,
            password:hashedPassword,
            email:email,
            foodType:foodType,
            pincode:pincode,
            salt:salt,
            serviceAvailable:false,
            coverImages:[]
      })
      res.json(createdVendor);
}

export const getVendors = async(req:Request,res:Response,next:NextFunction) =>{

}

export const getVendorById = async(req:Request,res:Response,next:NextFunction) =>{

}