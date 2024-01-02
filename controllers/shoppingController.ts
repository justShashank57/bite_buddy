import express,{Request,Response,NextFunction} from 'express';
import { vendor } from '../model';

export const getFoodAvailability = async (req:Request,res:Response,next:NextFunction) =>{
             const pincode = req.params.pincode;
             const result = await vendor.find({pincode:pincode,serviceAvailable:true})
             .sort([['rating','descending']])
             .populate("foods");
             if(result.length>0){
                return res.status(200).json(result);
             }
             return res.status(400).json({"message":"Data not Found"});
}

export const getTopRestaurants = async (req:Request,res:Response,next:NextFunction) =>{
             
}

export const getFoodsIn30Min = async (req:Request,res:Response,next:NextFunction) =>{
             
}

export const searchFoods = async (req:Request,res:Response,next:NextFunction) =>{
             
}

export const getRestaurantById = async (req:Request,res:Response,next:NextFunction) =>{
             
}