import mongoose, { Schema } from "mongoose";
const tweetSchema=new Schema({
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        required:true
    },
    
},{timestamps:true})
export const tweet=mongoose.model("Tweet",tweetSchema)