import mongoose from "mongoose";
import Blog from "../Models/AddBlog.Models.js";
import cloudinary from "cloudinary";
import fs from "fs";
import { removeUploadedFiles } from "../MiddleWare/Multer.js";

const base64ImageRegex = /data:image\/(?:png|jpeg|jpg);base64,(.*?)(?=\s|$)/g; // Define the regex for base64 images

const uploadBase64Images = async (content) => {
  const base64ImageMatches = content.match(base64ImageRegex) || [];
  const uploadedImages = [];

  console.log("Base64 Image Matches:", base64ImageMatches);

  for (let i = 0; i < base64ImageMatches.length; i++) {
    try {
      const base64Data = base64ImageMatches[i].replace(/^data:image\/(?:png|jpeg|jpg);base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Wrap Cloudinary upload_stream in a Promise
      const cloudinaryUpload = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder: "blogs" },
          (error, result) => {
            if (error) {
              console.error(`Error uploading image to Cloudinary: ${error}`);
              reject(error);
            } else {
              console.log(`Successfully uploaded image to Cloudinary: ${result.secure_url}`);
              resolve(result.secure_url);
            }
          }
        );
        uploadStream.end(buffer);
      });

      const uploadedUrl = await cloudinaryUpload;
      uploadedImages.push(uploadedUrl);
    } catch (uploadError) {
      console.error(`Error uploading base64 image to Cloudinary: ${uploadError}`);
      throw uploadError; // Throw error so the controller catches it
    }
  }

  return uploadedImages;
};

const AddBlog = async (req, res) => {
  try {
    const { title, author, content, category } = req.body;

    if (!title || !author || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Please fill up all fields.",
      });
    }

    console.log("Received blog data:", { title, author, content, category });

    const uploadedImages = [];

    // Upload images from req.files to Cloudinary
    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const result = await cloudinary.v2.uploader.upload(file.path, {
            folder: "blogs", // Folder in Cloudinary
          });
          uploadedImages.push(result.secure_url); // Store the URL of the uploaded image
        }
        removeUploadedFiles(req.files); // Remove temporary uploaded files after successful upload
      } catch (uploadError) {
        console.error(`Error uploading files to Cloudinary: ${uploadError}`);
        removeUploadedFiles(req.files); // Ensure cleanup happens even on failure
        return res.status(500).json({
          success: false,
          message: "Error uploading files. Please try again.",
        });
      }
    }

    // Upload images from content using base64
    const base64Images = await uploadBase64Images(content);
    uploadedImages.push(...base64Images); // Merge base64 image URLs with file upload URLs

    // Combine uploaded images and update content
    let updatedContent = content;
    for (let i = 0; i < base64Images.length; i++) {
      const imgTag = `<img src="${uploadedImages[i]}" alt="Blog Image" />`;
      updatedContent = updatedContent.replace(base64ImageRegex, imgTag);
    }

    const blogData = {
      title,
      author,
      content: updatedContent, // Updated content with image URLs
      category,
      images: uploadedImages, // Save uploaded images' URLs
    };

    console.log("Blog Data to be saved:", blogData);

    const newBlog = new Blog(blogData);
    await newBlog.save();

    return res.status(201).json({
      success: true,
      message: "Blog added successfully!",
    });
  } catch (error) {
    console.error(`Error in AddBlog controller: ${error}`);
    return res.status(500).json({
      success: false,
      message: `Error in adding blog: ${error.message}`,
    });
  }
};
const getAllBlogs = async (req,res)=>{
  try {
    const allBlogs = await Blog.find({});
    if(allBlogs){
      return res.json({success:true,allBlogs})
    }
    else{
      return res.json({success:false,message:'No Blogs Available'})
    }
  } 
  catch (error) {
    console.log(error);
    return res.json({success:false,message:`error in controller at getAllBlogs ${error}`})
    
  }
}
export { AddBlog,getAllBlogs };
