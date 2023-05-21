import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import questionsReducer from "./questionDetailsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        questions: questionsReducer,
    },
});

export default store;
