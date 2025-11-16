import { User } from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Helper to generate a random username and ensure uniqueness
const generateUniqueUsername = async (fullName) => {
    let baseName = fullName.toLowerCase().replace(/\s+/g, "");
    let uniqueName = baseName;
    let exists = await User.findOne({ userName: uniqueName });
    let counter = 1;

    while (exists) {
        uniqueName = `${baseName}${counter}`;
        exists = await User.findOne({ userName: uniqueName });
        counter++;
    }

    return uniqueName;
};

// Register user
const registerUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Input validation
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (fullName.length < 3) {
            return res.status(400).json({ message: "Full name must be at least 3 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }

        const specialCharRegex = /[!@#$%^&_*(),.?":{}|<>]/;
        if (password.length < 8 || !specialCharRegex.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters and contain a special character" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Generate unique username
        const userName = await generateUniqueUsername(fullName);

        // Hash password
        const hashPass = await bcryptjs.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            fullName,
            email,
            userName,
            password: hashPass,
        });

        // Generate tokens
        const access_token = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
        const refresh_token = jwt.sign({ id: newUser._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

        // Update user with refresh token
        await User.findByIdAndUpdate(newUser._id, { refreshToken: refresh_token });

        // Exclude sensitive fields
        const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

        return res.status(200).json({
            statusCode: 200,
            data: createdUser,
            message: "User created successfully",
            access_token,
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body; // identifier = email or username

        if (!identifier || !password) {
            return res.status(400).json({ message: "Email/Username and password are required" });
        }

        // Find user by email OR username
        const user = await User.findOne({
            $or: [{ email: identifier }, { userName: identifier }]
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid email/username or password" });
        }

        // Compare password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email/username or password" });
        }

        // Generate tokens
        const access_token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
        const refresh_token = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });

        // Update refresh token
        await User.findByIdAndUpdate(user._id, { refreshToken: refresh_token });

        const loginUser = await User.findById(user._id).select("-password -refreshToken");

        return res.status(200).json({
            statusCode: 200,
            data: { loginUser, access_token },
            message: "User logged in successfully",
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Logout user
const logOut = async (req, res) => {
    try {
        // Ensure user ID is available from the request
        if (!req.checkUser || !req.checkUser._id) {
            return res.status(400).json({ message: "User not authenticated" });
        }

        // Clear the refresh token
        await User.findByIdAndUpdate(req.checkUser._id, { $unset: { refreshToken: "" } });

        // Clear cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).json({ statusCode: 200, message: "User logged out successfully" });

    } catch (error) {
        console.error("Error during user logout:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getUser = async (userId) => {
    try {
        const userId = req.checkUser._id
        if (!userId) {
            return res.status(400).json({ message: "User not authenticated" });
        }
        const user = await User.findById(userId).select("-password -refreshToken");
        return res.status(200).json({ statusCode: 200, message: "User get successfully", data: user});
    } catch (error) {
        console.error("Error getting user:", error);
        return null;
    }
};

// Verify JWT token
const userVerifyJWT = async (req, res) => {
    try {
        const userId = req.checkUser?._id;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: "User did not found" })
        };
        return res.status(200).json({ statusCode: 200, message: "token is valid", data: true })
    } catch (error) {
        return res.status(500).json({ message: "internal server error to verify and edit the shop", error: error })
    }
}

export { registerUser, loginUser, logOut,getUser,userVerifyJWT };