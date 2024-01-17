// store.js
import { configureStore } from "@reduxjs/toolkit";
// import rootReducer from './rootReducer';
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
  // Add middleware or enhancers as needed
});

export default store;
