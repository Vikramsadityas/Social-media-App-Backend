import { Router } from "express";
import { loginuser, 
    logoutuser, 
    registeruser,
    refreshAccessToken, 
    changepassword, 
    getcurrentuser, 
    updateuserdetail, 
    updateAvatar, 
    updatecoverimage, 
    getUserChannelProfile, 
    deleteavatar, 
    deletecoverimage,
    getwatchhistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registeruser
)
router.route("/login").post(loginuser)

//secured routes
router.route("/logout").post(verifyJWT, logoutuser)
router.route("/refreshtoken").post(refreshAccessToken)
router.route("/changepassword").post(verifyJWT, changepassword)
router.route("/getcurrentuser").get(verifyJWT, getcurrentuser)
router.route("/updateuserdetail").patch(verifyJWT, updateuserdetail)
router.route("/updateAvatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)
router.route("/coverimage").patch(verifyJWT, upload.single("coverimage"), updatecoverimage)
router.route("/avatar/deleteavatar").patch(verifyJWT, deleteavatar)
router.route("/avatar/deletecoverimage").patch(verifyJWT, deletecoverimage)
router.route("/profile/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getwatchhistory)


export default router