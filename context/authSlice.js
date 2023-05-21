import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
    "auth/login",
    async ({ studentId, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "https://9811-197-186-26-34.ngrok-free.app/api/authentication/login",
                {
                    reg_id: studentId,
                    password: password
                },
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            const { data } = response;
            localStorage.setItem("student_id", data.student[0].id);
            localStorage.setItem("auth_token", data.token);

            return {
                authToken: data.token,
                studentInfo: data.student[0].id,
            };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        authToken: null,
        studentInfo: null,
        status: "idle",
        error: null,
    },
    reducers: {
        setAuthToken: (state, action) => {
            state.authToken = action.payload;
        },
        setStudentInfo: (state, action) => {
            state.studentInfo = action.payload;
        },
        clearAuthData: (state) => {
            state.authToken = null;
            state.studentInfo = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.authToken = action.payload.authToken;
                state.studentInfo = action.payload.studentInfo;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.message;
            });
    },
});

export const { setAuthToken, setStudentInfo, clearAuthData } = authSlice.actions;

export default authSlice.reducer;