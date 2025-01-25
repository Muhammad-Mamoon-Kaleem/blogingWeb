import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formSlice';
import blogCommentReducer from './addCommentSlice';
import blogsReducer from './blogsSlice'
import blogLikeReducer from './addLikeSlice'
import userFavrote from './addFavoriteSlice'
import myFavouriteSlice from './myFavouriteSlice'
const store = configureStore({
  reducer: {
    form: formReducer,
    blogscomment:blogCommentReducer,
    blogs:blogsReducer,
    blogLikes:blogLikeReducer,
    userfav:userFavrote,
    myFavourite:myFavouriteSlice,

  },
});

export default store;
