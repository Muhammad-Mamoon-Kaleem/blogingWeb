import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
export const addFavourite= createAsyncThunk(
    'use/addtoFavourite',
    async ({blogId,token},{rejectWithValue})=>{
        try {
            const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/addtofavorite`,{blogId},{
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  }
        })
        toast.success(data.message)
        return {favorites:data.user.favorites,blogId};
        }
         catch (error) {
            console.log(error);
            return rejectWithValue(error.response?.data || 'Something went wrong');
        }
    }
)

 const addFavouriteSlice = createSlice({
    name:'userfav',
    initialState:{
        favorites:[],
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(addFavourite.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(addFavourite.fulfilled,(state,action)=>{
            state.loading=false;
            state.favorites=action.payload;
            state.blogId=action.payload.blogId;
            // state.blogFav = action.payload.blogFav;
        })
        .addCase(addFavourite.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload.message;
        })
    }
})
export const selectFavorites=(state)=>state.userfav.favorites
export const selectBlogId=(state)=>state.userfav.blogId
export const selectAddfavError=(state)=>state.userfav.error
// export const selectBlogfav=(state)=>state.userfav.blogFav
export default addFavouriteSlice.reducer;