import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {handleerror} from "../utils/apierror.js"
import {handleresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"

const createTweet = asynchandler(async (req, res) => {
    //TODO: create tweet
    const {tweet}=req.body
    if(!tweet)
    {
        throw new handleerror(400,"Tweet cannot be empty!!")
    }
    const tweetuser=await Tweet.create({
        tweet:tweet
    })
    if(!tweetuser)
    {
        throw new handleerror(500,"Comment cannot added") 
    }
    const mytweet=await Tweet.findById(tweetuser._id)
    return res
    .status(200)
    .json(new handleresponse(200,mytweet,"Comment added successfully"))
})

const getUserTweets = asynchandler(async (req, res) => {
    const {userId}=req.params
   const usertweet=await Tweet.find({owner:userId})
   if(!usertweet)
   {
        throw new handleerror(400,"Tweet not present in DB")
   }
   return res
   .status(200)
   .json(new handleresponse(200,usertweet,"Tweet fetched successfully"))
})

const updateTweet = asynchandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    console.log(tweetId,"cc")
    const { content } = req.body
    console.log(content,"dc")


    if (!isValidObjectId(tweetId)) {
        throw new handleerror(400, "tweet id is not valid");
    }

    if (!content) {
        throw new handleerror(400, "Content is not found");
    }

    const updatedtweet = await Tweet.findByIdAndUpdate(tweetId, {
        $set: {
            tweet:content,
        }
    }, { new: true })

    if (!updatedtweet) {
        throw new handleerror(400, "Content is not updated");
    }

    return res.status(200).json(new handleresponse(200, updatedtweet, "Successfully updated tweet"));


})

const deleteTweet = asynchandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params
    if(!isValidObjectId(tweetId))
    {
        throw new handleerror(400,"tweet Id cannot fetched")
    }
    const deletedtweet=await Tweet.findByIdAndDelete(tweetId)
    if(!deletedtweet)
    {
        throw new handleerror(500,"Tweet cannot be deleted")
    }
    return res .status(200).json(new handleresponse(200,deletedtweet,"Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}