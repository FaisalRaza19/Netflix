import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";

const verifyJWT = async (req, res, next) => {
    try {
        let token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ statusCode: 401, message: "Token is required" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decoded.id).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ statusCode: 401, message: "Unauthorized request" });
        }

        req.checkUser = user;
        next();

    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(401).json({ statusCode: 401, message: "Invalid token", error: error.message });
    }
};

export { verifyJWT };
