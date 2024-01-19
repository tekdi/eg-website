// userSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { get, set } from 'idb-keyval';

const userSlice = createSlice({
  name: 'user',
  initialState: {data: await get("data") || {} },
  reducers: {
    setUser:  (state, action) => {
      state.data = action.payload;
       set('data', action.payload)
    .then(() => {
        console.log('Data set successfully');
    })
    .catch((error) => {
        console.error('Error setting data:', error);
    });
    },
  },
});

export const { setUser } = userSlice.actions;
export const selectUser = (state) => state?.user?.data;
export default userSlice.reducer;
