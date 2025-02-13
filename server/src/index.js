const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
app.use(express.json());
app.use(cors());
dbConnect();
//Routes

app.use("/auth", authRoutes);
app.use("/users", userRoutes);


const PORT = process.env.PORT || 7002

app.listen(PORT , () => {
  console.log(`Server is running on port ${PORT}` );
});
