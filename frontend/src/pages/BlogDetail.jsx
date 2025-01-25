import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FaHeart, FaRegComment, FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import { addComment, selectBlogserrors, selectComments } from "../redux/addCommentSlice";
const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { backendUrl, token } = useContext(AppContext);
  const blog = location.state?.blog;
  const [likes, setLikes] = useState(blog?.likes || 0);
  const updatedComments = useSelector(selectComments);
  const [comments, setComments] = useState( []);
  const error = useSelector(selectBlogserrors);
  const loading = useSelector((state)=>state.blogscomment.loading)
  const [commentText, setCommentText] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    // Reset comments when the blog ID changes
    setComments(blog?.comments || []); 
    if (updatedComments.length > 0) {
      setComments(updatedComments);
    }
  }, [id, blog?.comments, updatedComments]); 
  
  useEffect(() => {
    // Reset comments when the blog ID changes
    setComments(blog.comments || []);  // Reset comments to empty array when ID changes
  }, [id]);  // Depend on `id` to trigger reset
  

  const handleLike = async () => {
    setLikes((prevLikes) => prevLikes + 1);
    // Optional: Update like count on the backend
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast.warning("Comment cannot be empty!");
      return;
    }
    if (!token) {
            navigate("/login");
            toast.warning("Please log in before commenting.");
            return;
          }

     dispatch(addComment({blogId:id,comment:commentText,token}))
     .unwrap()
     .then(()=>{
      setCommentText('')
      toast.success('Comment added successfully!')
     })

     .catch((error)=>{
      console.log(error);
      toast.error('Failed to add comment. Please try again.');
     })
    // try {
    //   const { data } = await axios.post(
    //     `${backendUrl}/api/user/addcomment`,
    //     { blogId: id, comment: commentText },
    //     config
    //   );

    //   if (data.success) {
    //     setComments(data.comments);
    //     setCommentText("");
    //     toast.success("Comment added successfully!");
    //   } else {
    //     if (!token) {
    //       navigate("/login");
    //       toast.warning("Please log in before commenting.");
    //       return;
    //     }
    //   }
    // } catch (error) {
    //   toast.error("Failed to add comment. Please try again.");
    //   console.error(error);
    // }
  };

  const handleFavorite = () => {
    setIsFavorite((prev) => !prev);
    // Optional: Update favorite status on the backend
  };


  if (!blog) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-red-600">Blog not found!</h1>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Function to sanitize malformed img tags
  const sanitizeContent = (content) => {
  // Regex to capture img tags and extract the src attribute
  return content.replace(/<img src="/, '$1 alt="Blog Image" class="w-full object-cover rounded-md" />');
};



  // Sanitize the blog content
  const sanitizedContent = sanitizeContent(blog.content);
console.log('after',sanitizedContent);
console.log(blog.content);


  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4">
        <img
          src={blog.images || "https://via.placeholder.com/300"}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-md mb-4"
          onError={(e) => (e.target.src = "https://via.placeholder.com/300")}
        />
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <p className="text-gray-600 text-sm mb-2">
          By {blog.author} | {new Date(blog.date).toLocaleDateString()}
        </p>
        <div
          className="text-gray-800 mb-6"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }} >
        </div>
         {/* Interaction Section */}
         <div className="flex items-center justify-between py-4 border-t border-gray-300">
          {/* Like Section */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full text-pink-500 hover:bg-pink-200 transition-colors"
            >
              <FaHeart size={18} />
            </button>
            <span className="text-sm text-gray-700 font-medium">
              {blog.likes.length} Likes
            </span>
          </div>

          {/* Comment Section */}
          <div className="flex items-center gap-2">
            <FaRegComment size={18} className="text-green-500" />
            <span className="text-sm text-gray-700 font-medium">
              {comments.length} Comments
            </span>
          </div>

          {/* Favorite Section */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleFavorite}
              className={`flex items-center justify-center w-10 h-10 ${
                isFavorite
                  ? "bg-yellow-500 text-white"
                  : "bg-yellow-100 text-yellow-500"
              } rounded-full hover:bg-yellow-200 transition-colors`}
            >
              <FaStar size={18} />
            </button>
            <span className="text-sm text-gray-700 font-medium">
              {isFavorite ? "Favorited" : "Favorite"}
            </span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Comments</h3>
          
          <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg shadow-sm p-4 bg-gray-50 mb-4">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="mb-4 pb-2 border-b border-gray-200 last:border-none"
                >
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-medium text-green-600">
                      {comment.user?.name || "Anonymous"}
                    </span>{" "}
                    <span className="text-gray-500 text-xs italic">
                      ({new Date(comment.date).toLocaleString()})
                    </span>
                  </p>
                  <p className="text-sm text-gray-800">{comment.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No comments yet.</p>
            )}
          </div>

          {/* Add Comment Input */}
          <div className="flex flex-col">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3"
            />
            <button
              onClick={handleAddComment}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {loading ? 'Adding Comment' :
              'Add Comment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
