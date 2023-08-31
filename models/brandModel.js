const mongoose = require("mongoose");


// create schema
const brandSchema = new mongoose.Schema({
  name : {
    type : String ,
    required : [true , "Brand required"],
    unique: [true, 'Brand must be unique'],
    minlength : [3 , "too short"] , 
    maxlength: [32 , "too long brand name"] , 
  } ,
  slug : {
    type : String ,
    lowercase : true
  },
  image : String,
}, {timestamps : true})


const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl =  `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
}

brandSchema.post("init" , (doc)=> {
setImageUrl(doc)
})


brandSchema.post("save" , (doc)=> {
  setImageUrl(doc)
  })



// create model
const BrandModel = mongoose.model("Brand" , brandSchema);

module.exports = BrandModel;
