import bcrypt from "bcryptjs"; 
import User from "../models/user.model.js";
import {generateTokenAndSetCookie} from "../lib/utils/generateTokenAndSetCookie.js"; 


export const signUp = async (req, res) => {
    try {
        const { username, password, fullName, email } = req.body;

        // Check missing fields
        if (!username || !password || !fullName || !email) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Check username
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken!" });
        }

        // Check email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format!" });
        }

        // Check password 
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long!" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user 
        const newUser = new User({
            username,
            password: hashedPassword,
            fullName,
            email
        });

        //save newUser
        await newUser.save(); 

        // Generate token and set cookie
        generateTokenAndSetCookie(newUser._id, res);

        //send Data
        res.status(201).json({
            id: newUser._id,
            username: newUser.username,
            fullName: newUser.fullName,
            email: newUser.email,
            message: "User registered successfully!"
        });

    } catch (error) {
        console.error("Error in signUp:", error);
        res.status(500).json({ error: "Internal server error!" });
    }
};

export const logIn = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if username or password is missing
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required!" });
        }

        // Find the user by username
        const user = await User.findOne({ username });

        // Compare the plain password with the hashed password in the database
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        // If user not found or password is incorrect
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password!" });
        }

        // If credentials are valid, generate a JWT token and set it as a cookie
        generateTokenAndSetCookie(user._id, res);

        // Return user data (excluding password) as response
        res.status(201).json({
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            message: "User logged in successfully!"
        });

    } catch (error) {
        console.error("Error in logIn:", error);
        res.status(500).json({ error: "Internal server error!" });
    }
};

export const logOut = async(req, res) => {
    try {
        res.cookie("jwt", ""< {maxAge: 0});
        res.status(201).json({message: "User logged out succesfully!"});
    } catch (error) {
        console.error("Error in logOut:", error);
        res.status(500).json({ error: "Internal server error!" });
    }
}

export const getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
}