const {check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const CategoryModel = require("../../models/categoryModel");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleWare
];

exports.createCategoryValidator = [
  check("name").notEmpty().withMessage("Category required")
  .isLength({min : 3}).withMessage("too short")
  .isLength({max : 32}).withMessage("too long category name")
  .custom((name) => 
  CategoryModel.findOne({name: name}).then((subcategory) => {
   if (subcategory){
     return Promise.reject(
       new Error("Category already exist")
     );
    }
  }

  )
   ) ,
  validatorMiddleWare
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleWare ,
  check("name").notEmpty().withMessage("Category name can't be empty")
  .isLength({min : 3}).withMessage("too short")
  .isLength({max : 32}).withMessage("too long category name")
  .optional() ,
  validatorMiddleWare
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleWare
];