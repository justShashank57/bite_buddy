import {Request,Response,NextFunction} from 'express';
import { EditVendorInputs, createFoodInputs, vendorLoginInputs } from '../DTO';
import { findVendor } from './AdminController';
import { generateSignature, validatePassword } from '../utility';
import { food, vendor } from '../model';

const maxAge = 3*24*60*60;
export const vendorLogin =async (req:Request,res:Response,next:NextFunction) => {
       const {email,password} = <vendorLoginInputs>req.body;
       const existingVendor = await findVendor('',email);
       if(existingVendor){
            const validation = await validatePassword(password, existingVendor.password , existingVendor.salt);
            if(validation){
               const signature = await generateSignature({
                  __id:existingVendor.id,
                  email:existingVendor.email,
                  foodType:existingVendor.foodType,
                  name:existingVendor.name
               })
               res.cookie('jwt',signature,{httpOnly:true,maxAge:maxAge*1000});
               console.log("Authorization successful");
               return res.status(201).json({"vendorId":existingVendor.id});
            }
            else{
               return res.json({"message":"Password is not valid."})
            }
       }
       else{
           res.json({"message":"Login Credentials not valid."});
       }
}

// authorization required

export const getVendorProfile = async (req:Request,res:Response,next:NextFunction) => {
             const user = req.user;
             if(user){
                     const existingVendor = await findVendor(user.__id);
                     return res.status(201).json(existingVendor);
             }
             else{
                  return res.json({"message":"Vendor information not found."});
             }
}

export const updateVendorProfile = async (req:Request,res:Response,next:NextFunction) => {
           const userFromReq = req.user;
           const {name,email,foodType,phone} = <EditVendorInputs>req.body;
           if(userFromReq){
                const existingVendor = await findVendor(userFromReq.__id);
                if(existingVendor){
                  //  all fields are mandatory to fill otherwise it will give error
                   existingVendor.name = name;
                   existingVendor.email = email;
                   existingVendor.foodType = foodType;
                   existingVendor.phone = phone;

                   const savedResult = await existingVendor.save();
                   return res.json(savedResult);
                }
                return res.status(201).json(existingVendor);
           }
           else{
                return res.json({"message":"Vendor information not found."});
           }
}

export const updateVendorservice = async (req:Request,res:Response,next:NextFunction) => {
             const userFromReq = req.user;
             if(userFromReq){
                const existingVendor = await findVendor(userFromReq.__id);
                if(existingVendor){
                   existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
                   const savedResult = await existingVendor.save();
                   return res.json(savedResult);
                }
             }
             else{
                return res.json({"message":"Vendor information not found."});
             }
}


export const addFood = async (req:Request,res:Response,next:NextFunction) => {
       const user = req.user;
       if(user){
           const {name,description,category,foodType,readyTime,price} = <createFoodInputs>req.body;
           const existingUser = await findVendor(user.__id);
           if(existingUser){
              const createdFood = await food.create({
                  vendorId:existingUser._id,
                  name:name,
                  description:description,
                  category:category,
                  foodType:foodType,
                  images:[''],
                  readyTime:readyTime,
                  price:price
              })
              existingUser.foods.push(createdFood);
              const savedResult = await existingUser.save();
 
              return res.json(savedResult);
           }
       }
       return res.json({"message":"something went wrong with add food."});
}


// search for foods with respect to vendor
export const getFoods = async (req:Request,res:Response,next:NextFunction) => {
             const user = req.user;
             if(user){
                const foods = await food.find({vendorId:user.__id});
                if(foods){
                   return res.json(foods);
                }
                else{
                   return res.json({"message":"No food item added."});
                }
             }
}
export const vendorLogout =async (req:Request,res:Response) => {
       res.cookie('jwt','',{maxAge:1});
       res.redirect('/');
}