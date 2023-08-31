const {check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const SubCategoryModel = require("../../models/subCategoryModel");






exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  validatorMiddleWare
];

exports.createSubCategoryValidator = [
  check("name").notEmpty().withMessage("subCategory required")
  .isLength({min : 2}).withMessage("too short")
  .isLength({max : 32}).withMessage("too long subcategory name") 
    .custom((name) => 
   SubCategoryModel.findOne({name: name}).then((subcategory) => {
    if (subcategory){
      return Promise.reject(
        new Error("subCategory already exist")
      );
     }
   }

   )
    ),
  validatorMiddleWare ,
  check("category").notEmpty().withMessage("subCategory must be belong to parent Category")
  .isMongoId().withMessage("Invalid Category id format"),
  validatorMiddleWare
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  validatorMiddleWare ,
  check("name").notEmpty().withMessage("subCategory name can't be empty")
  .isLength({min : 2}).withMessage("too short")
  .isLength({max : 32}).withMessage("too long subcategory name")
  .optional() ,
  validatorMiddleWare
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  validatorMiddleWare
];