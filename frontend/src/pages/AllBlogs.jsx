import React, { useState, useEffect, useContext } from "react";
import { FaHeart, FaRegComment, FaStar } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBlogs, selectAllBlogs, selectBlogsError, selectBlogsLoading } from "../redux/blogsSlice";
import { selectComments } from "../redux/addCommentSlice";
import { addlike, selectlikes, selectUserId } from "../redux/addLikeSlice";
import { addFavourite, selectFavorites } from "../redux/addFavoriteSlice";

const AllBlogs = () => {
  const blogs = useSelector(selectAllBlogs);
  const dispatch = useDispatch();
  const loading = useSelector(selectBlogsLoading);
  const blogError = useSelector(selectBlogsError);
  const likes = useSelector(selectlikes)
  const favoritesFromRedux = useSelector(selectFavorites)
  // const blogfav=useSelector(selectBlogfav)
  const [Favourites, setFavourites] = useState(favoritesFromRedux );


  const loggedInUserId = useSelector(selectUserId)
  const [filteredBlogs, setFilteredBlogs] = useState([]); // Blogs to display based on the category
  const [activeCommentId, setActiveCommentId] = useState(null); // Tracks which blog's comment input is visible
  const [commentText, setCommentText] = useState(""); // Tracks comment input value
  const { category } = useParams(); // Extract category from URL params
  const navigate = useNavigate();
  const { token } = useContext(AppContext)

  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);

  useEffect(() => {
    setFavourites(favoritesFromRedux);
  }, [favoritesFromRedux]);

  useEffect(() => {
    if (category) {
      setFilteredBlogs(blogs.filter((blog) => blog.category === category));
    } else {
      setFilteredBlogs(blogs); // Show all blogs if no category is provided
    }
  }, [category, blogs]);

  const handleFavourite = (id) => {
    if (!token) {
      navigate("/login");
      toast.warning("Please log in before liking.");
      return;
    }
    dispatch(addFavourite({ blogId: id, token }))
  .unwrap()
  .then((updatefav) => {
    console.log(updatefav); // Inspect the structure of updatefav
    setFilteredBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === id ? { ...blog, blogfav: updatefav.blogFav } : blog
      )
    );
  })
      .catch((error) => {
        console.error("Error adding to favorites:", error);
        toast.error(error.message || "Failed to add to favorites. Please try again.");
      });
  }

  const handleLike = (id) => {
    if (!token) {
      navigate("/login");
      toast.warning("Please log in before liking.");
      return;
    }

    dispatch(addlike({ blogId: id, token }))
      .unwrap()
      .then((updatedLikes) => {
        // Update the blog's likes in the filteredBlogs state
        setFilteredBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === id ? { ...blog, likes: updatedLikes } : blog
          )
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to add like. Please try again.");
      });
  };


  const handleCommentClick = (id) => {
    setActiveCommentId((prevId) => (prevId === id ? null : id));
    setCommentText(""); // Reset input when toggling
  };

  const addComment = async (blogId) => {
    if (!commentText.trim()) {
      alert("Comment cannot be empty!");
      return;
    }

    try {
      console.log("Token in AppContext:", token);
      const { data } = await axios.post(backendUrl + '/api/user/addcomment', { blogId, comment: commentText }, config)

      if (data.success) {
        console.log('Comment Added Successfully', data.comments);
        alert("Comment added successfully!");
        setCommentText(""); // Clear input after adding comment
        setActiveCommentId(null); // Hide input field after submission 
      }
      else {
        if (!token) {
          navigate('/login')
          toast.warning('Please Login Before comment')
          return;
        }
        console.log('failedto add comment', data.message);
      }


      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId ? { ...blog, comments: data.comments } : blog
        )
      );


    }
    catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">
        {category ? `${category} Blogs` : "All Blogs"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start auto-rows-[minmax(0, auto)]">
        {filteredBlogs.map((blog) => (
          <div
            key={blog._id}

            className="p-3 border rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-blue-50"
          >
            <div
              className="cursor-pointer"
              onClick={() =>
                navigate(`/blogdetail/${blog._id}`, { state: { blog } })
              }
            >
              <img
                src={blog.images || "https://via.placeholder.com/300"}
                alt={blog.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-sm text-gray-600 mb-4">
                By {blog.author} |{" "}
                {new Date(blog.date).toLocaleDateString()}
              </p>
              <p
                className="text-gray-700 mb-4 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              ></p>
            </div>
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLike(blog._id)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors bg-pink-200 text-pink-500 hover:text-pink-600 hover:bg-pink-300`}
                >
                  <FaHeart size={18} />
                </button>
                <span className="text-sm text-gray-700 font-medium">
                  {blog.likes.length} Likes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  // onClick={() => handleCommentClick(blog._id)}
                  onClick={() =>
                    navigate(`/blogdetail/${blog._id}`, { state: { blog } })
                  }
                  className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full text-green-500 hover:bg-green-200 transition-colors"
                >
                  <FaRegComment size={18} />
                </button>
                <span className="text-sm text-gray-700 font-medium">
                  {blog.comments.length} Comment
                </span>
              </div>
              <div className="flex items-center gap-2">
              <button
                onClick={() => handleFavourite(blog._id)}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  Array.isArray(Favourites) && Favourites.includes(blog._id)
                    ? "bg-green-400 text-yellow-700 hover:bg-yellow-500"
                    : "bg-yellow-100 text-yellow-500 hover:bg-yellow-200"
                }`}
              >
                  <FaStar size={18} />
                </button>
                <span className="text-sm text-gray-700 font-medium">
                Favourite
                </span>
              </div>
            </div>
            {activeCommentId === blog._id && (
              <div className="mt-4">
                {/* Display Comments */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg shadow-sm p-4 bg-gray-50">
                    {blog.comments && blog.comments.length > 0 ? (
                      blog.comments.map((comment, index) => (
                        <div
                          key={index}
                          className="mb-4 pb-2 border-b border-gray-200 last:border-none"
                        >
                          <p className="text-sm text-gray-700 mb-1">
                            <span className="font-medium text-green-600">{comment.user.name || "Anonymous"}</span>{" "}
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
                </div>

                {/* Add Comment Section */}
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3"
                  />
                  <button
                    onClick={() => addComment(blog._id)}

                    className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Add Comment
                  </button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBlogs;
