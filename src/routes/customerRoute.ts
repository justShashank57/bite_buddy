import express, { Request,Response,NextFunction } from "express";
import { createOrder, customerLogin, customerSignup, customerVerify, editCustomerProfile, getCustomerProfile, getOrderById, getOrders, requestOtp } from "../controllers";
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
router.post('/create-order',createOrder);
router.get('/orders',getOrders);
router.get('/order/:id',getOrderById);
// Order
// Payment


export {router as customerRoute};