import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchQuestionsDetails = createAsyncThunk(
    "questions/fetchQuestionsDetails",
    async (_, { getState }) => {
        const studentId = localStorage.getItem("student_id");
        const authToken = localStorage.getItem("auth-token")
        try {
            const response = await axios.get(
                `https://9811-197-186-26-34.ngrok-free.app/api/department/students/${studentId}`,{
                    headers:{
                        Authorization: `Bearer ${authToken}`
                    }
                });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

const questionsSlice = createSlice({
    name: "questions",
    initialState: {
        course: {},
        questions: [],
        status: "idle",
        error: null,
    },
    reducers: {
        resetCourseInfo: (state) => {
            state.course = {};
            state.questions = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestionsDetails.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchQuestionsDetails.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.course = action.payload.course[0];
                state.questions = action.payload.questions;
            })
            .addCase(fetchQuestionsDetails.rejected, (state, action) => {
                state.status = "failed";
                state.error = "failed"
            });
    },
});

export const { resetCourseInfo } = questionsSlice.actions;

export default questionsSlice.reducer;