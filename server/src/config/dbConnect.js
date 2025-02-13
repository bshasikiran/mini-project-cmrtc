const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`Database connected: ${conn.connection.host}  ${conn.connection.name}`);
  }catch (e){
    console.log(`Error in Database ${e.message}`);
    process.exit(1);
  }
};

module.exports = dbConnect;