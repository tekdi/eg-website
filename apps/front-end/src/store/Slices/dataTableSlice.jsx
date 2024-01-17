import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await fetch('https://dummyjson.com/users');
    const data = await response.json();
    return data;
  });


const dataTableSlice = createSlice({

    name :"dataTable",
    initialState:{data:null,status: 'idle',
    error: null,},
    reducers:{},
    extraReducers: (builder) => {
        builder
          .addCase(fetchUsers.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchUsers.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.data = action.payload;
          })
          .addCase(fetchUsers.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          });
      },
})

export const {getData} = dataTableSlice.actions
export const selectdataTable = (state) => state?.dataTable;

export default dataTableSlice.reducer