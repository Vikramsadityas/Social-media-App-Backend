import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {handleerror} from "../utils/apierror.js"
import {handleresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"

const getVideoComments = asynchandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    try {
        const allcomments=await Comment.aggregate([
            {
                $match:{
                    video:videoId
                }
            },
            {
                $lookup:{
                    from:'videos',
                    localField: 'video',
                    foreignField: '_id',
                    as: 'video_info'
                }
            }
        ])  
        if(!allcomments)
        {
            throw new handleerror(400,"Comments cannot fetched")
        } 
        const options={
            page:page,
            limit:limit
        }
        const data=await Comment.aggregatePaginate(
            allcomments,
            options
        )         
        if(!data)
        {
            throw new handleerror(500,"Comment not found")
        }
        return res .status(200).json(new handleresponse(200,data,"Comment fetched successfully"))
    } 
    catch (error) {
        throw new handleerror(error)
    }

})

const addComment = asynchandler(async (req, res) => {
    // TODO: add a comment to a video
    const {comment}=req.body
    console.log("2",comment)
    if(!comment)
    {
        throw new handleerror(400,"Comment cannot be empty!!")
    }
    const commentuser=await Comment.create({
        comment:comment
    })
    if(!commentuser)
    {
        throw new handleerror(500,"Comment cannot added") 
    }
    const mycomment=await Comment.findById(commentuser._id)
    return res
    .status(200)
    .json(new handleresponse(200,mycomment,"Comment added successfully"))
})

const updateComment = asynchandler(async (req, res) => {
    // TODO: update a comment
    const {commentId}=req.params
    const{newcomment}=req.body
    const commenttoupdate=await Comment.findByIdAndUpdate(commentId,{
            comment:newcomment
    },{new:true})
    if(!commenttoupdate)
    {
        throw new handleerror(400,"No such comment found")
    }
    return res.status(200).json(new handleresponse(200,commenttoupdate,"Comment updated successfully"))
})

const deleteComment = asynchandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params
    const commenttodelete=await Comment.findByIdAndDelete(commentId)
    if(!commenttodelete){
        throw new handleerror(400,"No such comment to delete")
    }
    return res.status(200).json(new handleresponse(200,commenttodelete,"Comment deleted successfully"))
    })

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }