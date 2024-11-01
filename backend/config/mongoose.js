// const mongoose = require("mongoose");

// module.exports.connectDB = async function (req, res) {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URL, {
//       useNewUrlParser: true,
//     });

//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// connectDB();

// // mongoose.connect(process.env.MONGODB_URL || "", {
// //   useNewUrlParser: true,
// // });

// // const db = mongoose.connection;

// // db.on("error", console.error.bind(console, "Error connecting to mongodb"));

// // db.once("open", function () {
// //   console.log("Connected to database :: MongoDB");
// // });

// // module.exports = db;

// const mongoose = require("mongoose");

// async function connectDB() {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URL || "", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error connecting to MongoDB: ${error.message}`);
//     // Handle the error as needed without exiting the process
//   }
// }

// connectDB();

// module.exports = mongoose.connection;

const mongoose = require("mongoose");

function connectDB() {
  return mongoose.connect(process.env.MONGODB_URL || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connectDB;
