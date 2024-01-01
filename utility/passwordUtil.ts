import bcrypt from "bcrypt";
import { vendorPayloadInputs } from "../DTO";
import jwt from "jsonwebtoken"
import { AUTH_SECRET } from "../config";
import { AuthPayload } from "../DTO/Auth.dto";

export const generateSalt = async ()=>{
       return await bcrypt.genSalt();
}
export const generatePassword = async (password:string,salt:string) => {
       // console.log("GENERATE PASSWORD CALLED !!!!")
       return await bcrypt.hash(password,salt);
}

export const validatePassword = async (enteredPassword:string,savedPassword:string,salt:string) => {
       return await generatePassword(enteredPassword,salt) === savedPassword;
}

export const generateSignature =async (payload:vendorPayloadInputs) => {
       return jwt.sign(payload,AUTH_SECRET,{expiresIn:'3D'});
}

export const validateSignature =async (req:Request) => {
       
}