const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ADMIN_CODE = process.env.ADMIN_REGISTRATION_CODE || 'admin123'; // Set this in your .env file

const register = async (req, res) => {
    try {
        const { username, password, adminCode, role } = req.body;
        
        if (!username.endsWith('@cmrtc.ac.in')) {
            return res.status(400).json({ message: "Please use your college email (@cmrtc.ac.in)" });
        }

        // Check if trying to register as admin
        if (role === 'admin') {
            if (!adminCode || adminCode !== ADMIN_CODE) {
                return res.status(400).json({ message: "Invalid admin registration code" });
            }
        }

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            role: role || 'user' // Default to 'user' if no role specified
        });
        
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Error creating user" });
    }
}

const login = async (req, res) => { 
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid password"});
        }
        const token = jwt.sign({userId: user._id , role: user.role}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.status(200).json({message: "Login successful", token});
    }catch(e){
        res.status(500).json({message: "Error logging in"});
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        console.log(req.user);
        console.log(user);
        res.status(200).json({"username":user.username, "role":user.role});
    }catch(e){
        res.status(500).json({message: "Error getting user"});
    }
}

module.exports = { register, login, getMe };