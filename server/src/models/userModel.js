const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true , enum: ["admin", "user"]},
    timestaps: {type: Date, default: Date.now},
});

const User = mongoose.model("User", userSchema);

module.exports = User;