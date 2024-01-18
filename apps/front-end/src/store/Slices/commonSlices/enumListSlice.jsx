import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { enumRegistryService } from "@shiksha/common-lib";
import { get, set } from "idb-keyval";

export const fetchEnumListData = createAsyncThunk(
  "enum/fetchEnumListData",
  async () => {
    const result = await enumRegistryService.listOfEnum();
    const data = await result?.data;
    return data;
  }
);

const enumListSlice = createSlice({
  name: "enumData",
  initialState: {
    data: (await get("enumData")) || null,
    status: "idle",
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnumListData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEnumListData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        set("enumData", action.payload).catch((error) => {
          console.error("Error setting data:", error);
        });
      })
      .addCase(fetchEnumListData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { getData } = enumListSlice.actions;
export const selectenumData = (state) => state?.enumData;

export default enumListSlice.reducer;
