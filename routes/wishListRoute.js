const express = require('express');
const { protect, allowedTo } = require('../controllers/authController');
const { addProductToWishList , removeProductFromWishList, getLoggedUserWishList } = require('../controllers/wishListController');
const { addProductToWishListVlidator, removeProductFromWishListVlidator } = require('../utils/validator/wishListValidator');
const router = express.Router();

router.use(protect , allowedTo("user") )
router.route("/").post( addProductToWishListVlidator , addProductToWishList).get( getLoggedUserWishList)
router.route("/:productId").delete( removeProductFromWishListVlidator  , removeProductFromWishList);

module.exports = router;
