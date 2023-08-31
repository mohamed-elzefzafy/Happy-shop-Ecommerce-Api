const express = require('express');
const { protect, allowedTo } = require('../controllers/authController');
const { createcoupon, getCoupons, updateCoupon, deleteCoupon, getOneCoupon } = require('../controllers/couponControler');
const { createCouponValidator, getCouponValidator, updateCouponValidator, deleteCouponValidator } = require('../utils/validator/couponValidator');
const router = express.Router();



router.use(protect , allowedTo("manger" , "admin") )

router.route("/").post(createCouponValidator  , createcoupon).get( getCoupons)
router.route("/:id").get(getCouponValidator , getOneCoupon).put(updateCouponValidator , updateCoupon).delete(deleteCouponValidator , deleteCoupon);

module.exports = router;
