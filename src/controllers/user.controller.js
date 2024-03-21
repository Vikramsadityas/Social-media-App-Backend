import { asynchandler } from "../utils/asynchandler.js";
import {handleerror} from "../utils/apierror.js"
import {User} from "../models/user.model.js"
import {uploadFile} from "../utils/cloudinary.js"
import { handleresponse } from "../utils/apiresponse.js";
const registeruser=asynchandler(async (req,res)=>{
    //get user detail from frontend
    //validation about user entries -not empty
    //check if user already exist:username,email
    //check for images 
    //check for avatar
    //upload them to cloudinary
    //create user object for DB
    //remove password and refresh token field from response
    //check for user creation if yes->return response else return ->error

    const {fullname,username,email,password}=req.body;
    // res.send(200);
    // console.log("Name:",fullname)
    // console.log("Name:",email)
    // console.log("Name:",username)

    // if(fullname==""){
    //     throw new apierror(400,"Fullname is required")
    // } we can check each field like this or use some advance js
    if(
        [fullname,username,email,password].some((field)=>field?.trim() === "")
    )
    {
        throw new handleerror(400,"All field are required");
    }

    const isexisted=await User.findOne({
        $or:[{email},{username}]
    })
    if(isexisted)
    {
        throw new handleerror(409,"User with this email or username already exist");
    }
    // console.log(req.files)
    const avatarlocalpath=req.files?.avatar[0]?.path;        
    // const coverimagelocalpath=req.files?.coverimage[0]?.path;
    let coverimagelocalpath;
    if(req.files && Array.isArray(req.files.coverimage)&& req.files.coverimage.length>0)
    {
        coverimagelocalpath=req.files.coverimage[0].path;
    }
    if(!avatarlocalpath)
    {
        throw new handleerror(400,"Avatar image must be uploaded")
    }
    const avatar=await uploadFile(avatarlocalpath);
    const coverimage=await uploadFile(coverimagelocalpath);
    if(!avatar)
    {
        throw new handleerror(400,"Avatar image must be uploaded")
    }

    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverimage:coverimage?.url|| "",
        email,
        password,
        username
    })
    const createduser=await User.findById(user._id).select(
        "-password -RefereshToken"
    )
    if(!createduser)
    {
        throw new handleerror(500,"Something went wrong while registering user")
    }
    return res.status(201).json(
        new handleresponse(200,createduser,"User Created and Registered successfully")
    )
})
export {registeruser}