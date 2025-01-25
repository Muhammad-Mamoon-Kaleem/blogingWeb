import express from 'express'
import { AddBlog, getAllBlogs } from '../Controllers/AddBogs.Controller.js'
import multer from 'multer'
import {upload} from '../MiddleWare/Multer.js'

const adminRouter=express.Router()
const middleWare = multer()

adminRouter.post('/addblog',upload.array("images", 3),AddBlog)
adminRouter.get('/getallblogs',getAllBlogs)

export default adminRouter