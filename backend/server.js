import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import ConnectCloudinary from './utils/cloudinary.js'
import ConnectMongoose from './utils/mongoose.js'
import adminRouter from './Routes/AdminRoutes.js'
import userRouter from './Routes/UserRoutes.js'
configDotenv()
const  app=express()
const port=process.env.PORT || 4000 
ConnectCloudinary()
ConnectMongoose()
app.use(express.json())
app.use(cors('http://localhost:5173','http://localhost:5174'))

app.get('/',(req,res)=>{
res.send('Api Working finegg uuu king hjj')
})

//end points
app.use('/api/admin',adminRouter)
app.use('/api/user',userRouter)

app.listen(port,()=>console.log('server started at',port))
