const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
const ApiError = require("../utils/apiError");


/**
 * @desc    add address to user address list 
 * @route   /api/v1/addresses
 * @method  POST
 * @access  private user 
 */
exports.addAddress = asyncHandler(async (req , res , next) => {
  // $addToSet => add address object to user address array if address not exist
  const user = await UserModel.findByIdAndUpdate(req.user._id , { 
    $addToSet : {addresses : req.body}
  } , {new : true})

  res.status(200).json({status : "success" , message : "address added successfully to your addressess" , data : user.addresses})
}  )



/**
 * @desc    Remove address from addresses list 
 * @route   /api/v1/addresses/:addressId
 * @method  DELETE
 * @access  private user 
 */
exports.removeAddress = asyncHandler(async (req , res , next) => {
  // $pull => Removeaddress object from user address array if addressId exist
  const user = await UserModel.findByIdAndUpdate(req.user._id , { 
    $pull :  {addresses : {_id : req.params.addressId}}
  } , {new : true})

  res.status(200).json({status : "success" , message : "address Removed successfully from your addresses" , data : user.addresses})
} 
 )


/**
 * @desc    Get logged user addresses 
 * @route   /api/v1/addresses
 * @method  GET
 * @access  private user 
 */
exports.getLoggedUserAddress = asyncHandler(async(req , res , next) => {
  const user = await UserModel.findById(req.user._id).populate("addresses");
  if (!user) {
    return next(new ApiError("user not found"));
  }
res.status(200).json({  ststus : "success" , Result : user.addresses.length, data : user.addresses})

})