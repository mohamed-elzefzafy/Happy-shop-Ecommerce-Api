const mongoose = require("mongoose");

const subCategoryScema = new mongoose.Schema(
  {
    name: {
      type: String,
    
      required: [true, "SubCategory name is required"],
      unique:    [true, 'SubCategory must be unique'],
      minlength: [2, "Too short subCategory name"],
      maxlength: [32, "Too long subCategory name"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "subCategory must be belong to parent Category"],
    },
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model("SubCategory", subCategoryScema);

module.exports = SubCategoryModel;
