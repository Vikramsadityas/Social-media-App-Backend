import mongoose,{Schema} from "mongoose";
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
    Watchhistory:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    RefereshToken:{
        type:String,
    }
},{timestamps:true})
export const User=mongoose.model("User",userSchema)