import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
export const addlike = createAsyncThunk(
    'blogs/like',
    async({blogId,token},{rejectWithValue})=>{
        try {
            const {data} =await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/addlike`,{blogId},{
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
            })
            toast.success(data.message)
            return data.blog.likes;
        } 
        catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
)
const bloglikeSlice=createSlice({
    name:'blogLikes',
    initialState:{
        likes:[],
        loading:false,
        error:null,
    },
    reducers:{},
     extraReducers: (builder)=>{
            builder
            .addCase(addlike.pending,(state)=>{
                state.loading=true;
                state.error=null;
            })
            .addCase(addlike.fulfilled,(state,action)=>{
                state.loading=false;
                state.likes=action.payload;
                state.userId = action.payload.userId;
            })
            .addCase(addlike.rejected,(state,action)=>{
                state.loading=false;
                state.error=action.payload.message;
            })
    
        }
})
export const selectlikes=(state)=>state.blogLikes.likes
export const selectLikeerror=(state)=>state.blogLikes.error
export const selectUserId = (state) => state.blogLikes.userId;
export default bloglikeSlice.reducer