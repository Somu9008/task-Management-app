const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected");
  } catch (error) {
    console.error("DB connection Failed", error, message);
  }
};

module.exports = connectDB;
