const express = require('express');
const { protect, allowedTo } = require('../controllers/authController');
const { createCashOrder, getAllOrders, filterOrderForLoggedUser, getOneOrder, updateOrderToPaid, updateOrderToDeliverd, checkOutSession } = require('../controllers/orderController');
const router = express.Router();

router.route("/checkoutsession/:cartId").get( protect , allowedTo("user") , checkOutSession);
router.route("/").get(protect ,  allowedTo("user" , "manger" , "admin") , filterOrderForLoggedUser , getAllOrders);
router.route("/:cartId").post(protect , allowedTo( "user") , createCashOrder);
router.route("/:id").get(protect ,  allowedTo("admin" , "manger" , "user") , filterOrderForLoggedUser , getOneOrder);
router.route("/:id/pay").put(protect ,  allowedTo("admin" , "manger") , updateOrderToPaid); 
router.route("/:id/deliver").put(protect ,  allowedTo("admin" , "manger") , updateOrderToDeliverd); 

module.exports = router;
