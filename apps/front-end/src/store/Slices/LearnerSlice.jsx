import { benificiaryRegistoryService } from "@shiksha/common-lib";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, set } from "idb-keyval";

export const fetchLearnerData = createAsyncThunk("learnerData", async () => {
  const data = await benificiaryRegistoryService.getBeneficiariesList();
  return data;
});

const learnerSlice = createSlice({
  name: "learnerData",
  initialState: {
    data: (await get("learnerData")) || null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLearnerData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLearnerData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        set("learnerData", action.payload)
          .then(() => console.log("Data stored successfully in IndexedDB"))
          .catch((error) => console.error("Error setting data:", error));
      })
      .addCase(fetchLearnerData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const getData = learnerSlice.actions;
export const selectedLearnerData = (state) => state?.learnerData;

export default learnerSlice.reducer;
