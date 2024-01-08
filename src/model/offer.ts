import mongoose, { Schema,Document } from "mongoose";

export interface offerDoc extends Document{
       offerType:string; //VENDOR  // GENERIC
       vendors:[any];  //vendorId
       title:string;   //INR 200 off on week days
       description:string;
       minValue:number; //minimum amount
       offerAmount:number;
       startValidity:Date; 
       endValidity:Date;
       promocode:string; //WEEK200
       promotype:string; //USER // BANK // CARD //ALL
       bank:[any];
       bins:[any];
       pincode:string;
       isActive:boolean; 
}

const offerSchema = new Schema({
      offerType:{type:String,required:true}, //VENDOR  // GENERIC
      vendors:[{
            type:Schema.Types.ObjectId,ref:'vendor'
      }],  //vendorId
      title:{type:String,required:true},  //INR 200 off on week days
      description:String,
      minValue:{type:Number,required:true}, //minimum amount
      offerAmount:{type:Number,required:true},
      startValidity:Date,
      endValidity:Date,
      promocode:{type:String,required:true}, //WEEK200
      promotype:{type:String,required:true}, //USER // BANK // CARD //ALL
      bank:[{type:String}],
      bins:[{type:Number}],
      pincode:{type:String,required:true},
      isActive:Boolean
},{
    toJSON:{
        transform(doc,ret){
            delete ret.__v,
            delete ret.createdAt,
            delete ret.updatedAt
        },
        timestamps:true
    }
})

const Offer = mongoose.model<offerDoc>('offer',offerSchema);

export{Offer};