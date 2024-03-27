import mongoose, { Schema } from "mongoose";
const likedSchema=new Schema({
    video:{
        type:mongoose.Types.ObjectId,
        ref:"Video"
    },
    comment:{
        type:mongoose.Types.ObjectId,
        ref:"Comment"
    },
    tweet:{
        type:mongoose.Types.ObjectId,
        ref:"Tweet"
    },
    likedby:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }



},{timestamps:true})
export const like=mongoose.model("Like",likedSchema)