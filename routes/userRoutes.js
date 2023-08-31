const express = require('express');
const { getUsers, uploadUserImage, resizeImageUser, createUser,
   getOneUser, updateUser, deleteUser, updateUserPassword, getLoggedUserData, updateLoggedUserPassword, updateLoggedUserData, deleteLoggedUserData, reactiveLoggedUserData } = require('../controllers/userController');
const { createUserValidator, getuserValidator, updateUserValidator, deleteeUserValidator, updateUserPasswordValidator, updateLoggedUserPasswordValidator, updateLoggedUserValidator } = require('../utils/validator/userValidator');
const { protect, allowedTo, protectForUserWithUnactiveAccount } = require('../controllers/authController');
const router = express.Router();




router.put("/activeme" , protectForUserWithUnactiveAccount  , reactiveLoggedUserData) ;
router.use(protect)
router.get("/getme"  , getLoggedUserData , getOneUser)
router.put("/changemypassword"  , updateLoggedUserPasswordValidator  ,updateLoggedUserPassword)
router.put("/updateme"  , updateLoggedUserValidator  ,updateLoggedUserData) 
router.delete("/deleteme"    , deleteLoggedUserData);


// Admin - Manger
router.use( allowedTo("admin" , "manger" ))

router.put("/changepassword/:id" , updateUserPasswordValidator , updateUserPassword )
router.route("/").get( getUsers)
.post(  uploadUserImage , resizeImageUser  , createUserValidator , createUser);
router.route("/:id")
.get(getuserValidator , getOneUser)
.put(uploadUserImage , resizeImageUser ,updateUserValidator  , updateUser)
.delete( deleteeUserValidator , deleteUser);




module.exports = router;