import mongoose, { Schema } from "mongoose";
import { orderDoc } from "./order";

interface deliveryUserDoc extends Document{
    email:string;
    password:string;
    salt:string;
    firstName:string;
    lastName:string;
    address:string;
    phone:string;
    pincode:string;
    verified:boolean;
    lat:number;
    lng:number;
    isAvailable:boolean;
}
const deliveryUserSchema = new Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    salt:{type:String,required:true},
    firstName:{type:String},
    lastName:{type:String},
    address:{type:String},
    phone:{type:String,required:true},
    pincode:{type:String},
    verified:{type:Boolean,required:true},
    lat:{type:Number},
    lng:{type:Number},
    isAvailable:{type:Boolean}
},{
        toJSON:{
            transform(doc,ret){
                delete ret.password;
                delete ret.salt;
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
            }
        },
        timestamps:true
    }
    )

const DeliveryUser = mongoose.model<deliveryUserDoc>('delivery_user',deliveryUserSchema);

export {DeliveryUser};