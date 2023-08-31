const mongoose  = require("mongoose");



const cartSchema = new mongoose.Schema({
  cartItems : [
  {
    product : {
      type : mongoose.Schema.ObjectId, 
      ref : "Product"
    },
    quantity : {
      type : Number,
      default : 1
    },
    color : String ,
    price : Number
  }
  ] ,
  totalCartPrice : Number ,
  totalCartPriceAfterDiscount : Number ,
  user : {
   type :  mongoose.Schema.ObjectId ,
   ref : "User"
  }
 }, {timestamps : true} );

 
cartSchema.pre(/^find/ , function (next) {
  this.populate({
    path : "cartItems.product" ,
    select :  "title imageCover"
  }).populate({
    path : "user" , 
    select : "name profileImage email phone"
  });
  next();
})

//  .populate({path : "cartItems.product" , select : "title -category" })
 const CartModel =  mongoose.model("Cart" , cartSchema);

 module.exports = CartModel;