import express, { Request,Response,NextFunction } from "express";
import { addToCart, createOrder, createPayment, customerLogin, customerSignup, customerVerify, deleteCart, deliveryUserLogin, deliveryUserSignup, editCustomerProfile, editDeliveryUserProfile, getCart, getCustomerProfile, getDeliveryUserProfile, getOrderById, getOrders, requestOtp, updateDeliveryUserStatus, verifyOffer } from "../controllers";
import { requireAuth } from "../middlewares";

const router = express.Router();

// ----------------Create/Signup customer----------------
router.post('/signup',deliveryUserSignup);

// -----------------------Login--------------------------
router.post('/login',deliveryUserLogin);


// Authentication
router.use(requireAuth);

// ------------------------change service status-----------------------
router.put('/change-status',updateDeliveryUserStatus);

// ------------------------Profile-----------------------
router.get('/profile',getDeliveryUserProfile);
router.patch('/profile',editDeliveryUserProfile);


export {router as deliveryRoute};