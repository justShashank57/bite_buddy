import express from 'express'
import { getFoodAvailability, getFoodsIn30Min, getRestaurantById, getTopRestaurants, searchFoods } from '../controllers';
const router = express.Router();

// -----------------Food Availability-------------------
router.get('/:pincode',getFoodAvailability);

// --------------------Top Restaurants------------------
router.get('/top-restaurants/:pincode',getTopRestaurants);

// ----------------Foods Available in 30 mins---------------
router.get('/foods-in-30-min/:pincode',getFoodsIn30Min);

// ------------------Search Foods--------------------
router.get('/search/:pincode',searchFoods);

// -----------------Find Restaurant by Id---------------
router.get('/restaurant/:id',getRestaurantById);

export {router as shoppingRoute};



