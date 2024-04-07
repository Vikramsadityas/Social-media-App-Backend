import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { handleerror } from "../utils/apierror.js"
import { handleresponse } from "../utils/apiresponse.js"
import { asynchandler } from "../utils/asynchandler.js"
import { deletefile, uploadFile } from "../utils/cloudinary.js"

const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query} = req.query
    //TODO: get all videos based on query, sort, pagination
    if(!isValidObjectId(req.user._id)) {
        throw  new Error("Invalid user id")
    }
    
        try {
            const videos=await Video.aggregate([
                {
                    $match:{
                        _id:req.user._id,
                        title:{$regex:query,$options:"i"}
                    }
                }
                // {
                //     $sort:{
                //         // createdAt:-1,
                //         sortType:-1
                //     }
                // }
            ]).sort({"createdAt":1})
            if(!videos)
            {
                throw new handleerror(400,"Video not found")
            }
            const options={
                page:page,
                limit:limit
            }
            const data=await Video.aggregatePaginate(
                videos,
                options,
                // (err)=>{
                //     if(err)
                //     {
                //         throw new handleerror(400,"Video Pagination failed")
                //     }
                //     // return result
                // }
            )
    
            if(!data)
            {
                throw new handleerror(400,"Video not fetched")
            }
            return res
            .status(200)
            .json(new handleresponse(200,data,"videos fetched successfully"))
        } catch (error) {
            throw new handleerror(500,"Cannot fetched videos")
        }


})

const publishAVideo = asynchandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!req.user._id)
    {
        throw new handleerror(400,"User Id is invalid")
    }
    
        try {
            const videolocalpath=req.files?.videoFile[0]?.path;
            const thumbnaillocalpath=req.files?.thumbnail[0]?.path;
            if(!thumbnaillocalpath)
            {
                throw new handleerror(400,"Video file must be present")
            }
            if(!videolocalpath)
            {
                throw new handleerror(400,"Video2 file must be present")
            }
            const video=await uploadFile(videolocalpath);
            const thumbnailpath=await uploadFile(thumbnaillocalpath);
            if(!thumbnailpath)
            {
                throw new handleerror(400,"Video not uploaded")
            }
            if(!video)
            {
                throw new handleerror(400,"Video2 here not uploaded")
            }
            const videouser=await Video.create({
                videoFile:video.url,
                title:title,
                description:description,
                thumbnail:thumbnailpath.url
            })
            if(!await Video.find(videouser._id))
            {
                throw new handleerror(400,"videouser empty")
            }
            const isuploaded=await Video.find(videouser._id)
            console.log("1",isuploaded);
            if(!isuploaded)
            {
                throw new handleerror(500,"Video cannot uploaded")
            }
            return res.status(200).json(
                new handleresponse(200,isuploaded,"Video uploaded successfully")
            )
        } catch (error) {
            throw new handleerror(500,"Cannot upload videos not now!!")
        }
})

const getVideoById = asynchandler(async (req, res) => {
    const { videoId } = req.params

    //TODO: get video by id
    const  video= await Video.findById(videoId)
    if (!video) {
        throw new handleerror(400,"Video is not available")
    }
    return res.status(200).json(new handleresponse(200,video,"Video fetched by id successfully"))
})

const updateVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    const {title,description}=req.body
    const thumbnaillocalpath=req.file?.path;
    if(!thumbnaillocalpath)
            {
                throw new handleerror(400,"thumbnail file must be present")
            }
    const thumbnailpath=await uploadFile(thumbnaillocalpath);
    if(!thumbnailpath)
    {
        throw new handleerror(400,"Video not uploaded")
    }
    //TODO: update video details like title, description, thumbnail
    const video=await Video.findByIdAndUpdate(videoId,{
        title,
        description,
        thumbnail:thumbnailpath.url
    })
    const isuploaded=await Video.find(video._id)
    return res.status(200).json(new handleresponse(200,isuploaded,"Video details updated successfully"))
})

const deleteVideo = asynchandler(async (req, res) => {
    const { videoId } = req.params
    const videotodelete=await Video.findById(videoId)
    if(!videotodelete){
        throw new handleerror(400,"Video file not present")
    }
    const videopath=videotodelete.videoFile?videotodelete.videoFile:null
    if(!videopath)
    {
        throw new handleerror(400,"No video to Delete")
    }
    await deletefile(videopath)
    const video=await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                videoFile:""
            }
        },
        {new:true}
    )
        return res.status(200).json(new handleresponse(200,video,"Video deleted Successfully"))

    //TODO: delete video
})

const togglePublishStatus = asynchandler(async (req, res) => {
    const { videoId } = req.params
    const video=await Video.findById(videoId)
    if (!video)
    {
        throw new handleerror(400,"Video not found")
    }
    return res
    .status(200)
    .json(
        new  handleresponse(200,video,"Video is published")
    )

})


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
}