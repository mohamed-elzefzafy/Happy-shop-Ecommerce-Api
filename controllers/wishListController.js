const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
const ApiError = require("../utils/apiError");


/**
 * @desc    add product to wishList 
 * @route   /api/v1/wishlist
 * @method  POST
 * @access  private user 
 */
exports.addProductToWishList = asyncHandler(async (req , res , next) => {
  // $addToSet => add productId to wishlist array if productId not exist
  const user = await UserModel.findByIdAndUpdate(req.user._id , { 
    $addToSet : {wishList : req.body.productId}
  } , {new : true})

  res.status(200).json({status : "success" , message : "Product added successfully to your wishlist" , data : user.wishList})
}  )



/**
 * @desc    Remove product from wishList 
 * @route   /api/v1/wishlist/:productId
 * @method  DELETE
 * @access  private user 
 */
exports.removeProductFromWishList = asyncHandler(async (req , res , next) => {
  // $pull => Remove productId from wishlist array if productId exist
  const user = await UserModel.findByIdAndUpdate(req.user._id , { 
    $pull : {wishList : req.params.productId}
  } , {new : true})

  res.status(200).json({status : "success" , message : "Product Remove successfully from your wishlist" , data : user.wishList})
}  )


/**
 * @desc    Get logged user wishList 
 * @route   /api/v1/wishlist
 * @method  GET
 * @access  private user 
 */
exports.getLoggedUserWishList = asyncHandler(async(req , res , next) => {
  const user = await UserModel.findById(req.user._id).populate("wishList");
  if (!user) {
    return next(new ApiError("user not found"));
  }
res.status(200).json({  ststus : "success" , Result : user.wishList.length, data : user.wishList})

})