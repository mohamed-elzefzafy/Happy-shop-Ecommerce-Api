const factory = require("./handlerFactory");
const reviewModel = require("../models/reviewModel");





// nested route (GET)
// GET /api/v1/products/:productId/reviews
    exports.createFilterObjectProduct  =  (req , res , next) => {
      let filterObject = {};
      if (req.params.productId) {
        filterObject = {product : req.params.productId};
        req.filterObject = filterObject;
      }

      next();
    }



/**
 * @desc    get list of review
 * @route   /api/v1/reviews
 * @method  GET
 * @access  public
 */
exports.getReviews =  factory.getAll(reviewModel , "reviewModel");


/**
 * @desc    get specific review by id
 * @route   /api/v1/reviews/:id
 * @method  GET
 * @access  public
 */
exports.getOneReview = factory.getOneById(reviewModel)



exports.setProductIdAndUserIdToBody = (req , res , next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
}

/**
 * @desc    create review
 * @route   /api/v1/reviews
 * @method  POST
 * @access  private /Protect / user
 */
exports.createReview = factory.createOne(reviewModel)



/**
 * @desc    update review
 * @route   /api/v1/reviews/:id
 * @method  PUT
 * @access  private /Protect / user
 */


exports.updateReview = factory.updateOne(reviewModel)


/**
 * @desc    Delete review
 * @route   /api/v1/reviews/:id
 * @method  DELETE
 * @access  private /Protect / user Admin Manager
 */


exports.deleteReview = factory.deleteOne(reviewModel)
