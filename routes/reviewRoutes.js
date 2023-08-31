const express = require('express');
const { getReviews, createReview, getOneReview, updateReview, deleteReview, createFilterObjectProduct, setProductIdAndUserIdToBody } = require('../controllers/reviewControler');
const { protect, allowedTo } = require('../controllers/authController');
const { createReviewValidator, getOneReviewValidator, updateReviewValidator, deleteReviewValidator } = require('../utils/validator/reviewValidator');
// mergeParams: Allow us to access parameters on other routers
const router = express.Router({mergeParams : true});




router.route("/").get(createFilterObjectProduct , getReviews).post( protect , allowedTo("user"), setProductIdAndUserIdToBody , createReviewValidator , createReview);
router.route("/:id")
.get(getOneReviewValidator , getOneReview)
.put(protect , allowedTo("user") , updateReviewValidator , updateReview)
.delete(protect , allowedTo("user" , "manger" , "admin") , deleteReviewValidator  , deleteReview);









module.exports = router;