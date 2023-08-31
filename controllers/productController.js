const multer = require("multer");
const asyncHandler = require("express-async-handler");
const {v4 : uuidv4} = require("uuid");
const sharp = require("sharp");
const factory = require("./handlerFactory");
const ProductModel = require("../models/productModel");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleWare");



exports.updateProductImages = uploadMixOfImages([
  {name : "imageCover" , maxCount : 1} ,
  {name : "images" , maxCount : 5} ,
]
)

exports.resizeImageProduct =  asyncHandler(async (req , res , next) => {
if (req.files.imageCover)
{
  //image processing for imageCover
  const imageCoverfileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
  await  sharp(req.files.imageCover[0].buffer).resize(2000 , 1333)
 .toFormat("jpeg").jpeg({quality : 90})
 .toFile(`uploads/products/${imageCoverfileName}`);

// save image to db
req.body.imageCover = imageCoverfileName;

}

//image processing for imageCover
if (req.files.images)
{
 req.body.images = []
await Promise.all(  req.files.images.map(async (image , index) => {
  const imagefileName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
await  sharp(image.buffer).resize(2000 , 1333)
.toFormat("jpeg").jpeg({quality : 90})
.toFile(`uploads/products/${imagefileName}`);

// save image to db
req.body.images.push(imagefileName);
}))
console.log(req.body.imageCover);
console.log(req.body.images);
}

 next();

}) 

/**
 * @desc    get list of products
 * @route   /api/v1/products
 * @method  GET
 * @access  public
 */

exports.getProducts = factory.getAll(ProductModel , "ProductModel");


/**
 * @desc    create product
 * @route   /api/v1/products
 * @method  POST
 * @access  private /Admin - Manger
 */

exports.createProduct = factory.createOne(ProductModel);

/**
 * @desc    get specific product by id
 * @route   /api/v1/products/:id
 * @method  GET
 * @access  public
 */

exports.getOneProduct = factory.getOneById(ProductModel , "Reviews")


/**
 * @desc    update product
 * @route   /api/v1/products/:id
 * @method  PUT
 * @access  private /Admin - Manger
 */

exports.updateProduct = factory.updateOne(ProductModel)


/**
 * @desc    update product
 * @route   /api/v1/products/:id
 * @method  DELETE
 * @access  private /Admin
 */

exports.deleteProduct = factory.deleteOne(ProductModel);
