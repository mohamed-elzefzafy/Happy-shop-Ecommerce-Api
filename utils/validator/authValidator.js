const {check } = require("express-validator");
const validatorMiddleWare = require("../../middlewares/validatorMiddleWare");
const UserModel = require("../../models/userModel");
const ApiError = require("../apiError");




exports.registerValidator = [
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
  // check("phone").optional().isMobilePhone(["ar-EG" , "ar-SA"]).withMessage("enter valid phone number (EG or SA"),
  // validatorMiddleWare,
  // check("profileImage").optional(),
  // check("role").optional(),
  validatorMiddleWare,
];



exports.loginValidator = [
  check("email").notEmpty().withMessage("email required")
  .isEmail().withMessage("invalid email"),

  check("password").notEmpty().withMessage("password is required")
  .isLength({min : 6}).withMessage("password must be at least 6 characters"),
  validatorMiddleWare,
];
