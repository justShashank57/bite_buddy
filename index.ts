import express from "express";
import { AdminRoute,VendorRoute } from "./routes";
import mongoose from "mongoose";
import { MONGODB_URL } from "./config";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/admin',AdminRoute);
app.use('/vendor',VendorRoute);

mongoose.connect(MONGODB_URL).then(result=>{
   console.log("DB CONNECTED !");
}).catch(err=> console.log("ERROR: ",err))
app.get('/',(req,res)=>{
    res.json('Hello from backend, you have requested for HomePage.')
})
app.listen(8000,()=>{
    console.log("Listening to Port : 8000");
})