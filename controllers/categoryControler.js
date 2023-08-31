const {v4 : uuidv4} = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleWare");



//diskStorage engine
// const multerStorage = multer.diskStorage({
//   destination : function (req , file , cb) {
//    cb(null , "uploads/Categories")
//   },
//   filename : function (req , file , cb) {
//    const ext = file.mimetype.split("/")[1];
//    const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
//    cb(null , fileName);
//   }
// });



//upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

//image processing
exports.resizeImageCategory = asyncHandler(async (req , res , next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
if (req.file) {
  await  sharp(req.file.buffer).resize(600 , 600)
 .toFormat("jpeg").jpeg({quality : 90})
 .toFile(`uploads/Categories/${fileName}`);

// save image to db
req.body.image = fileName;
}
 next();

}
)


/**
 * @desc    get list of Category
 * @route   /api/v1/categories
 * @method  GET
 * @access  public
 */
exports.getCategories = factory.getAll(CategoryModel);


/**
 * @desc    get specific Category by id
 * @route   /api/v1/categories/:id
 * @method  GET
 * @access  public
 */
exports.getOneCategy =  factory.getOneById(CategoryModel);


/**
 * @desc    create Category
 * @route   /api/v1/categories
 * @method  POST
 * @access  private /Admin - Manger
 */


exports.createCategory = factory.createOne(CategoryModel)



/**
 * @desc    update Category
 * @route   /api/v1/categories/:id
 * @method  PUT
 * @access  private /Admin - Manger
 */


exports.updateCategory = factory.updateOne(CategoryModel)


/**
 * @desc    Delete Category
 * @route   /api/v1/categories/:id
 * @method  DELETE
 * @access  private /Admin
 */


exports.deleteCategory = factory.deleteOne(CategoryModel)
