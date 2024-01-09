import { Request,Response,NextFunction } from "express";
import { createVendorInput } from "../DTO";
import { Transaction, vendor } from "../model";
import { generatePassword, generateSalt } from "../utility";

export const findVendor = async (vendorId:string | undefined, email?:string) => {
     if(email){
          console.log("findVendor called with email: ",email);
          return await vendor.findOne({email:email});
       }
       else{
            console.log("findVendor called with VendorID: ",vendorId )
            return  await vendor.findById(vendorId);
       }
}

export const CreateVendor = async(req:Request,res:Response,next:NextFunction) =>{
      try{
           const {name,ownerName,address,phone,password,email,foodType,pincode} = <createVendorInput>req.body;
           const existingVendor = await findVendor("",email);
           
               if(existingVendor){
                return res.json({"message":"Vendor Already Exists"});
               }
               // generate salt
               const salt = await generateSalt();
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
                    coverImages:[],
                    foods:[]
               })
              return res.json(createdVendor);
          }
     catch(err){
          console.log("ERROR FOUND in createVendor.");
          return res.json(err);
     }
}

export const getVendors = async(req:Request,res:Response,next:NextFunction) =>{
       const vendors = await vendor.find();
       if(vendors){
            res.json({vendors});
       }
       else{
            res.json({"messgage":"No Vendors Found."});
       }

}

export const getVendorById = async(req:Request,res:Response,next:NextFunction) =>{
       const vendorId = req.params.id;
       const foundVendor = await findVendor(vendorId);
       if(foundVendor){
            res.json({foundVendor});
       }
       else{
            res.json({"message":"Vendor data not available."});
       }
}

export const getTransactions = async(req:Request,res:Response,next:NextFunction) =>{
     const transactions = await Transaction.find();
     if(transactions){
          res.status(200).json(transactions);
     }
     return res.status(400).json({message:"Transactions not found."});
}


export const getTransactionById = async(req:Request,res:Response,next:NextFunction) =>{
     const transactionId = req.params.id;
     const transaction = await Transaction.findById(transactionId);
     if(transaction){
          res.status(200).json(transaction);
     }
     return res.status(400).json({message:"Transaction not found."});
}