// email

import { twilio_authToken, twilio_sid } from "../config";

// notifications

// otp
export const generateOtp = ()=> {
       const otp = Math.floor(100000 + Math.random()*900000);
       let expiry = new Date();
       expiry.setTime(new Date().getTime() + (30*60*1000));
       return {otp,expiry};
}

export const onRequestOtp =async (otp:number,toPhoneNumber:string)=>{
       try{
             const accountSid = twilio_sid;
             const authToken = twilio_authToken;
             const client = require('twilio')(accountSid,authToken);
             const response = await client.messages.create({
                   body:`Your OTP is : ${otp}`,
                   from:'+12018841609',
                   to:`+91${toPhoneNumber}`
             })
             return response;
       }
       catch(error){
            console.log("ERROR in requesting OTP : ",error);
            return error;
       }
}

// payment notifications or mails