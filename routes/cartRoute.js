const express = require('express');
const { protect, allowedTo } = require('../controllers/authController');
const { addProductToCart, getLoggedUserCart, removeSpecificCartItem, clearCart, updatequantity, applyCoupon } = require('../controllers/cartController');
const router = express.Router();

router.use(protect , allowedTo("user") )
router.route("/").post( addProductToCart).get(getLoggedUserCart).delete(clearCart);
router.put("/applycoupon" , applyCoupon);
router.route("/:itemId").delete(removeSpecificCartItem).put(updatequantity);
// router.route("/applycoupon").put(applyCoupon);



module.exports = router;
