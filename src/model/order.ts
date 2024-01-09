import mongoose,{Schema,Document} from "mongoose";

export interface orderDoc extends Document{
       orderId:string;
       vendorId:string;
       items:[any]; //[{food:"",unit:1}]
       totalAmount:number;
       paidAmount:number;
       orderDate:Date;
       orderStatus:string; //waiting || failed || accept || reject || under-process || ready
       remarks:string;
       deliveryId:string,
       readyTime:number; //max 60min
}

const orderSchema = new Schema({
       orderId:{type:String,required:true},
       vendorId:{type:String,required:true},
       items:[
           {
            food:{type:Schema.Types.ObjectId,ref:"food",required:true},
            unit:{type:Number,required:true}
           }
       ],
       totalAmount:{type:Number,required:true},
       paidAmount:{type:Number,required:true},
       orderDate:{type:Date},
       orderStatus:{type:String},
       remarks:{type:String},
       deliveryId:{type:String},
       readyTime:{type:Number},
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