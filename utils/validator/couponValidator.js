const {check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const CouponModel = require("../../models/couponModel");

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon id format"),
  validatorMiddleWare
];

exports.createCouponValidator = [
  check("name").notEmpty().withMessage("coupon name required")
  .isUppercase().withMessage("coupon name must be uppercase")
  .custom((name) => 
  CouponModel.findOne({name: name}).then((Name) => {
   if (Name){
     return Promise.reject(
       new Error("coupon name already exist")
     );
    }
  }

  )
   )  ,
   check("expire").notEmpty().withMessage("expire date required")
   .isISO8601().toDate().withMessage("expire must be date"),
   check("discount").notEmpty().withMessage("discount required")
   .isNumeric().withMessage("discount must be number"),
  validatorMiddleWare
];

exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon id format"),
  check("name").notEmpty().withMessage("Coupon name can't be empty").optional()
  .isUppercase().withMessage("coupon name must be uppercase")
  .custom((name) => 
  CouponModel.findOne({name: name}).then((Name) => {
   if (Name){
     return Promise.reject(
       new Error("coupon name already exist")
     )}}))  ,
  check("expire").notEmpty().withMessage("expire date required")
  .isISO8601().toDate().withMessage("expire must be date").optional(),
  check("discount").notEmpty().withMessage("discount required")
  .isNumeric().withMessage("discount must be number").optional() ,
  validatorMiddleWare
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon id format"),
  validatorMiddleWare
];