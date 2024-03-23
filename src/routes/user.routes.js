import { Router } from "express";
import { loginuser, logoutuser, registeruser,refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router()
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverimage",
            maxCount:1
        }
    ]),
    registeruser
    )
router.route("/login").post(loginuser)

//secured routes
router.route("/logout").post(verifyJWT, logoutuser)
router.route("/refreshtoken").post(refreshAccessToken)

export default router