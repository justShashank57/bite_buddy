import {Request,Response,NextFunction} from 'express';
import { EditVendorInputs, createFoodInputs, vendorLoginInputs, vendorPayloadInputs } from '../DTO';
import { findVendor } from './AdminController';
import { generateSignature, validatePassword } from '../utility';
import { food, vendor } from '../model';
import { Order } from '../model/order';

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

// orders
export const getCurrentOrders =async (req:Request,res:Response,next:NextFunction) => {
       const user = req.user as vendorPayloadInputs;
       if(user){
          const orders = await Order.find({vendorId:user.__id}).populate('items.food');
          if(orders){
             return res.status(200).json(orders);
          }
       }
       return res.status(400).json({message:"Order not found"});
}

export const getOrderDetails =async (req:Request,res:Response,next:NextFunction) => {
       const orderId = req.params.id;
       if(orderId){
          const order = await Order.findById(orderId);
          if(order){
             return res.status(200).json(order);
          }
       }
       return res.status(400).json({message:"Order not found"});
   
}
   //  push status, remark and time
export const processOrder =async (req:Request,res:Response,next:NextFunction) => {
       const {status,remark,time} = req.body;
       const orderId = req.params.id;
       if(orderId){
          const order = await Order.findById(orderId).populate('items.food');
          order.orderStatus = status;
          order.remarks = remark;
          if(time){
            order.readyTime = time;
          }
          const orderResult = await order.save();
          if(orderResult){
             return res.status(200).json(orderResult);
          }
       }
       return res.status(400).json({message:"Unable to Process Order."});
}