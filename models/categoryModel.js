const mongoose = require("mongoose");


// create schema
const categorySchema = new mongoose.Schema({
  name : {
    type : String ,
    required : [true , "Category required"],
    unique:    [true, 'Category must be unique'],
    minlength : [3 , "too short"] , 
    maxlength: [32 , "too long category name"] , 
  } ,
  slug : {
    type : String ,
    lowercase : true
  },
  image : String,
}, {timestamps : true})

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl =  `${process.env.BASE_URL}/Categories/${doc.image}`;
    doc.image = imageUrl;
  }
}

categorySchema.post("init" , (doc)=> {
setImageUrl(doc)
})


categorySchema.post("save" , (doc)=> {
  setImageUrl(doc)
  })

  
// create model

const CategoryModel = mongoose.model("category" , categorySchema);


module.exports = CategoryModel;