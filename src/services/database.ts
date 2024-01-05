import mongoose from "mongoose";
import { MONGODB_URL } from "../config";

export default async () => {
       try{
         await mongoose.connect(MONGODB_URL).then(result=>{
            console.log("DB CONNECTED !");
         }).catch(err=> console.log("ERROR: ",err))
       }
       catch(ex){
             console.log(ex)
       }
}

