import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { facilitatorRegistryService } from "@shiksha/common-lib";
import { get, set } from "idb-keyval";

export const fetchIpUserData = createAsyncThunk(
  "ipData/fetchIpUserData", // Match the slice name
  async () => {
    const result = facilitatorRegistryService.getInfo();
    const data = await result;
    // console.log("fetcehd data", data);
    return data;
  }
);

const ip_ListSlice = createSlice({
  name: "ipData",
  initialState: {
    data: (await get("ipData")) || null,
    status: "idle",
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIpUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchIpUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        set("ipData", action.payload).catch((error) => {
          console.error("Error setting data:", error);
        });
      })
      .addCase(fetchIpUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const getData = ip_ListSlice.actions;
export const selectedIpData = (state) => state?.ipData;

export default ip_ListSlice.reducer;
