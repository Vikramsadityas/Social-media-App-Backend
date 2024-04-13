import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {handleerror} from "../utils/apierror.js"
import {handleresponse} from "../utils/apiresponse.js"
import {asynchandler} from "../utils/asynchandler.js"
import {Video} from "../models/video.model.js"


const createPlaylist = asynchandler(async (req, res) => {
    //TODO: create playlist
    const {name, description} = req.body
    if(!name)
    {
        throw new handleerror(400,"name is compulsory")
    }
    const playlist=await Playlist.create(
        {
            name:name,
            description:description?description:"",
            owner:req.user?._id
        }
    )
    return res.status(200).json(new handleresponse(200,playlist,"Playlist created Successfully"))
})

const getUserPlaylists = asynchandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId))
    {
        throw new handleerror(400,"User Id is Invalid")
    }
    const userplaylist=await Playlist.find({
        owner:userId
    })
    if(!userplaylist)
    {
        throw new handleerror(500,"No playlist found")
    }
    return res.status(200).json(new handleresponse(200,userplaylist,"Playlist fetched successfully"))
})

const getPlaylistById = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist=await Playlist.findById(playlistId)
    if(!playlist)
    {
        throw new handleerror(400,"Playlist Not Found!")
    }
    return res.status(200).json(new handleresponse(200,playlist,"Playlist fetched successfully"))
})

const addVideoToPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const video=await Video.findById(videoId)
    const myPlaylist=await Playlist.findByIdAndUpdate(playlistId,
        {
            videos:video
        }
    )
    if(!myPlaylist)
    {
        throw new handleerror(500,"Video cannot be added")
    }
    return res.status(200).json(new handleresponse(200,myPlaylist,"Video added successfully"))
})

const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    const videotoremove=await Playlist.findByIdAndUpdate(
        {_id:playlistId,},
        {$pull:{videos:videoId}}
    )
    return res.status(200).json(new handleresponse(200,videotoremove,"Video removed Successfully"))
})

const deletePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const DeletedPlaylist=await Playlist.findByIdAndDelete(playlistId)
    if(!DeletedPlaylist)
    {
        throw new handleerror(500,"Playlist cannot be Deleted")
    }
    return res.status(200).json(new handleresponse(200,DeletedPlaylist,"Playlist Deleted Successfully"))
})

const updatePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    const UpdatedPlaylist=await Playlist.findByIdAndUpdate(playlistId,
    {
        name,
        description
    })
    if(!UpdatedPlaylist)
    {
        throw new handleerror(500,"Playlist Cannot be updated")
    }
    //TODO: update playlist
    return res.status(200).json(new handleresponse(200,UpdatedPlaylist,"Playlist Updated Successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}