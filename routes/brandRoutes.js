const express = require('express');
const { getBrands,  createBrand, getOneBrand, updateBrand, deleteBrand, uploadBrandImage, resizeImageBrand } = require('../controllers/brandControler');
const { createBrandValidator, getBrandValidator,
   updateBrandValidator, deleteBrandValidator } = require('../utils/validator/brandValidator');
const { protect, allowedTo } = require('../controllers/authController');

const router = express.Router();




router.route("/").get(getBrands).post(protect , allowedTo("admin" , "manger" ) , uploadBrandImage , resizeImageBrand , createBrandValidator ,  createBrand);
router.route("/:id")
.get(getBrandValidator, getOneBrand)
.put(protect , allowedTo("admin" , "manger" ) , uploadBrandImage , resizeImageBrand ,updateBrandValidator , updateBrand)
.delete(protect , allowedTo("admin") , deleteBrandValidator, deleteBrand);









module.exports = router;