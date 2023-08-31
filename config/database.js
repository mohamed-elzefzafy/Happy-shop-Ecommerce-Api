const mongoose = require("mongoose");


const dbConnection = () => {
mongoose.connect(process.env.DB_URL).then((con) => {
  console.log(`Database connected : ${con.connection.host} `);
  })
}

module.exports = dbConnection;