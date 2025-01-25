import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

// const { backendUrl} = useContext(AppContext);
export const addComment = createAsyncThunk(
    'blogs/addComments',
    async ({blogId,comment,token},{rejectWithValue})=>{
        try {
            const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/addcomment`,{blogId,comment}, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            
            return data.comments;
        } 
        catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
)

const blogCommentSlice = createSlice({
    name:'blogscomment',
    initialState:{
        comments:[],
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers: (builder)=>{
        builder
        .addCase(addComment.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(addComment.fulfilled,(state,action)=>{
            state.loading=false;
            state.comments=action.payload;
        })
        .addCase(addComment.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })

    }
});

export const selectComments = (state)=>state.blogscomment.comments;
export const selectBlogserrors = (state)=>state.blogscomment.error;
export default blogCommentSlice.reducer;