import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {Request,Response,NextFunction} from 'express';
import { customerPayload, userLoginInputs,editCustomerProfileInputs,createDeliveryUserInputs } from '../DTO';
import { generatePassword, generateSalt, generateSignature, validatePassword } from '../utility';
import { DeliveryUser } from '../model';

const maxAge = 3*24*60*60;
export const deliveryUserSignup = async (req:Request,res:Response,next:NextFunction) => {
       const deliveryUserInputs = plainToClass(createDeliveryUserInputs,req.body);
       const inputErrors = await validate(deliveryUserInputs,{validationError:{target:true}});
       if(inputErrors.length>0){
           return res.status(400).json(inputErrors);
       }
       const {email,password,phone,address,firstName,lastName,pincode} = deliveryUserInputs;

       const existingDeliveryUser = await DeliveryUser.findOne({email:email});
       if(existingDeliveryUser){
           return res.status(409).json({message:"A Delivery user exists with the provided email ID."})
       }
       const salt = await generateSalt();
       const userPassword = await generatePassword(password,salt);
       const result = await DeliveryUser.create({
             email:email,
             password:userPassword,
             salt:salt,
             phone:phone,
             pincode:pincode,
             verified:false,
             firstName:firstName,
             lastName:lastName,
             address:address,
             lat:0,
             lng:0,
             isAvailable:false
       })
       if(result){
            // generate token 
               const token = await generateSignature({
                     _id:result.id,
                     email:result.email,
                     verified:result.verified,
               })
               res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
               console.log("created JWT cookie.");
            // send the result to client
               return res.status(200).json({token:token,verified:result.verified,email:result.email});
       }
       return res.json({message:"Error with signUp."});
}

export const deliveryUserLogin = async (req:Request,res:Response,next:NextFunction) => {
       const loginInputs = plainToClass(userLoginInputs,req.body);
       const loginErrors = await validate(loginInputs,{validationError:{target:false}});
       if(loginErrors.length>0){
          return res.status(400).json(loginErrors);
       }
       const {email,password} = loginInputs;
       const deliveryUser = await DeliveryUser.findOne({email:email});
       if(deliveryUser){
           const validation = await validatePassword(password,deliveryUser.password,deliveryUser.salt);
           if(validation){
                //  generate signature
                const token = await generateSignature({
                      _id:deliveryUser.id,
                      email:deliveryUser.email,
                      verified:deliveryUser.verified
                })
                res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
                console.log("Created JWT cookie.")
                return res.status(200).json({token:token,verified:deliveryUser.verified,email:deliveryUser.email});
           }
           else{
                return res.status(400).json({message:"Invalid Password."});
           }
       }
       return res.status(404).json({message:"Login error"});
       
}


export const getDeliveryUserProfile = async (req:Request,res:Response,next:NextFunction) => {
       const deliveryUser = req.user as customerPayload;
       if(deliveryUser){
          const profile = await DeliveryUser.findById(deliveryUser._id);
          if(profile){
             return res.status(200).json(profile);
          }
       }
       return res.status(400).json({message:"Error while fetching Profile."})
}

export const editDeliveryUserProfile = async (req:Request,res:Response,next:NextFunction) => {
       const deliveryUser = req.user as customerPayload;
       const profileInputs = plainToClass(editCustomerProfileInputs,req.body);
       const profileInputErrors = await validate(profileInputs,{validationError:{target:false}});
       if(profileInputErrors.length>0){
           return res.status(400).json(profileInputErrors);
       }
       const {firstName,lastName,address} = profileInputs;
       if(deliveryUser){
           const profile = await DeliveryUser.findById(deliveryUser._id);
           if(profile){
              profile.firstName = firstName;
              profile.lastName = lastName;
              profile.address = address;
              const result = await profile.save();
              return res.status(200).json(result);
           }
       }
       return res.status(400).json({message:"Error while editing Profile."})
}

export const updateDeliveryUserStatus =async (req:Request,res:Response,next:NextFunction) => {
       const deliveryUser = req.user as customerPayload;
       const {lat,lng} = req.body;
       if(deliveryUser){
          const profile = await DeliveryUser.findById(deliveryUser._id);
          if(profile){
             if(lat && lng){
                profile.lat = lat;
                profile.lng = lng;
             }
             profile.isAvailable = !profile.isAvailable;
             const savedResult = await profile.save();
             return res.json(savedResult);
          }
       }
       else{
          return res.json({"message":"Error with updating status."});
       }
}


