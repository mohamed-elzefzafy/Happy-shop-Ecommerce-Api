const express = require('express');
const { registerValidator, loginValidator } = require('../utils/validator/authValidator');
const { registerUser, loginUser, forgotPassword, verifyRestCode, resetPassword } = require('../controllers/authController');
const router = express.Router();




router.post("/register",registerValidator , registerUser);
router.post("/login" , loginValidator , loginUser);
router.post("/forgotpassword" , forgotPassword);
router.post("/verifyrestcode" , verifyRestCode);
router.put("/resetpassword" , resetPassword);





module.exports = router;