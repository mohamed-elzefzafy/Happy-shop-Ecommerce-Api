const  mongoose  = require("mongoose");


const productSchema = new mongoose.Schema({
  title : {
    type : String,
    required : true,
    trim : true,
    minlength : [3 , "too short product title"],
    maxlength : [100 , "too long product title"]
  } ,
  slug : {
    type : String,
    required : true,
    lowercase : true,  
  } ,
  description : {
    type : String,
    required : [true , "product description is required"],
    minlength : [20 , "Too short product description" ]
  },
  quantity : {
    type : Number,
    required : [true, "product quantity is required"],
  },
  sold : {
    type : Number,
    default : 0,
  },
  price : {
    type : Number,
    required : [true, "product price is required"],
    trim : true,  
    max : [200000 , "too long product price"]
  },
  priceAfterDiscount : {
    type : Number,
  },
  colors : [String],
  imageCover : {
    type : String,
    required : [true, "product image cover is required"],
  },
  images : [String],
  category : {
    type : mongoose.Schema.ObjectId,
    ref : "category",
    required : [true, "product must be belong to category"],
  },
  subcategories : [
    {
      type: mongoose.Schema.ObjectId,
       ref : "SubCategory",
  },
],
  brand : {
    type : mongoose.Schema.ObjectId,
     ref : "Brand",
  },
  ratingsAverage : {
    type : Number,
    min: [1 , "rating must be above or equal 1"],
    max : [5, "rating must be below or equal 5"],
  },
  ratingsQuantity : {
    type : Number,
    default : 0
  }
},{timestamps : true ,
// to enable virtual populate
toJSON : {virtuals : true} ,
toObject : {virtuals : true }})


productSchema.virtual("Reviews", {
  ref : "Review" ,
  foreignField : "product" ,
  localField : "_id"
})


productSchema.pre(/^find/ , function (next) {
  this.populate({
  path : "category" , 
  select : "name"
  });
  next();
});



const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl =  `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = []; 
    doc.images.forEach((image) => {
      const imageUrl =  `${process.env.BASE_URL}/products/${image}`;
      imagesList.push(imageUrl);
    })
    doc.images = imagesList;
    
  }
}

productSchema.post("init" , (doc)=> {
setImageUrl(doc)
})


productSchema.post("save" , (doc)=> {
  setImageUrl(doc)
  })







const ProductModel = mongoose.model("Product" , productSchema);

module.exports = ProductModel;