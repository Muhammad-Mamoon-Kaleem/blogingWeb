import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const myFavourite = createAsyncThunk(
  "blog/myFavourite",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/myfavourite`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    //   toast.success("Favorites fetched successfully!");
      console.log("Fetched Blogs:", data.blogs);
      return data.blogs; // Assuming `data.blogs` contains the array of blogs
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch favorites");
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const myFavouriteSlice = createSlice({
  name: "myFavourite",
  initialState: {
    myfavourite: [], // Holds the array of favorite blogs
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(myFavourite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myFavourite.fulfilled, (state, action) => {
        state.loading = false;
        state.myfavourite = action.payload; // Update state with the blogs array
        state.error = null;
      })
      .addCase(myFavourite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Assign full error payload to state.error
      });
  },
});

// Selectors
export const selectFavourite = (state) => state.myFavourite.myfavourite;
export const selectFavouriteError = (state) => state.myFavourite.error;
export const selectFavouriteLoading = (state) => state.myFavourite.loading;

export default myFavouriteSlice.reducer;
