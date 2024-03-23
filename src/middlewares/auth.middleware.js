import { handleerror } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

export const verifyJWT=asynchandler(async(req,_,next)=>{
    try {
        const token=req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")
        if(!token)
        {
            throw new handleerror(401,"UnAuthorized Error can not access");
        }
        const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user=await User.findById(decodedtoken?._id).select("-password -RefreshToken")
        if(!user)
        {
            throw new handleerror(401,"Invalid Access Token")
        }
        req.user=user;
        next()
    } catch (error) {
            throw new handleerror(401,"Already Logged out")
    }
})