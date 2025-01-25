import express, { Router } from 'express'
import { addComment, addFavourite, addLike, changePassword, createUser, LoginUser, myFavourite, SendConfirmationCode, verifyConfirmationcode } from '../Controllers/User.Controllers.js'
import multer from 'multer'
import Userauthentication from '../MiddleWare/UserAuthentication.js'

const userRouter = express.Router()
const middleWare = multer()
userRouter.post('/createuser',middleWare.none(),verifyConfirmationcode,createUser)
userRouter.post('/sendconfirmationcode',middleWare.none(),SendConfirmationCode)
userRouter.post('/login',LoginUser)
userRouter.post('/changepassword',middleWare.none(),verifyConfirmationcode,changePassword)
userRouter.post('/addcomment',Userauthentication('Please Login Before adding comment'),addComment)
userRouter.post('/addlike',Userauthentication('Please Login Before Like'),addLike)
userRouter.post('/addtofavorite',Userauthentication('Please Login Before to add Favorite'),addFavourite)
userRouter.post('/myfavourite',Userauthentication('Please Login before'),myFavourite)
export default userRouter