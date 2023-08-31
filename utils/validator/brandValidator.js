const {check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const BrandModel = require("../../models/brandModel");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validatorMiddleWare
];

exports.createBrandValidator = [
  check("name").notEmpty().withMessage("Brand required")
  .isLength({min : 3}).withMessage("too short Brand name")
  .isLength({max : 32}).withMessage("too long Brand name")
  .custom((name) => 
  BrandModel.findOne({name: name}).then((Name) => {
   if (Name){
     return Promise.reject(
       new Error("title already exist")
     );
    }
  }

  )
   )  ,
  validatorMiddleWare
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validatorMiddleWare ,
  check("name").notEmpty().withMessage("Brand name can't be empty")
  .isLength({min : 3}).withMessage("too short")
  .isLength({max : 32}).withMessage("too long Brand name")
  .optional() ,
  validatorMiddleWare
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validatorMiddleWare
];