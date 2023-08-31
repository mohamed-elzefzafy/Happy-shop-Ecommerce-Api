const { check } = require("express-validator");
const ProductModel = require("../../models/productModel");
const ApiError = require("../apiError");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const UserModel = require("../../models/userModel");


exports.addProductToWishListVlidator = [
  check("productId").notEmpty().withMessage("you must enter product Id")
  .custom(async(val , {req}) => {
const product  = await ProductModel.findById(req.body.productId);
if (!product) {
  return Promise.reject(
    new ApiError("this product is not found")
  )
}
  }),
  validatorMiddleWare
]


exports.removeProductFromWishListVlidator = [
  check("productId")
  .custom(async(val , {req}) => {
const product  = await UserModel.findById({_id : req.user._id}).findOne({wishList : req.params.productId});
if (!product) {
  return Promise.reject(
    new ApiError("this product is not found")
  )
}
  }),
  validatorMiddleWare
]