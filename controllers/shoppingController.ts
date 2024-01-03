import express,{Request,Response,NextFunction} from 'express';
import { food, foodDoc, vendor } from '../model';

export const getFoodAvailability = async (req:Request,res:Response,next:NextFunction) =>{
             const pincode = req.params.pincode;
             const result = await vendor.find({pincode:pincode,serviceAvailable:false})
             .sort([['rating','descending']])
             .populate("foods");
             if(result.length>0){
                return res.status(200).json(result);
             }
             return res.status(400).json({message:"Data not Found"});
}

export const getTopRestaurants = async (req:Request,res:Response,next:NextFunction) =>{
             const pincode = req.params.pincode;
             const result = await vendor.find({pincode:pincode,serviceAvailable:false})
             .sort([['rating','descending']])
             .limit(10);
             if(result.length>0){
                 return res.status(200).json(result);
             }
             return res.status(400).json({message:"Data not Found"});
}

export const getFoodsIn30Min = async (req:Request,res:Response,next:NextFunction) =>{
             const pincode = req.params.pincode;
             const result = await vendor.find({pincode:pincode,serviceAvailable:false})
             .populate("foods");
             if(result.length>0){
                  let foodResult:any = [];
                  result.map((vendor)=>{
                         const foods = vendor.foods as [foodDoc];
                         foodResult.push(...foods.filter(food=>food.readyTime<=30));
                  })

                  return res.status(200).json(foodResult);
             }
             return res.status(400).json({message:"Data not Found"});
}

export const searchFoods = async (req:Request,res:Response,next:NextFunction) =>{
   const pincode = req.params.pincode;
   const result = await vendor.find({pincode:pincode,serviceAvailable:false})
   .populate("foods");
   if(result.length>0){
        let foodResult:any = [];
        result.map((vendor)=>{
               const foods = vendor.foods as [foodDoc];
               foodResult.push(...foods);
        })

        return res.status(200).json(foodResult);
   }
   return res.status(400).json({message:"Data not Found"});
}

export const getRestaurantById = async (req:Request,res:Response,next:NextFunction) =>{
       const id = req.params.id;
       const result = await vendor.findById(id).populate("foods");
       if(result){
           return res.json(result);
       }
       return res.json({message:"Data not found"});
}