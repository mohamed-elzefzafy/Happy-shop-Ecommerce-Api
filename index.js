const path = require("path");
const express = require("express");
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const compression = require("compression");
require("dotenv").config({path : "config.env"})
const hpp = require("hpp");
const mongoSanitize = require('express-mongo-sanitize');
const { xss } = require("express-xss-sanitizer");
const morgan = require("morgan");
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/erroeMiddleware");
const mountRoutes = require("./routes/IndexMountRoute");
const { webhookCheckout } = require("./controllers/orderController");



  // connect with db 
  dbConnection();
// express app
  const app = express();

  // enable other domains accsess the app
app.use(cors());
app.options("*" , cors());

// compress all responses 
app.use(compression());


// webhook checkout 
app.post("/webhook-checkout" , express.raw({type: 'application/json'}), webhookCheckout)


// middlewares 
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname , "uploads")));

if (process.env.NODE_ENV === "development")
{
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}


app.get("/" ,  (req, res) => {
res.send("api is running....")
})

// To apply data Sanitization:
app.use(mongoSanitize());
app.use(xss());

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    'Too many accounts created from this IP, please try again after an hour',
});

// Apply the rate limiting middleware to all requests
app.use('/api', limiter);

//middleware to protect against HTTP Parameter Pollution attacks 
app.use(hpp({whitelist : ["price" , "sold" , "quantity" , "ratingsAverage" , "ratingsQuantity"]}));

// mount routes
mountRoutes(app);


app.all("*" , (req , res , next) => {
  // const err = new Error(`can't find this route ${req.originalUrl}`);
  // next(err.message);
  next(new ApiError(`can't find this route ${req.originalUrl}` , 400));
})

//global error handling middleware for express  

app.use(globalError)

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}`);
})


// handle rejection outside express
process.on("unhandledRejection" , (err) => {
  console.error(`unhandledRejection : ${err.name} | ${err.message}`);
  server.close();
  console.log("shutting down....");
  process.exit(1);
})