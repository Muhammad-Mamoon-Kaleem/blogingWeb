
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchAllBlogs = createAsyncThunk(
    'blogs/fetchblogs',
    async(_,{rejectWithValue})=>{
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getallblogs`);
            return data.allBlogs;
          }
           catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
          }
    }
)
const blogSlice = createSlice({
    name:'blogs',
    initialState:{
        blogs:[],
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builders)=>{
        builders
        .addCase(fetchAllBlogs.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchAllBlogs.fulfilled,(state,action)=>{
            state.loading=false;
            state.blogs=action.payload;
        })
        .addCase(fetchAllBlogs.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
    }
})
export const selectAllBlogs = (state) => state.blogs.blogs;
export const selectBlogsLoading = (state) => state.blogs.loading;
export const selectBlogsError = (state) => state.blogs.error;

export default blogSlice.reducer;