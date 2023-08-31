const factory = require("./handlerFactory");
const CouponModel = require("../models/couponModel");



/**
 * @desc    get list of Coupons
 * @route   /api/v1/coupons
 * @method  GET
 * @access  private /Admin - Manger
 */
exports.getCoupons =  factory.getAll(CouponModel);


/**
 * @desc    get specific Coupon by id
 * @route   /api/v1/coupons/:id
 * @method  GET
 * @access private /Admin - Manger
 */
exports.getOneCoupon = factory.getOneById(CouponModel)


/**
 * @desc    create Coupon
 * @route   /api/v1/coupons
 * @method  POST
 * @access  private /Admin - Manger
 */


exports.createcoupon = factory.createOne(CouponModel)



/**
 * @desc    update coupon
 * @route   /api/v1/coupons/:id
 * @method  PUT
 * @access  private /Admin - Manger
 */


exports.updateCoupon = factory.updateOne(CouponModel)


/**
 * @desc    Delete coupon
 * @route   /api/v1/coupons/:id
 * @method  DELETE
 * @access  private /Admin - Manger
 */


exports.deleteCoupon = factory.deleteOne(CouponModel)
