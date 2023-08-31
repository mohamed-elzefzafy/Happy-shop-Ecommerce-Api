const express = require('express');
const { getProducts, createProduct, getOneProduct, updateProduct, deleteProduct, updateProductImages, resizeImageProduct } = require('../controllers/productController');
const { createProductValidator, getProductValidator, updateProductValidator, deleteProductValidator } = require('../utils/validator/productValidator');
const { protect, allowedTo } = require('../controllers/authController');
const reviewRouter = require("./reviewRoutes")
const router = express.Router();



// Nested route
router.use("/:productId/reviews" , reviewRouter)

router.route("/").get(getProducts).post(protect , allowedTo("admin" , "manger" ) , updateProductImages , resizeImageProduct, createProductValidator , createProduct);
router.route("/:id").get(getProductValidator , getOneProduct)
.put(protect , allowedTo("admin" , "manger" ) , updateProductImages , resizeImageProduct , updateProductValidator , updateProduct)
.delete(protect , allowedTo("admin") , deleteProductValidator , deleteProduct);


module.exports = router;