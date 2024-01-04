import {Request,Response,NextFunction} from 'express';
import { EditVendorInputs, createFoodInputs, vendorLoginInputs, vendorPayloadInputs } from '../DTO';
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
               console.log("Created JWT Cookie");
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
             const user = req.user as vendorPayloadInputs;
             if(user){
                     const existingVendor = await findVendor(user.__id);
                     return res.status(201).json(existingVendor);
             }
             else{
                  return res.json({"message":"Vendor information not found."});
             }
}

export const updateVendorProfile = async (req:Request,res:Response,next:NextFunction) => {
           const userFromReq = req.user as vendorPayloadInputs;
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

export const updateVendorCoverImage =async (req:Request,res:Response,next:NextFunction) => {
   try{
      const user = req.user as vendorPayloadInputs;
      if(user){
          const existingUser = await findVendor(user.__id);
          if(existingUser){
             const files = req.files as [Express.Multer.File];
            //  console.log("Files: ",files);

             const images = files.map((file:Express.Multer.File)=> file.filename);
            //  console.log("images: ",images);

             existingUser.coverImages.push(...images);
             const savedResult = await existingUser.save();

             return res.json(savedResult);
          }
      }
      return res.json({"message":"something went wrong with Profile photo."});
   }
   catch(err){
        console.log("Error found in UpdateCoverImage function: ",err);
        return res.json(err);
   }
}
export const updateVendorservice = async (req:Request,res:Response,next:NextFunction) => {
             const userFromReq = req.user as vendorPayloadInputs;
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
       try{
          const user = req.user as vendorPayloadInputs;
          if(user){
              const {name,description,category,foodType,readyTime,price} = <createFoodInputs>req.body;
              const existingUser = await findVendor(user.__id);
              if(existingUser){
                 const files = req.files as [Express.Multer.File];
                 console.log("Files: ",files);

                 const images = files.map((file:Express.Multer.File)=> file.filename);
                 console.log("images: ",images);

                 const createdFood = await food.create({
                     vendorId:existingUser._id,
                     name:name,
                     description:description,
                     category:category,
                     foodType:foodType,
                     images:images,
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
       catch(err){
            console.log("Error found in addFood function: ",err);
            return res.json(err);
       }
}


// search for foods with respect to vendor
export const getFoods = async (req:Request,res:Response,next:NextFunction) => {
             const user = req.user as vendorPayloadInputs;
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