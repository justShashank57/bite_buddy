import mongoose,{Schema,Document} from "mongoose";

export interface orderDoc extends Document{
       orderId:string;
       items:[any]; //[{food:"",unit:1}]
       totalAmount:number;
       orderDate:Date;
       paidThrough:string;
       paymentResponse:string; //{status:true,response:some bank response}
       orderStatus:string;
}

const orderSchema = new Schema({
       orderId:{type:String,required:true},
       items:[
           {
            food:{type:Schema.Types.ObjectId,ref:"food",required:true},
            unit:{type:Number,required:true}
           }
       ],
       totalAmount:{type:Number,required:true},
       orderDate:{type:Date},
       paidThrough:{type:String},
       paymentResponse:{type:String},
       orderStatus:{type:String}
},{
    toJSON:{
        transform(doc,ret){
            delete ret.__v,
            delete ret.createdAt,
            delete ret.updatedAt
        }
    },
    timestamps:true
})

const Order = mongoose.model<orderDoc>('order',orderSchema);

export {Order};