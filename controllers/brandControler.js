
const {v4 : uuidv4} = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const BrandModel = require("../models/brandModel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleWare");





exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImageBrand = asyncHandler(async (req , res , next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
await  sharp(req.file.buffer).resize(600 , 600)
 .toFormat("jpeg").jpeg({quality : 90})
 .toFile(`uploads/brands/${fileName}`);

// save image to db
req.body.image = fileName;
 next();

}
)


/**
 * @desc    get list of Brands
 * @route   /api/v1/brands
 * @method  GET
 * @access  public
 */
exports.getBrands =  factory.getAll(BrandModel);


/**
 * @desc    get specific Brand by id
 * @route   /api/v1/brands/:id
 * @method  GET
 * @access  public
 */
exports.getOneBrand = factory.getOneById(BrandModel)


/**
 * @desc    create Brand
 * @route   /api/v1/brands
 * @method  POST
 * @access  private /Admin - Manger
 */


exports.createBrand = factory.createOne(BrandModel)



/**
 * @desc    update Brand
 * @route   /api/v1/brands/:id
 * @method  PUT
 * @access  private /Admin - Manger
 */


exports.updateBrand = factory.updateOne(BrandModel)


/**
 * @desc    Delete brand
 * @route   /api/v1/brands/:id
 * @method  DELETE
 * @access  private /Admin 
 */


exports.deleteBrand = factory.deleteOne(BrandModel)
