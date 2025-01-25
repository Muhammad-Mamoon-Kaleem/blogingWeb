import validator from 'validator'
import bcrypt from 'bcrypt'
import User from '../Models/User.Models.js'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import Blog from '../Models/AddBlog.Models.js'

const confirmationCodes = new Map();
const codeSendLimits = new Map();

const createUser = async(req,res)=>{
    try {
        const{name,email,password}=req.body
        if(!email || !password || !name){
            return res.json({success:false,message:"Please Fill Up All Required Field"})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:'Please give a valid Email'})
        }
        if(password.length < 8){
            return res.json({success:false,message:'Password length must be or greater then 8'})
        }
        //encrypt password before we store in db
        const salt = await bcrypt.genSalt(10)
        const hashPassword=await bcrypt.hash(password,salt)
        const userData ={
            email,
            name,
            password:hashPassword
        }
        const user= new User(userData)
        const newUser = await user.save()
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET_kEY)
        console.log('user created successfully',{token,userData});
        return res.json({success:true,message:'user created successfully',token})
        
    } 

    catch (error) {
       console.log('error in creating user at controller',error);
       return res.json({success:false,message:`User already exists With this Email`})
    }
}
const SendConfirmationCode = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.json({ success: false, message: "Valid Email is Required to send confirmation code" });
        }

        // Check if the email has exceeded the send limit
        if (codeSendLimits.has(email)) {
            const { sentCount, lastSentTime } = codeSendLimits.get(email);
            const currentTime = Date.now();

            // Check if it's been less than 1 hour since the last send
            if (sentCount >= 2 && (currentTime - lastSentTime) < 60 * 60 * 1000) {
                const remainingTime = currentTime - lastSentTime; // Time difference in milliseconds
                const minutesLeft = Math.floor(remainingTime / (60 * 1000));
                console.log(60 - minutesLeft);
                return res.json({ success: false, message: `You can request a new confirmation code in ${60 - minutesLeft} minutes.` });
            }

            // If 1 hour has passed, reset the counter
            if ((currentTime - lastSentTime) >= 60 * 60 * 1000) {
                codeSendLimits.set(email, { sentCount: 0, lastSentTime: currentTime });
            }
        } else {
            // Initialize tracking for this email
            codeSendLimits.set(email, { sentCount: 0, lastSentTime: Date.now() });
        }

        const confirmationCode = crypto.randomInt(100000, 999999);
        confirmationCodes.set(email, { code: confirmationCode, expires: Date.now() + 5 * 60 * 1000 });

        // Set up for sending this code via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Professional email template
        const htmlTemplate = `
     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #28a745;"><span style="color: #333;">Eco</span>Friendly</h1>
        <p style="font-size: 18px; color: #555;">Promoting Sustainability for a Better Tomorrow</p>
    </div>
    <div style="padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
        <p style="font-size: 16px; color: #333;">Hello,</p>
        <p style="font-size: 16px; color: #333;">
            Thank you for choosing EcoFriendly! Please use the following code to verify your email and continue your journey toward sustainability:
        </p>
        <p style="font-size: 24px; color: #28a745; text-align: center; margin: 20px 0;">
            <strong>${confirmationCode}</strong>
        </p>
        <p style="font-size: 14px; color: #999;">This code is valid for the next 15 minutes. Please do not share it with anyone.</p>
    </div>
    <div style="text-align: center; margin-top: 20px;">
        <p style="font-size: 14px; color: #777;">
            If you did not request this code, please ignore this email or contact our support team.
        </p>
        <p style="font-size: 14px; color: #28a745;">EcoFriendly Support Team</p>
    </div>
    <div style="text-align: center; margin-top: 30px;">
        <a href="https://ecofriendly.example.com" style="text-decoration: none; color: #fff; background-color: #28a745; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Visit Our Website</a>
    </div>
</div>
`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Verification Code - Hammad Travels',
            html: htmlTemplate,
        };

        // Send the email using nodemailer
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation code sent to ${email}`);

        const current = codeSendLimits.get(email);
        codeSendLimits.set(email, {
            sentCount: current.sentCount + 1,
            lastSentTime: Date.now(),
        });

        return res.json({ success: true, message: `Confirmation code sent to ${email}` });
    } catch (error) {
        console.log('Confirmation code not sent due to', error);
        return res.json({ success: false, message: `Confirmation code not sent due to ${error}` });
    }
};

const verifyConfirmationcode = async (req, res, next) => {
    try {
        const { email, confirmationCode } = req.body
        console.log(email,confirmationCode);
        
        if (!email || !confirmationCode) {
            return res.json({ success: false, message: "Email Or Confirmation code is not provided" })
        }
        const storeCode = confirmationCodes.get(email)

        if (!storeCode || storeCode.code !== parseInt(confirmationCode) || storeCode.expires < Date.now()) {
            return res.json({ success: false, message: "Invalid or Expire confirmation code" })
        }
        confirmationCodes.delete(email)
        next();
    }
    catch (error) {
        console.log(`error in code verification ${error}`);
        return res.json({ success: false, message: error })
    }
}
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            console.log("User Not Found With This Email");
            return res.json({ success: false, message: 'User Not Found With This Email' })
        }
        const passwordMatched = await bcrypt.compare(password, user.password)
        if (passwordMatched) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_kEY)
            console.log('login successfully', token);
            return res.json({ success: true, token })
        }
        else {
            console.log('Login Failed Invalid credentials');
            return res.json({ success: false, message: 'Invalid credentials' })
        }

    }
    catch (error) {
        console.log('Error in User Login', error);
        return res.json({ success: false, message: `Error in Login User ${error}` })
    }
}

const changePassword=async(req,res)=>{
    try {
        const {email,password} =req.body
        const user =await User.findOne({email});

        if(!user){
            console.log('User Not Found With This Email');
            return res.json({success:false,message:'User Not Found With This Email'})
        }
        if(!email || !password){
            return res.json({success:false,message:"Email or New Password is not Provided"})
        }
        if(password.length<8){
            return res.json({success:false,message:'Password length must be 8 characters'})
        }

        const salt=await bcrypt.genSalt(10)
        const hashPassword=await bcrypt.hash(password,salt)
        user.password=hashPassword
        await user.save();
        console.log('Password updated successfully', hashPassword);
        return res.json({ success: true, message: 'Password updated successfully' });
    } 
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: `Error in changing password, ${error}` })
    }
}
const addComment = async(req,res)=>{
    try {
        const {userId,blogId,comment} = req.body
        if(!userId || !blogId || !comment){
            console.log('Parametrs are missing i.e,userId,blogId or comment');
            return res.json({success:false,message:'Parametrs are missing i.e,userId,blogId or comment'})
        }
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.json({success:false,message:'No Blog found for this id'})
        }
        const user = await User.findById(userId).select('-password');
        blog.comments.push({
            user: {
                id: user._id,
                name: user.name, // Include additional user details if necessary
                email: user.email,
            },
            comment,
        });
        await blog.save();
        console.log(blog.comments);
        

        return res.status(200).json({
            success:true,
            message: "Comment added successfully.",
            comments: blog.comments, // Return the updated comments
        });
    } 
    catch (error) {
       console.log(error);
       return res.json({success:false,message:error}) 
    }
}
const addLike = async (req, res) => {
    try {
      const { userId, blogId } = req.body;
  
      if (!userId || !blogId) {
        return res.status(400).json({
          success: false,
          message: "Parameters are missing: userId, blogId",
        });
      }
  
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid userId or blogId",
        });
      }
  
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(404).json({ success: false, message: "No Blog found for this ID" });
      }
  
      console.log("Blog likes before update:", blog.likes);
  
      // Check if the user already liked the blog
      const isAlreadyLiked = blog.likes.some(
        (like) => like.user.toString() === userId
      );
  
      if (isAlreadyLiked) {
        // Remove the like
        blog.likes = blog.likes.filter((like) => like.user.toString() !== userId);
        await blog.save();
        return res.status(200).json({ success: true, message: "Like removed successfully", blog,userId });
      } else {
        // Add a new like
        blog.likes.push({ user: userId });
        await blog.save();
        return res.status(200).json({ success: true, message: "Blog liked successfully", blog,userId });
      }
    } catch (error) {
      console.error("Error in addLike:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  const addFavourite = async(req,res)=>{
    try {
        const {userId,blogId }=req.body
        if(!userId || !blogId){
            return res.status(400).json({
                success: false,
                message: "Parameters are missing: userId, blogId",
              });
        }
        const user = await User.findById(userId)
        const blog=await Blog.findById(blogId)
        if(!user){
            console.log('Currently User is not available for this id');
            return res.json({success:false,message:'Currently User is not available for this id'})
        }
        const isAlreadyFav =user.favorites.some((fav)=>fav.blog.toString()===blogId);
        if(isAlreadyFav){
            user.favorites=user.favorites.filter((fav)=>fav.blog.toString()!==blogId);
            await user.save()
            // await Blog.findByIdAndUpdate(blogId, { $inc: { favorites: -1 } });
            return res.status(200).json({ success: true, message: "Blog removed from Favorite", user,blogId });
        }
        else{
            user.favorites.push({blog:blogId})
            await user.save();
            // await Blog.findByIdAndUpdate(blogId, { $inc: { favorites: 1 } });

            return res.status(200).json({ success: true, message: "Blog added to Favourite successfully", user,blogId });
        }

    }
     catch (error) {
        console.log(error);
        return res.json({success:false,message:error})
    }
  }

  const myFavourite = async(req,res)=>{
    try {
        const {userId}=req.body
        const user=await User.findById(userId)
        if(!user){
            return res.json({success:false,message:'User Not available for this id'})
        }
       
        const favoriteBlogIds = user.favorites.map((fav) =>
           new mongoose.Types.ObjectId(fav.blog)
          );
      
          console.log("Favorite Blog IDs:", favoriteBlogIds);
      
          // Query blogs
          const blogs = await Blog.find({ _id: { $in: favoriteBlogIds } });
      
          console.log("Fetched Blogs:", blogs);
        
        return res.json({blogs}); 
    }
     catch (error) {
        console.log(error);
        return res.json({success:false,message:error})
    }
  }
export{createUser,SendConfirmationCode,verifyConfirmationcode,LoginUser,changePassword,addComment,addLike,addFavourite,myFavourite}