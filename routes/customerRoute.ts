import express, { Request,Response,NextFunction } from "express";
import { customerLogin, customerSignup, customerVerify, editCustomerProfile, getCustomerProfile, requestOtp } from "../controllers";
import { requireAuth } from "../middlewares";

const router = express.Router();

// ----------------Create/Signup customer----------------
router.post('/signup',customerSignup);

// -----------------------Login--------------------------
router.post('/login',customerLogin);


// Authentication
router.use(requireAuth);

// ------------------verify customer Account-------------
router.patch('/verify',customerVerify);

// -------------------OTP/request OTP--------------------
router.get('/otp',requestOtp);

// ------------------------Profile-----------------------
router.get('/profile',getCustomerProfile);
router.patch('/profile',editCustomerProfile);


// Cart
// Order
// Payment


export {router as customerRoute};