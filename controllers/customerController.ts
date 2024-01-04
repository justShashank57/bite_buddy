import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import express,{Request,Response,NextFunction} from 'express';
import { createCustomerInputs, customerPayload, userLoginInputs,editCustomerProfileInputs } from '../DTO';
import { generateOtp, generatePassword, generateSalt, generateSignature, onRequestOtp, validatePassword } from '../utility';
import { customer } from '../model/customer';


const maxAge = 3*24*60*60;
export const customerSignup = async (req:Request,res:Response,next:NextFunction) => {
       const customerInputs = plainToClass(createCustomerInputs,req.body);
       const inputErrors = await validate(customerInputs,{validationError:{target:true}});
       if(inputErrors.length>0){
           return res.status(400).json(inputErrors);
       }
       const {email,password,phone} = customerInputs;

       const existingUser = await customer.findOne({email:email});
       if(existingUser){
           return res.status(409).json({message:"A user exists with the provided email ID."})
       }
       const salt = await generateSalt();
       const userPassword = await generatePassword(password,salt);
       const {otp,expiry} = generateOtp();
       const result = await customer.create({
             email:email,
             password:userPassword,
             salt:salt,
             phone:phone,
             otp:otp,
             otp_expiry:expiry,
             firstName:'',
             lastName:'',
             address:'',
             verified:false,
             lat:0,
             lng:0
       })
       if(result){
            //  send otp to customer
               console.log("The result id is: ",result.id)
               await onRequestOtp(otp,phone)
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

export const customerLogin = async (req:Request,res:Response,next:NextFunction) => {
       const loginInputs = plainToClass(userLoginInputs,req.body);
       const loginErrors = await validate(loginInputs,{validationError:{target:false}});
       if(loginErrors.length>0){
          return res.status(400).json(loginErrors);
       }
       const {email,password} = loginInputs;
       const Customer = await customer.findOne({email:email});
       if(Customer){
           const validation = await validatePassword(password,Customer.password,Customer.salt);
           if(validation){
                //  generate signature
                const token = await generateSignature({
                      _id:Customer.id,
                      email:Customer.email,
                      verified:Customer.verified
                })
                res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
                console.log("Created JWT cookie.")
                return res.status(200).json({token:token,verified:Customer.verified,email:Customer.email});
           }
           else{
                return res.status(400).json({message:"Invalid Password."});
           }
       }
       return res.status(404).json({message:"Login error"});
       
}

export const customerVerify = async (req:Request,res:Response,next:NextFunction) => {
             const {otp} = req.body;
             const Customer = req.user as customerPayload;
            //  console.log(Customer)
             if(Customer){
                 const profile = await customer.findById(Customer._id);
                 if(profile){
                    if(profile.otp===parseInt(otp) && profile.otp_expiry>=new Date()){
                        profile.verified = true;
                        const updatedCustomerResponse = await profile.save();

                        // generate signature
                      const token = await generateSignature({
                            _id:updatedCustomerResponse.id,
                            email:updatedCustomerResponse.email,
                            verified:updatedCustomerResponse.verified,
                      })
                      res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
                      console.log("created JWT cookie.");
                      return res.status(200).json({
                        token:token,
                        verified:updatedCustomerResponse.verified,
                        email:updatedCustomerResponse.email
                      });
                    }
                 }
                 else{
                     return res.status(400).json({message:"session not valid"});
                 }
             }
             return res.status(400).json({message:"Error with OTP validation."});
}

export const requestOtp = async (req:Request,res:Response,next:NextFunction) => {
             const Customer = req.user as customerPayload;
             if(Customer){
                 const profile = await customer.findById(Customer._id);
                 if(profile){
                     const {otp,expiry} = generateOtp();
                     profile.otp = otp;
                     profile.otp_expiry = expiry;
                     await profile.save();
                     await onRequestOtp(otp,profile.phone);

                     return res.status(200).json({message:"OTP sent to your registered mobile number."});
                 }
             }
             return res.status(400).json({message:"Error with OTP Request."});
}

export const getCustomerProfile = async (req:Request,res:Response,next:NextFunction) => {
       const Customer = req.user as customerPayload;
       if(Customer){
          const profile = await customer.findById(Customer._id);
          if(profile){
             return res.status(200).json(profile);
          }
       }
       return res.status(400).json({message:"Error while fetching Profile."})
}

export const editCustomerProfile = async (req:Request,res:Response,next:NextFunction) => {
       const Customer = req.user as customerPayload;
       const profileInputs = plainToClass(editCustomerProfileInputs,req.body);
       const profileInputErrors = await validate(profileInputs,{validationError:{target:false}});
       if(profileInputErrors.length>0){
           return res.status(400).json(profileInputErrors);
       }
       const {firstName,lastName,address} = profileInputs;
       if(Customer){
           const profile = await customer.findById(Customer._id);
           if(profile){
              profile.firstName = firstName;
              profile.lastName = lastName;
              profile.address = address;
              const result = await profile.save();
              return res.status(200).json(profile);
           }
       }
}