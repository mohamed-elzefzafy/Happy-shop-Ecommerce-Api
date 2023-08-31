const {check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const reviewModel = require("../../models/reviewModel");



exports.createReviewValidator = [
  check("title").optional()
  .isLength({min : 3}).withMessage("too short Review title")
  .isLength({max : 32}).withMessage("too long Review title"),
  check("ratings").notEmpty().withMessage("ratings valu required")
  .isFloat({min : 1 , max :5}).withMessage("Rating value must be between 1 and 5"),
  check("user").isMongoId().withMessage("Invalid user id format"),
  check("product").isMongoId().withMessage("Invalid product id format")
  .custom((val , {req}) => 
     // Check if logged user create review before
     reviewModel.findOne({ user : req.user._id ,  product : req.body.product}).then((review) => {
      if (review) {
        return Promise.reject(
          new Error("you have reviewed this product before")
        );
      }
     })

  ),

  validatorMiddleWare
];



exports.getOneReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleWare
];



exports.updateReviewValidator = [
  check("id").isMongoId().withMessage("Invalid review id format")
  .custom((val , {req}) => 
       // Check review ownership before update
    reviewModel.findById(val).then((review) => {
      if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));  
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new Error(`Your are not allowed to perform this action`)
        );    
      }

    } )
   ),

  check("title").notEmpty().withMessage("Brand name can't be empty")
  .isLength({min : 3}).withMessage("too short review title")
  .isLength({max : 32}).withMessage("too long review title")
  .optional() ,
  check("ratings").notEmpty().withMessage("ratings valu required").optional()
  .isFloat({min : 1 , max :5}).withMessage("Rating value must be between 1 and 5"),
  check("user").isMongoId().withMessage("Invalid user id format").optional(),
  check("product").isMongoId().withMessage("Invalid product id format").optional()
  ,
  validatorMiddleWare
];

exports.deleteReviewValidator = [
  check("id").isMongoId().withMessage("Invalid review id format")
  .custom((val , {req}) => {
  // Check review ownership before update
  if (req.user.role === "user") {
     // Check review ownership before update
    return reviewModel.findById(val).then((review) => {
      if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));  
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new Error(`Your are not allowed to perform this action`)
        );    
      }
    
    } )
    
}
return true;
}
),


  validatorMiddleWare
];


