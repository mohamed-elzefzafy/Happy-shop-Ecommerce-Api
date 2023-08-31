const categoryRoute = require("./categoryRoutes");
const subCategoryRoute = require("./subCategoryRoutes");
const brandRoute = require("./brandRoutes");
const productRoute = require("./productRoute");
const userRoute = require("./userRoutes");
const authRoute = require("./authRoutes");
const reviewRoute = require("./reviewRoutes");
const wishListRoute = require("./wishListRoute");
const addressRoute = require("./addressRoute");
const couponRoute = require("./couponRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");

const mountRoutes = (app) =>  {
  // mount routes
app.use("/api/v1/categories" , categoryRoute)
app.use("/api/v1/subcategories" , subCategoryRoute);
app.use("/api/v1/brands" , brandRoute);
app.use("/api/v1/products" , productRoute);
app.use("/api/v1/users" , userRoute);
app.use("/api/v1/auth" , authRoute);
app.use("/api/v1/reviews" , reviewRoute);
app.use("/api/v1/wishlist" , wishListRoute);
app.use("/api/v1/addresses" , addressRoute);
app.use("/api/v1/coupons" , couponRoute);
app.use("/api/v1/cart" , cartRoute);
app.use("/api/v1/orders" , orderRoute);
}

module.exports = mountRoutes;