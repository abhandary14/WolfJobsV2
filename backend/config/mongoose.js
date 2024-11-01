const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGODB_URL || "", {
//   useNewUrlParser: true,
// });

function connectDB() {
  return mongoose.connect(process.env.MONGODB_URL || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports=connectDB;
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "Error connecting to mongodb"));

// db.once("open", function () {
//   console.log("Connected to database :: MongoDB");
// });

// module.exports = db;
