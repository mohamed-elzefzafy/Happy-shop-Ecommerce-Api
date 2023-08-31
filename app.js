const path = require("path");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
require("dotenv").config({path : "config.env"})
const morgan = require("morgan");
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/erroeMiddleware");
const mountRoutes = require("./routes/IndexMountRoute");



  // connect with db 
  dbConnection();
// express app
  const app = express();

  // enable other domains accsess the app
app.use(cors());
app.options("*" , cors());

// compress all responses 
app.use(compression());

// middlewares 
app.use(express.json());
app.use(express.static(path.join(__dirname , "uploads")));

if (process.env.NODE_ENV === "development")
{
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}




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