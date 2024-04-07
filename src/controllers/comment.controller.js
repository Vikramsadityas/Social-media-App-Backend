import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {handleerror} from "../utils/apierror.js"
import {handleresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"

const getVideoComments = asynchandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

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
})

const deleteComment = asynchandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }