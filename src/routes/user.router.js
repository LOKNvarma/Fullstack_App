import { Router } from "express";
import { loginUser, logOut, registerUser ,refreshToken } from "../controllers/user.controller.js"
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

 router.route("/register").post(
    upload.fields(
        [
            { 
                name : "avatar",
                maxCount : 1 
            },
            {
               name : "coverImage" ,
               maxCount : 1 
            }
        ]
    ),
    registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT ,logOut);
router.route("/refresh-toke").post(refreshToken);
export default router