const asyncHandler = require("express-async-handler");
const ProductModel = require("../models/productModel");
const ApiError = require("../utils/apiError");
const CouponModel = require("../models/couponModel");
const CartModel = require("../models/cartModel");



const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
   totalPrice += (item.price * item.quantity);
  })
  cart.totalCartPrice = totalPrice;
  cart.totalCartPriceAfterDiscount  =  undefined;
  return totalPrice;
}

/**
 * @desc    add Product to Cart
 * @route   /api/v1/cart
 * @method  POST
 * @access  private /user
 */
exports.addProductToCart = asyncHandler(async(req , res , next) => {
  const {productId , color} = req.body;
  const product = await ProductModel.findById(productId)
  // 1- get cart for logged user 
  let cart = await CartModel.findOne({user : req.user._id});
  if (!cart) {
    // create cart for logged user with product 
     cart = await CartModel.create({
      user : req.user._id,
      cartItems :[{product : productId, color ,  price : product.price}]

     });
  } else {
    // product exit in cart update product quantity

  const  ProductIndex = cart.cartItems.findIndex((item) => item.product.toString() === productId && item.color === color);
   
  if (ProductIndex > -1) {
  const cartItem =   cart.cartItems[ProductIndex];
    cartItem.quantity += 1;
    cart.cartItems[ProductIndex] = cartItem;
  } else {
    // product not exit push product to cartitems array
    // cart = await CartModel.findOneAndUpdate({cartItems :[{product : productId, color ,  price : product.price}]} , {new : true} )
    cart.cartItems.push({product : productId, color , price : product.price});
  }
  }


 // calculate total cart price
 calcTotalCartPrice(cart);

  await cart.save();
  
  res.status(200).json({status : "success" , message : "product added to cart successfully" , result : cart.cartItems.length, data : cart});

}) 


/**
 * @desc    get Logged UserCart
 * @route   /api/v1/cart
 * @method  GET
 * @access  private /user
 */

exports.getLoggedUserCart = asyncHandler(async(req , res , next) => {
  // const user = await UserModel.findById(req.user._id);
  const cart = await CartModel.findOne({user : req.user._id});
  if (!cart) {
 return next(new ApiError(`you dont have cart for this user id ${req.user._id}` , 404));
  }
  calcTotalCartPrice(cart);
res.status(200).json({ status : "success" , result : cart.cartItems.length , data : cart});
})


/**
 * @desc    Remove specific cart item
 * @route   /api/v1/cart/:itemId
 * @method  DELETE
 * @access  private /user
 */
exports.removeSpecificCartItem = asyncHandler(async(req , res , next) => {
  const cart = await CartModel.findOneAndUpdate({user : req.user._id} , 
    {$pull : {cartItems : {_id : req.params.itemId}}} , {new : true});
    calcTotalCartPrice(cart);

    await cart.save();
    res.status(200).json({ status : "success" , result : cart.cartItems.length , data : cart});
})

/**
 * @desc    clear logged user Cart
 * @route   /api/v1/cart
 * @method  DELETE
 * @access  private /user
 */

exports.clearCart = asyncHandler( async(req , res , next) => {
  await CartModel.findOneAndDelete({user : req.user._id});
  res.status(204).send();
})



/**
 * @desc    update specific item quantity
 * @route   /api/v1/cart/:itemId
 * @method  PUT
 * @access  private /user
 */
exports.updatequantity = asyncHandler( async(req , res , next) => {
  const cart = await CartModel.findOne({user : req.user._id});
  if (!cart) {
    return next(new ApiError(`ther is no cart for this user ${req.user._id}`  , 404));
  }
const itemIndex = cart.cartItems.findIndex((item) => 
  item._id.toString() === req.params.itemId
)
if (itemIndex < 0) 
  {
    return next(new ApiError(`this item with id ! ${req.params.itemId} not found` , 404));
  }

cart.cartItems[itemIndex].quantity = req.body.quantity;
calcTotalCartPrice(cart);
await cart.save();
  calcTotalCartPrice(cart);
  res.status(200).json({ status : "success"  , data : cart});
})



/**
 * @desc    apply coupon on logged user Cart
 * @route   /api/v1/cart/applycoupon
 * @method  PUT
 * @access  private /user
 */

exports.applyCoupon  = asyncHandler(async (req , res , next) => {
   // 1) Get coupon based on coupon name
   const coupon = await CouponModel.findOne({name : req.body.coupon , expire : {$gt : Date.now()}})
   if (!coupon) 
   {
    return next(new ApiError(`Coupon ${req.body.coupon} invalid or expired` , 404));
   }
// 2) Get logged user cart to get total cart price
const cart = await CartModel.findOne({user : req.user._id});
const totalPrice = cart.totalCartPrice;
 // 3) Calculate price after priceAfterDiscount
 const totalPriceAfterDiscount = (totalPrice - (totalPrice * coupon.discount)/100).toFixed(2);
cart.totalCartPriceAfterDiscount  =  totalPriceAfterDiscount;
await cart.save();
res.status(200).json({ status : "success" , result : cart.cartItems.length , data : cart});
})