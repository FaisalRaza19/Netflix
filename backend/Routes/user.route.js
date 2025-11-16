import { Router } from "express";
import { registerUser, loginUser, logOut, getUser, userVerifyJWT } from "../Controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router();

// route of register user 
router.route("/register").post(registerUser);

// route of login user 
router.route("/login").post(loginUser);

// logout user
router.route("/logOut").post(verifyJWT, logOut);

// get user
router.route("/getUser").get(verifyJWT, getUser)

// verify jwt
router.route("/userVerifyJWT").post(verifyJWT, userVerifyJWT)

export default router;