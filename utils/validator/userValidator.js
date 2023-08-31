const {check } = require("express-validator");
const bcrypt = require("bcryptjs");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const UserModel = require("../../models/userModel");
const ApiError = require("../apiError");




exports.createUserValidator = [
  check("name").notEmpty().withMessage("user name required")
  .isLength({min : 3}).withMessage("too short"),
  validatorMiddleWare,
  check("email").notEmpty().withMessage("email required")
  .isEmail().withMessage("invalid email")
  .custom((val) => 
  UserModel.findOne({email : val}).then((useremail) => 
    { if (useremail) {
    return Promise.reject(
      new ApiError("this email is already exist please login")
    )}})),
  validatorMiddleWare,
  check("password").notEmpty().withMessage("password is required")
  .isLength({min : 6}).withMessage("password must be at least 6 characters")
  .custom((pass , {req}) => {
    if (pass !== req.body.passwordconfirm) {
       throw new Error("password confirmation not correct")
    }
    return true;
  })
  ,
  // validatorMiddleWare,
  check("passwordconfirm").notEmpty().withMessage("password is required"),
  check("phone").optional().isMobilePhone(["ar-EG" , "ar-SA"]).withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
  validatorMiddleWare,
  check("profileImage").optional(),
  check("role").optional(),
];

exports.getuserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleWare
];


exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleWare ,
  check("name").optional().notEmpty().withMessage("user name required")
  .isLength({min : 3}).withMessage("too short"),
  validatorMiddleWare,
  check("email").optional().notEmpty().withMessage("email required")
  .isEmail().withMessage("invalid email")
  .custom((val) => 
  UserModel.findOne({email : val}).then((useremail) => 
    { if (useremail) {
    return Promise.reject(
      new ApiError("this email is already exist please login")
    )}})),
  validatorMiddleWare,
  check("password").optional().notEmpty().withMessage("password is required")
  .isLength({min : 6}).withMessage("password must be at least 6 characters"),
  validatorMiddleWare,
  check("phone").optional().isMobilePhone(["ar-EG" , "ar-SA"]).withMessage("enter valid phone number (EG or SA"),
  validatorMiddleWare,
  check("profileImage").optional(),
  check("role").optional(),
];


exports.updateUserPasswordValidator =[
  check("id").isMongoId().withMessage("Invalid user id format"),
  check("currentPassword").notEmpty().withMessage("you must enter current password"), 
  check("passwordconfirm").notEmpty().withMessage("you must enter password confirm"), 
  check("password").notEmpty().withMessage("you must enter password")
  .custom( async (val , {req}) => {
//verify current Password 
    const user = await UserModel.findById(req.params.id);
   if (!user) {
    throw new Error("User not found for this id");
   }
   const isCorrectPassword = await bcrypt.compare(req.body.currentPassword , user.password);
   if (!isCorrectPassword) {
    throw new Error("incorrect current Password");
   }

//verify Password confirm
if (val !== req.body.passwordconfirm) {
  throw new Error("password confirmation not correct")
}
return true;
  }),
  validatorMiddleWare
]

exports.deleteeUserValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validatorMiddleWare
];




exports.updateLoggedUserPasswordValidator =[
  check("currentPassword").notEmpty().withMessage("you must enter current password"), 
  check("passwordconfirm").notEmpty().withMessage("you must enter password confirm"), 
  check("password").notEmpty().withMessage("you must enter password")
  .custom( async (val , {req}) => {
//verify current Password 
    const user = await UserModel.findById(req.user._id);
   if (!user) {
    throw new Error("User not found for this id");
   }
   const isCorrectPassword = await bcrypt.compare(req.body.currentPassword , user.password);
   if (!isCorrectPassword) {
    throw new Error("incorrect current Password");
   }

//verify Password confirm
if (val !== req.body.passwordconfirm) {
  throw new Error("password confirmation not correct")
}
return true;
  }),
  validatorMiddleWare
]






exports.updateLoggedUserValidator = [
  check("name").optional().notEmpty().withMessage("user name required")
  .isLength({min : 3}).withMessage("too short"),
  validatorMiddleWare,
  check("email").optional().notEmpty().withMessage("email required")
  .isEmail().withMessage("invalid email")
  .custom((val) => 
  UserModel.findOne({email : val}).then((useremail) => 
    { if (useremail) {
    return Promise.reject(
      new ApiError("this email is already exist please login")
    )}})),
  validatorMiddleWare,
  check("password").optional().notEmpty().withMessage("password is required")
  .isLength({min : 6}).withMessage("password must be at least 6 characters"),
  validatorMiddleWare,
  check("phone").optional().isMobilePhone(["ar-EG" , "ar-SA"]).withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),
  // check("profileImage").optional(),
  // check("role").optional(),
  validatorMiddleWare,
];
