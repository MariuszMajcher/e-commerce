import { configureStore } from "@reduxjs/toolkit";
import catsReducer from "./catsSlice";
import userReducer from "./userSlice";

const store = configureStore({
    reducer: {
        cats: catsReducer,
        user: userReducer
    }
});

export default store;