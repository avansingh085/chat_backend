const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const ConnectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB");
    console.log(error);
  }
};
module.exports = ConnectionDB;