import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "", // Default is empty, can be updated later
    },
    dob: {
      type: Date,
      required: false, // Optional; can be added later
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // Restrict to specific values
      required: false,
    },
    favorites: [
      {
        blog: {
          type: mongoose.Schema.Types.ObjectId, // Reference to Blog model
          ref: "Blog",
        },
        date: {
          type: Date,
          default: Date.now, // When the blog was added to favorites
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
