const mongoose = require("mongoose");
const { MONGODB_URI, DB_NAME } = require("./variables");

const dbConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    });

    console.log("Database Connected Successfully");
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = dbConnect;