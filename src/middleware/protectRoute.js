import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to protect routes - checks JWT token and attaches user to req
export const protectRoute = async (req, res, next) => {
    try {
        // Get JWT token from cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided!" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid Token!" });
        }

        // Find user and exclude password from returned data
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ error: "User not found!" });
        }

        // Attach user to request object
        req.user = user;

        // Continue to next middleware or route
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
};
