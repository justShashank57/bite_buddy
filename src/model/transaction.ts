import mongoose,{Schema,Document} from "mongoose";

export interface transactionDoc extends Document{
    customer:string;
    vendorId:string;
    orderId:string;
    orderValue:number;
    offerUsed:string;
    status:string;
    paymentMode:string;
    paymentResponse:string;
}

const transactionSchema = new Schema({
    customer:String,
    vendorId:String,
    orderId:String,
    orderValue:Number,
    offerUsed:String,
    status:String,
    paymentMode:String,
    paymentResponse:String,
},{
    toJSON:{
        transform(doc,ret){
            delete ret.__v
        }
    },
    timestamps:true
})

const Transaction = mongoose.model<transactionDoc>('transaction',transactionSchema);

export {Transaction};