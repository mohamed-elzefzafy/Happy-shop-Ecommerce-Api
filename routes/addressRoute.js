const express = require('express');
const { protect, allowedTo } = require('../controllers/authController');
const { addAddress, removeAddress, getLoggedUserAddress } = require('../controllers/addressController');
const router = express.Router();



router.use(protect , allowedTo("user") )

router.route("/").post( addAddress).get( getLoggedUserAddress)
router.route("/:addressId").delete( removeAddress);

module.exports = router;
