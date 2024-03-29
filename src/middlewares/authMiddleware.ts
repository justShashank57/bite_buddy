import jwt from 'jsonwebtoken';
import {Request,Response,NextFunction} from 'express'
import { AUTH_SECRET } from '../config';

export const requireAuth = async (req:Request,res:Response,next:NextFunction) =>{
       const token = req.cookies.jwt;
       if(token){
        //   the callback in verify gives error if token is fake and gives decoded payload if its original
          await jwt.verify(token,AUTH_SECRET, async (err:any,decodedToken:any)=>{
                 if(err){
                     console.log(err.message);
                     return res.status(400).json(err.message);
                 }
                 else{
                     req.user = decodedToken;
                     console.log("Decoded token in RequireAuth function: ",decodedToken);
                     return next();
                 }
          })
       }
       else{
           return res.status(400).json({message:"Session Expired."});
       }
}

export const checkUserExistence =async (req:Request,res:Response,next:NextFunction) => {
       const token = req.cookies.jwt;
       if(token){
               jwt.verify(token,AUTH_SECRET,(err:any,payload:any)=>{
                  if(err){
                     console.log(err.message);
                     res.locals.user = null;
                     next();
                  }
                  else{
                      res.locals.user = payload;
                      next();
                  }
               })
       }
       else{
           res.locals.user = null;
           next();
       }
}