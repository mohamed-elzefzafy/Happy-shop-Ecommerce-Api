const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const UserModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");
const { sanitizeUser } = require("../utils/sanatizeData");


/**
 * @desc    register
 * @route   /api/v1/auth/register
 * @method  POST
 * @access  public
 */

exports.registerUser = asyncHandler(async (req , res) => {
  // 1-ceate user 
  const user = await UserModel.create({
    name : req.body.name,
    email : req.body.email,
    password :req.body.password,
    // slug : req.body.slug,
    // phone : req.body.phone,
    // profileImage : req.body.profileImage,  
  })
// 1-generate token 
const token = createToken(user._id)
res.status(201).json({data : sanitizeUser(user) , token});
})





/**
 * @desc    login
 * @route   /api/v1/auth/login
 * @method  POST
 * @access  public
 */
exports.loginUser = asyncHandler(async (req , res , next) => {
// check if the email and password is in the body (validation layer)
// check if user is exist and the password is correct 
const user = await UserModel.findOne({email : req.body.email});
if (!user || !(await bcrypt.compare(req.body.password , user.password)))
{
  return next(new ApiError("incorrect email or password" , 401));
}
// generate token 
const token = createToken(user._id)
// send response to client

res.status(200).json({data : user , token} )
})




//@desc    make sure that user is logged in
exports.protect = asyncHandler( async(req , res , next) => {
  //1- Check if token exist, if exist getg
  let token 
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
  {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
  {
    return next(new ApiError("You are not login, Please login to get access this route" , 401));
  }
    //2- Verify token (no change happens, expired token)
    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
    // console.log(decoded);
    //3-  Check if user exists
    const currentUser = await UserModel.findById(decoded.userId);
    if (!currentUser) {
      return next(new ApiError("The user that belong to this token does no longer exist" , 401))
    }
    //4-  Check if user change his password after token created
    if (currentUser.passwordChangedAt) {
      const passChangedTimeStamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000 , 10)
      console.log(passChangedTimeStamp, decoded.iat);
      //password changed after create token
      if (passChangedTimeStamp > decoded.iat)
      {
        return next(new ApiError("user recently changed his password please login again" , 401))
      }
    }
    if (currentUser.active === false) {
      return next(new ApiError("your account is not active please active your account first" , 401)) 
    }

    req.user = currentUser;
    next();
})





//@desc    this for only the user who had make his active = false to help him to make his acount active = true again
exports.protectForUserWithUnactiveAccount = asyncHandler( async(req , res , next) => {
  //1- Check if token exist, if exist getg
  let token 
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
  {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
  {
    return next(new ApiError("You are not login, Please login to get access this route" , 401));
  }
    //2- Verify token (no change happens, expired token)
    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
    // console.log(decoded);
    //3-  Check if user exists
    const currentUser = await UserModel.findById(decoded.userId);
    if (!currentUser) {
      return next(new ApiError("The user that belong to this token does no longer exist" , 401))
    }
    //4-  Check if user change his password after token created
    if (currentUser.passwordChangedAt) {
      const passChangedTimeStamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000 , 10)
      console.log(passChangedTimeStamp, decoded.iat);
      //password changed after create token
      if (passChangedTimeStamp > decoded.iat)
      {
        return next(new ApiError("user recently changed his password please login again" , 401))
      }
    }
  
    req.user = currentUser;
    next();
})






// @desc    Authorization (User Permissions)
// ["admin", "manager"]
exports.allowedTo = (...roles) => (asyncHandler(async (req , res , next) => {
    // 1) access roles
  // 2) access registered user (req.user.role)
  if (!roles.includes(req.user.role)) {
 return next(new ApiError("You are not allowed, to get access this route" , 403));
  }

next();
})) 


/**
 * @desc    Forgot password
 * @route   /api/v1/auth/forgotpassword
 * @method  POST
 * @access  public
 */
exports.forgotPassword = asyncHandler(async (req , res , next) => {
  // 1) Get user by email
  const user = await UserModel.findOne({email : req.body.email})
  if (!user) {
    return next(new ApiError(`There is no user with that email${req.body.email}` , 404));
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode =  Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetCode = crypto.createHash("sha256").update(resetCode).digest("hex");  

  // Save hashed password reset code into db
    user.passwordRestCode = hashResetCode;
    console.log(user.passwordRestCode);

      // Add expiration time for password reset code (10 min)
      user.passwordRestCodeExpires = Date.now() + 10 * 60 * 1000;
      user.passwordRestverified = false;

    await  user.save();
  // 3) Send the reset code via email 
  const message = `Hi ${user.name},\n We received a request to reset the password on your Happy-shop Account.
   \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.
   \n The Happy-shop Team`;

   try {
    await  sendEmail({email : user.email , subject :"Your password reset code (valid for 10 min)" ,  message})
   } catch (error) {
    user.passwordRestCode = undefined;
    user.passwordRestCodeExpires = undefined;
    user.passwordRestverified = undefined;
    await user.save();
    return next(new ApiError("There is an error in sending email" , 500))
   }

 res.status(200).json({statue : "success" , message : "resetcode has been sent to your email"})

})



/**
 * @desc    verify Rest Code
 * @route   /api/v1/auth/verifyrestcode
 * @method  POST
 * @access  public
 */
exports.verifyRestCode = asyncHandler(async (req , res , next) => {
  // 1) Get user based on email
  const hashResetCode = crypto.createHash("sha256").update(req.body.resetCode).digest("hex");
  const user = await UserModel.findOne({passwordRestCode : hashResetCode ,
    passwordRestCodeExpires : {$gt : Date.now() }})
    if (!user) {
      return next( new ApiError("resetCode invalid or expired"));
    }

  // 2) Check if reset code verified
  user.passwordRestverified = true;
  // user.password = req.body.resetCode
  await user.save();
  res.status(200).json({
    status : "success"
  })
  // 3) if everything is ok, generate token
}
)


/**
 * @desc    Reset password
 * @route   /api/v1/auth/resetpassword
 * @method  POST
 * @access  public
 */
exports.resetPassword = asyncHandler(async (req , res , next) => {
    // 1) Get user based on email
const user = await UserModel.findOne({email : req.body.email});
if (!user) {
  return next( new ApiError(`there is no user for this email ${req.body.email}` , 404));
}

  // 2) Check if reset code verified
if (!user.passwordRestverified) {
  return next( new ApiError(`reset code not verified` , 400));
}

user.password   = req.body.newpassword

user.passwordRestCode = undefined;
user.passwordRestCodeExpires = undefined;
user.passwordRestverified = undefined;

await user.save();
  // 3) if everything is ok, generate token

  const token = createToken(user._id)
res.status(200).json({token});
})






















