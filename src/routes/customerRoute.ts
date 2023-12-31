import express, { Request,Response,NextFunction } from "express";
import { addToCart, createOrder, createPayment, customerLogin, customerSignup, customerVerify, deleteCart, editCustomerProfile, getCart, getCustomerProfile, getOrderById, getOrders, requestOtp, verifyOffer } from "../controllers";
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
router.post('/cart',addToCart);
router.get('/cart',getCart);
router.delete('/cart',deleteCart);

// Apply Offers
router.get('/verifyOffer/:id',verifyOffer);

// Order
router.post('/create-order',createOrder);
router.get('/orders',getOrders);
router.get('/order/:id',getOrderById);
// Payment
router.post('/create-payment',createPayment);

export {router as customerRoute};