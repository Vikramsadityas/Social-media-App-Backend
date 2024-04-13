import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {handleerror} from "../utils/apierror.js"
import {handleresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"
import {Video} from "../models/video.model.js"
import {Comment} from "../models/comment.model.js"
import {Tweet} from "../models/tweet.model.js"

const toggleVideoLike = asynchandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId))
    {
        throw new handleerror(400,"Invalid request")
    }
    const {video}=await Video.findById(videoId)
    // if(!video)
    // {
    //     throw new handleerror(400,"Video not found")
    // }
    // if(!video.isPublished)
    // {
    //     throw new handleerror(400,"Video not publish")
    // }
    const userAlreadyliked=await Like.findOne({
        video:videoId,
        likedby:req.user?._id
    })
    if(userAlreadyliked)
    {
        await Like.findOneAndDelete({
            video:videoId,
            likedby:req.user?._id
        })
        return res.status(200).json(200,"Liked removed successfully")
    }
    const likevideo=await Like.create({
        video:videoId,
        likedby:req.user?._id
    })
    if(!likevideo)
    {
        throw new handleerror(500,"Video cannot be liked")
    }

    return res.status(200).json(new handleresponse(200,likevideo,"Liked toggle succesfully"))

})

const toggleCommentLike = asynchandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId))
    {
        throw new handleerror(400,"Invalid request")
    }
    const {video}=await Comment.findById(commentId)
    // if(!video)
    // {
    //     throw new handleerror(400,"Video not found")
    // }
    // if(!video.isPublished)
    // {
    //     throw new handleerror(400,"Video not publish")
    // }
    const userAlreadyliked=await Like.findOne({
        comment:commentId,
        likedby:req.user?._id
    })
    if(userAlreadyliked)
    {
        await Like.findOneAndDelete({
            comment:commentId,
            likedby:req.user?._id
        })
        return res.status(200).json(200,"Liked removed successfully")
    }
    const likecomment=await Like.create({
        comment:commentId,
        likedby:req.user?._id
    })
    if(!likecomment)
    {
        throw new handleerror(500,"comment cannot be liked")
    }

    return res.status(200).json(new handleresponse(200,likecomment,"Liked toggle succesfully"))



})

const toggleTweetLike = asynchandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId))
    {
        throw new handleerror(400,"Invalid request")
    }
    const {tweet}=await Tweet.findById(tweetId)
    // if(!video)
    // {
    //     throw new handleerror(400,"Video not found")
    // }
    // if(!video.isPublished)
    // {
    //     throw new handleerror(400,"Video not publish")
    // }
    const userAlreadyliked=await Like.findOne({
        tweet:tweetId,
        likedby:req.user?._id
    })
    if(userAlreadyliked)
    {
        await Like.findOneAndDelete({
            tweet:tweetId,
            likedby:req.user?._id
        })
        return res.status(200).json(200,"Liked removed successfully")
    }
    const liketweet=await Like.create({
        tweet:tweetId,
        likedby:req.user?._id
    })
    if(!liketweet)
    {
        throw new handleerror(500,"Tweet cannot be liked")
    }

    return res.status(200).json(new handleresponse(200,liketweet,"Liked toggle succesfully"))

}
)

const getLikedVideos = asynchandler(async (req, res) => {
    //TODO: get all liked videos
    const likevideo=await Like.aggregate(
        [
            {
                $group:{
                    _id:"$video"
                }
            }
        ]
    )
        return res.status(200).json(new handleresponse(200,likevideo,"Liked Video found successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}