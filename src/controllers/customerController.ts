import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import express,{Request,Response,NextFunction} from 'express';
import { createCustomerInputs, customerPayload, userLoginInputs,editCustomerProfileInputs, orderInputs } from '../DTO';
import { generateOtp, generatePassword, generateSalt, generateSignature, onRequestOtp, validatePassword } from '../utility';
import { customer } from '../model/customer';
import { food } from '../model';
import { Order } from '../model/order';
import e from 'express';


const maxAge = 3*24*60*60;
export const customerSignup = async (req:Request,res:Response,next:NextFunction) => {
       const customerInputs = plainToClass(createCustomerInputs,req.body);
       const inputErrors = await validate(customerInputs,{validationError:{target:true}});
       if(inputErrors.length>0){
           return res.status(400).json(inputErrors);
       }
       const {email,password,phone} = customerInputs;

       const existingUser = await customer.findOne({email:email});
       if(existingUser){
           return res.status(409).json({message:"A user exists with the provided email ID."})
       }
       const salt = await generateSalt();
       const userPassword = await generatePassword(password,salt);
       const {otp,expiry} = generateOtp();
       const result = await customer.create({
             email:email,
             password:userPassword,
             salt:salt,
             phone:phone,
             otp:otp,
             otp_expiry:expiry,
             firstName:'',
             lastName:'',
             address:'',
             verified:false,
             lat:0,
             lng:0,
             orders:[]
       })
       if(result){
            //  send otp to customer
               console.log("The result id is: ",result.id)
               await onRequestOtp(otp,phone)
            // generate token 
               const token = await generateSignature({
                     _id:result.id,
                     email:result.email,
                     verified:result.verified,
               })
               res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
               console.log("created JWT cookie.");
            // send the result to client
               return res.status(200).json({token:token,verified:result.verified,email:result.email});
       }
       return res.json({message:"Error with signUp."});
}

export const customerLogin = async (req:Request,res:Response,next:NextFunction) => {
       const loginInputs = plainToClass(userLoginInputs,req.body);
       const loginErrors = await validate(loginInputs,{validationError:{target:false}});
       if(loginErrors.length>0){
          return res.status(400).json(loginErrors);
       }
       const {email,password} = loginInputs;
       const Customer = await customer.findOne({email:email});
       if(Customer){
           const validation = await validatePassword(password,Customer.password,Customer.salt);
           if(validation){
                //  generate signature
                const token = await generateSignature({
                      _id:Customer.id,
                      email:Customer.email,
                      verified:Customer.verified
                })
                res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
                console.log("Created JWT cookie.")
                return res.status(200).json({token:token,verified:Customer.verified,email:Customer.email});
           }
           else{
                return res.status(400).json({message:"Invalid Password."});
           }
       }
       return res.status(404).json({message:"Login error"});
       
}

export const customerVerify = async (req:Request,res:Response,next:NextFunction) => {
             const {otp} = req.body;
             const Customer = req.user as customerPayload;
            //  console.log(Customer)
             if(Customer){
                 const profile = await customer.findById(Customer._id);
                 if(profile){
                    if(profile.otp===parseInt(otp) && profile.otp_expiry>=new Date()){
                        profile.verified = true;
                        const updatedCustomerResponse = await profile.save();

                        // generate signature
                      const token = await generateSignature({
                            _id:updatedCustomerResponse.id,
                            email:updatedCustomerResponse.email,
                            verified:updatedCustomerResponse.verified,
                      })
                      res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
                      console.log("created JWT cookie.");
                      return res.status(200).json({
                        token:token,
                        verified:updatedCustomerResponse.verified,
                        email:updatedCustomerResponse.email
                      });
                    }
                 }
                 else{
                     return res.status(400).json({message:"session not valid"});
                 }
             }
             return res.status(400).json({message:"Error with OTP validation."});
}

export const requestOtp = async (req:Request,res:Response,next:NextFunction) => {
             const Customer = req.user as customerPayload;
             if(Customer){
                 const profile = await customer.findById(Customer._id);
                 if(profile){
                     const {otp,expiry} = generateOtp();
                     profile.otp = otp;
                     profile.otp_expiry = expiry;
                     await profile.save();
                     await onRequestOtp(otp,profile.phone);

                     return res.status(200).json({message:"OTP sent to your registered mobile number."});
                 }
             }
             return res.status(400).json({message:"Error with OTP Request."});
}

export const getCustomerProfile = async (req:Request,res:Response,next:NextFunction) => {
       const Customer = req.user as customerPayload;
       if(Customer){
          const profile = await customer.findById(Customer._id);
          if(profile){
             return res.status(200).json(profile);
          }
       }
       return res.status(400).json({message:"Error while fetching Profile."})
}

export const editCustomerProfile = async (req:Request,res:Response,next:NextFunction) => {
       const Customer = req.user as customerPayload;
       const profileInputs = plainToClass(editCustomerProfileInputs,req.body);
       const profileInputErrors = await validate(profileInputs,{validationError:{target:false}});
       if(profileInputErrors.length>0){
           return res.status(400).json(profileInputErrors);
       }
       const {firstName,lastName,address} = profileInputs;
       if(Customer){
           const profile = await customer.findById(Customer._id);
           if(profile){
              profile.firstName = firstName;
              profile.lastName = lastName;
              profile.address = address;
              const result = await profile.save();
              return res.status(200).json(profile);
           }
       }
}
// cart
export const addToCart= async(req:Request,res:Response,next:NextFunction) =>{
       const Customer = req.user as customerPayload;
       if(Customer){
          const profile = await customer.findById(Customer._id).populate('cart.food');
          let cartItems = Array();
          const {_id,unit} = <orderInputs>req.body;
          const Food = await food.findById(_id);
          if(Food){
            if(profile){
                cartItems = profile.cart;
                if(cartItems.length>0){
                    let existingFood = cartItems.filter((item)=>item.food._id.toString()===_id);
                    if(existingFood.length>0){
                         const index = cartItems.indexOf(existingFood[0]);
                         if(unit>0){
                            cartItems[index] = {food:Food.toObject(),unit:unit};
                         }
                         else{
                            cartItems.splice(index,1);
                         }
                    }else{
                        cartItems.push({food:Food.toObject(),unit:unit});
                    }
                }
                else{
                    cartItems.push({food:Food.toObject(),unit:unit});
                }
                
                if(cartItems){
                    profile.cart = cartItems as any;
                    const cartResult = await profile.save();
                    return res.status(200).json(cartResult.cart);
                }
            }

          }

       }
}

export const getCart= async(req:Request,res:Response,next:NextFunction) =>{
       const Customer = req.user as customerPayload;
       if(Customer){
         const profile = await customer.findById(Customer._id).populate("cart.food");
         if(profile){
              const cart = profile.cart;
              if(cart.length>0){
                 return res.status(200).json(cart);
              }else{
                return res.status(200).json({message:"Cart is empty."});
              }
         }
       }
       return res.status(400).json({message:"Error while Fetching cart."});
}

export const deleteCart= async(req:Request,res:Response,next:NextFunction) =>{
    const Customer = req.user as customerPayload;
    if(Customer){
      const profile = await customer.findById(Customer._id);
      if(profile){
           profile.cart = [] as any;
           const cartResult = await profile.save();
           return res.status(200).json(cartResult);
      }
    }
    return res.status(400).json({message:"Cart is empty."});
}

// order

export const createOrder = async (req:Request,res:Response,next:NextFunction)=>{
    //    grab current customer
          const Customer = req.user as customerPayload;
        //   console.log("create order called.")
          if(Customer){
              //    create an order Id
              const orderId = `${Math.floor(Math.random()*89999)+1000}`;

              const profile = await customer.findById(Customer._id);
              
              // grab order items for request [{id:XX,unit:XX}]
              const cart = <[orderInputs]>req.body; //[{id:XX,unit:XX}] -- this cart comes
              let cartItems = Array(); // this cart goes to user after calculations
              let netAmount = 0.0;
          
              // calculate order amount
              const foods = await food.find().where('_id').in(cart.map(item=>item._id)).exec();
              foods.map(Food=>{
                cart.map(({_id,unit})=>{
                        if(Food._id == _id){
                            netAmount += (Food.price * unit);
                            cartItems.push({food:Food.toObject(),unit});
                        }
                })
              })
          
              // create order with order description
              if(cartItems){
                //  create order
                const currentOrder = await Order.create({
                      orderId:orderId,
                      items:cartItems,
                      totalAmount:netAmount,
                      orderDate: new Date(),
                      paidThrough:'COD',
                      paymentResponse:'',
                      orderStatus:'waiting'
                })
                if(currentOrder){
                    profile.orders.push(currentOrder);
                    await profile.save();
                    return res.status(200).json(currentOrder);
                }
              }
          
              // finally update orders to user account
             
          }
          return res.status(400).json({message:"Error with creating order."}); 
      
}

export const getOrders = async (req:Request,res:Response,next:NextFunction)=>{
             const Customer = req.user as customerPayload;
             if(Customer){
                const profile = await customer.findById(Customer._id).populate("orders");
                if(profile){
                    return res.status(200).json(profile.orders);
                }
             }
             return res.status(400).json({message:"Error while fetching Orders."});
}

export const getOrderById = async (req:Request,res:Response,next:NextFunction)=>{
             const orderId = req.params.id;
             if(orderId){
                const order = await Order.findById(orderId).populate('items.food');
                return res.status(200).json(order);
             }
             return res.status(400).json({message:"Error while fetching your Order."});
}