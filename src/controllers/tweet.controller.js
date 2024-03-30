import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {handleerror} from "../utils/apierror.js"
import {handleresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"

const createTweet = asynchandler(async (req, res) => {
    //TODO: create tweet
    console.log("0",req.body.content)
    console.log("2",req.user._id)
    const {content}=req.body;
    console.log("1",content)
    if(!req.user._id)
    {
        throw new handleerror(400,"User ID invalid")
    }
    if(!content)
    {
        throw new handleerror(400,"No tweet fetched")
    }
    const creatingtweet=await Tweet.create({
            content:content
        })
    if(!creatingtweet)
    {
        throw new handleerror(500,"Problem occured in creating tweet")
    }
    const createdtweet=await Tweet.findById(creatingtweet._id)
    if(!createdtweet)
    {
        throw new handleerror(500,"Created but not able to find the tweet")
    }
    return res
    .status(200)
    .json(new handleresponse(200,createdtweet,"Tweet created successfully"))
})

const getUserTweets = asynchandler(async (req, res) => {
    // TODO: get user tweets
})

const updateTweet = asynchandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asynchandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}