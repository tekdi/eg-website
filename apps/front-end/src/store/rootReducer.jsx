// mainSlice.js
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./Slices/userSlice";
import dataTableReducer from "./Slices/dataTableSlice";

const rootReducer = combineReducers({
  user: userReducer,
  dataTable: dataTableReducer,
  // Add more child slices as needed
});

export default rootReducer;
