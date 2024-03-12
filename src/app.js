import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()
app.use(cors({
    origin:process.env.CORS_URL,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded( { extended: true } ))
app.use(express.static("public"))
// parse cookies    
app.use(cookieParser())

export {app}