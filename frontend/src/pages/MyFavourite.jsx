import React, { useEffect, useContext, useState } from "react";
import { FaHeart, FaRegComment, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { myFavourite, selectFavourite } from "../redux/myFavouriteSlice";
import { addlike } from "../redux/addLikeSlice"; // Assuming you have a slice for likes
import { addFavourite } from "../redux/addFavoriteSlice"; // Assuming you have a slice for favorites
import { toast } from "react-toastify";

const MyFavourite = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  
  const favoriteBlogs = useSelector(selectFavourite);
  const loading = useSelector((state) => state.myFavourite.loading);
  const error = useSelector((state) => state.myFavourite.error);
  
    const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [Favourites, setFavourites] = useState([]);
  
  useEffect(() => {
    
      dispatch(myFavourite({ token }));
    // } else {
    //   toast.warning("Please log in to view your favorite blogs.");
    //   navigate("/login");
    // }
  }, [dispatch]);

  useEffect(()=>{
    setFavourites(favoriteBlogs)
  },[favoriteBlogs]);

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
        setFavourites((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === id ? { ...blog, likes: updatedLikes } : blog
          )
        );
      })
      .catch((error) => {
        toast.error("Failed to add like. Please try again.");
      });
  };

  const handleFavourite = (id) => {
    if (!token) {
      navigate("/login");
      toast.warning("Please log in before adding to favorites.");
      return;
    }
    dispatch(addFavourite({ blogId: id, token }))
      .unwrap()
      .then(() => {
        setFavourites((prevFavourites) =>
          prevFavourites.filter((blog) => blog._id !== id)
        );
      })
      .catch((error) => {
        toast.error("Failed to add to favorites. Please try again.");
      });
  };

  const handleCommentClick = (id) => {
    navigate(`/blogdetail/${id}`);
  };

  if (loading) return <p>Loading your favorite blogs...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">My Favorite Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start auto-rows-[minmax(0, auto)]">
        {Array.isArray(Favourites) && Favourites.length > 0 ? (
          Favourites.map((blog) => (
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
                  By {blog.author} | {new Date(blog.date).toLocaleDateString()}
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
                    className="flex items-center justify-center w-10 h-10 rounded-full transition-colors bg-pink-200 text-pink-500 hover:text-pink-600 hover:bg-pink-300"
                  >
                    <FaHeart size={18} />
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    {blog.likes.length} Likes
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                   onClick={() =>
                    navigate(`/blogdetail/${blog._id}`, { state: { blog } })
                  }
                    className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full text-green-500 hover:bg-green-200 transition-colors"
                  >
                    <FaRegComment size={18} />
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    {blog.comments.length} Comments
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFavourite(blog._id)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors bg-yellow-500 text-white hover:bg-yellow-200`}
                  >
                    <FaStar size={18} />
                  </button>
                  <span className="text-sm text-gray-700 font-medium">
                    {blog.favorites} Favorited
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No favorite blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default MyFavourite;
