const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET)
const CartModel = require("../models/cartModel");
const ApiError = require("../utils/apiError");
const OrderModel = require("../models/orderModel");
const ProductModel = require("../models/productModel")
const factory = require("./handlerFactory");
const UserModel = require("../models/userModel");


/**
 * @desc    create cash order
 * @route   /api/v1/orders/cartId
 * @method  POST
 * @access  private /user
 */
exports.createCashOrder = asyncHandler(async(req , res , next) => { 
   // app settings
   const taxPrice = 0;
   const shippingPrice = 0;
// 1 - Get cart depend on cartId
const cart = await CartModel.findById(req.params.cartId);
if (!cart) {
  return next(new ApiError(`there is no cart for this Id ${req.params.cartId}` , 404));
}
// 2 - Get order price depend on cart price "Check if coupon apply"
const cartPrice = cart.totalCartPriceAfterDiscount?cart.totalCartPriceAfterDiscount : cart.totalCartPrice;
const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
// 3 - Create order with default paymentMethodType cash
const order = await OrderModel.create({user : req.user._id , cartItems : cart.cartItems , totalOrderPrice 
,shippinAddress : req.body.shippinAddress});
// 4 - After creating order, decrement product quantity, increment product sold
if (!order) {
  return next(new ApiError(`there is no order`, 404 ));
}
const bulkoption = cart.cartItems.map((item) => ({
  updateOne : {
    filter : {_id : item.product},
    update : {$inc :{quantity : -item.quantity , sold : +item.quantity} }
  }
  }))
  await ProductModel.bulkWrite(bulkoption , {})
// 5 -  Clear cart depend on cartId
await CartModel.findByIdAndDelete(req.params.cartId);

res.status(201).json({statue : "success" , data : order})

}) 



exports.filterOrderForLoggedUser = asyncHandler(async( req , res , next) => {
  if (req.user.role ===  "user") {
    req.filterObject = {user : req.user._id }
  }
  next();
})
/**
 * @desc    get all orders
 * @route   /api/v1/orders
 * @method  GET
 * @access  private /user Admin manger
 */
exports.getAllOrders = factory.getAll(OrderModel);


/**
 * @desc    get specific order
 * @route   /api/v1/orders
 * @method  GET
 * @access  private /user Admin manger
 */
exports.getOneOrder = factory.getOneById(OrderModel);

/**
 * @desc    update order paid status to paid 
 * @route   /api/v1/orders/:id/pay
 * @method  PUT
 * @access  private /user Admin manger
 */

exports.updateOrderToPaid = asyncHandler(async(req , res , next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(new  ApiError(`there is no order for this id ${req.params.id}` , 404))
  }

  // update order paid details 
order.isPaid = true;
order.paidAt = Date.now();
const updatedOrder = await order.save();
  res.status(200).json({order : updatedOrder});
})


/**
 * @desc    update order deliverd status  
 * @route   /api/v1/orders/:id/deliver
 * @method  PUT
 * @access  private /user Admin manger
 */

exports.updateOrderToDeliverd = asyncHandler(async(req , res , next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(new  ApiError(`there is no order for this id ${req.params.id}` , 404))
  }

  // update order deliverd details
order.isDelivered = true;
order.deliveredAt = Date.now();
const updatedOrder = await order.save();
  res.status(200).json({order : updatedOrder});
})

/**
 * @desc    get checkout session from stripe and send it as response 
 * @route   /api/v1/orders/checkout-session/:cartId
 * @method  GET
 * @access  private /user 
 */
exports.checkOutSession = asyncHandler(async(req , res , next) => {
     // app settings
     const taxPrice = 0;
     const shippingPrice = 0;

  // 1- Get cart depend on cartId
  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(`there is no cart for this Id ${req.params.cartId}` , 404));
  }
  // 2- Get order price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalCartPriceAfterDiscount?cart.totalCartPriceAfterDiscount : cart.totalCartPrice;
const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3- Create stripe checkout session
  
  const session = await stripe.checkout.sessions.create({
    line_items: [ 
      { 
        price_data: { 
          currency: "egp", 
          product_data: { 
            name: req.user.name,
          }, 
          unit_amount: totalOrderPrice * 100, 
        }, 
        quantity: 1, 
      }, 
    ], 
    mode: 'payment',
  success_url: `${req.protocol}://${req.get('host')}/orders`,
  cancel_url: `${req.protocol}://${req.get('host')}/cart`,
  customer_email: req.user.email,
  client_reference_id: req.params.cartId,
  metadata: req.body.shippinAddress,
  })
  // 4- send session to response

  res.status(200).json({status :"success" , session})
})



const createCardOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const oderPrice = session.amount_total / 100;

  const cart = await CartModel.findById(cartId);
  const user = await UserModel.findOne({ email: session.customer_email });

  // 3) Create order with default paymentMethodType card
  const order = await OrderModel.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippinAddress :shippingAddress ,
    totalOrderPrice: oderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: 'card',
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await CartModel.findByIdAndDelete(cartId);
  }
};



/**
 * @desc    This webhook will run when stripe payment success paid
 * @route   /webhook-checkout
 * @method  POST 
 * @access  private /user
 */



exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );             
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    //  Create order
    createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
});
