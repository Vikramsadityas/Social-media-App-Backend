import mongoose,{Schema} from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcryptjs"
const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        index:true,
        trim:true
    },
    avatar:{
        type:String,
        required:true,
    },
    Coverimage:{
        type:String //cloudinary url
    },
    Watchhistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    RefereshToken:{
        type:String,
    }
},{timestamps:true})
userSchema.pre( 'save',async function(next){
    if(!this.isModified("password")) return next()
    this.password=await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.ispasswordcorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateaccesstoken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullname:this.fullname,
            username:this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generaterefreshtoken=function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model("User",userSchema)