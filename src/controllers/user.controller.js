import { asynchandler } from "../utils/asynchandler.js";
import {handleerror} from "../utils/apierror.js"
import {User} from "../models/user.model.js"
import {uploadFile} from "../utils/cloudinary.js"
import { handleresponse } from "../utils/apiresponse.js";
import jwt  from "jsonwebtoken";

const generateAccessandRefreshtoken=async(userid)=>{
    try {
        const user=await User.findById(userid);
        const accesstoken=user.generateaccesstoken();
        const refreshtoken=user.generaterefreshtoken();
        user.refreshtoken=refreshtoken;
        await user.save({validateBeforeSave:false});

        return {accesstoken,refreshtoken};
    } catch (error) {
        throw new handleerror("Something went wrong while generating access and refresh token")
    }
} 
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
const loginuser=asynchandler(async(req,res)=>{
    //reqbody for data- username or email
    //find the user if not tell user to register
    //if user is present  then check the password 
    //validate user credentials from DB
    //if credential are right allow user to log in otherwise send error message
    //else provide access token with a small expiry time 
    //send those token in cookies
    //if refresh token expires allow user to login again and provide new tokens

    const {email ,username,password}=req.body;
    if( !(email || username))
    {
        throw new handleerror(400,"username or email is required");
    }
    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if(!user)
    {
        throw new handleerror(404,"User does not exist");
    }
    const ispasswordcorrect=await user.ispasswordcorrect(password);
    if(!ispasswordcorrect)
    {
        throw new handleerror(401,"Password invalid");
    }

    const{accesstoken,refreshtoken}= await generateAccessandRefreshtoken(user._id);
    const loggedinuser=await User.findOne(user._id).select(
        "-password -RefreshToken")
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(
        new handleresponse(
            200,
            {
                user:loggedinuser,accesstoken,refreshtoken
            },
            "User Logged in Successfully"
        )
    )
})
const logoutuser=asynchandler(async(req,res)=>{
    //find user
    //remove cookies of the user
    //remove refresh token in usermodel
    
    await User.findByIdAndUpdate(req.user._id,{
        $unset:{
            RefreshToken:1
        }
    },
    {
        new:true
    })
    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accesstoken",options)
    .clearCookie("refreshtoken",options)
    .json(new handleresponse(200, {}, "User logged Out"))
})

const refreshAccessToken=asynchandler(async(req,res)=>{
    const incomingrefreshtoken= req.cookies.refreshtoken || req.body.refreshtoken
    
    const ans= await req.cookies.refreshtoken;
    console.log(ans);
    if(!incomingrefreshtoken)
    {
        throw new handleerror(401,"Unauthorized request");
    }

    try {
        const verifyingtoken=jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)
        const user=await User.findById(verifyingtoken?._id)
        if(!user)
        {
            throw new handleerror(401,"Invalid refresh token");
        }
        if(incomingrefreshtoken!==user?.RefreshToken){
            throw new handleerror(401,"Refresh Token Expired or used")
        }
        const options={
            httpOnly:true,
            secure:true
        }
        const {accesstoken,newrefreshtoken}=await generateAccessandRefreshtoken(user._id)
        return res
        .status(200)
        .cookie("accesstoken",accesstoken,options)
        .cookie("refreshtoken",newrefreshtoken,options)
        .json(
            new handleresponse(
                200,
                {accesstoken,refreshtoken:newrefreshtoken},
                "Access Token Refreshed"
                
            )
        )
    } 
    catch (error) {
        throw new handleerror(401,error?.message ||"Invalid Refresh Token")
        // console.log('invalid refresh token');
        
    }
})


export {loginuser,
    registeruser,
    logoutuser,
    refreshAccessToken
}