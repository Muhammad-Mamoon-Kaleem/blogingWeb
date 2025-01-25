import mongoose from "mongoose";

const AddBlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    content: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: false, // Images are optional
      },
    ],

    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId, // Reference to User model
          ref: "User", // Reference to the User model
        }
      },
    ],

    // favorites: {
    //   type: Number,
    //   default: 0, // Initialize with 0
    // },
    comments: [
      {
        user: {
          id: mongoose.Schema.Types.ObjectId,
          name: String,
          email: String,
        },
        comment: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", AddBlogSchema);

export default Blog;
