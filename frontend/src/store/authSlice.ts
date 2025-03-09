import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../services/authService";
import { AxiosError } from "axios"; // Import AxiosError for proper error typing

interface AuthState {
  user: { email: string; name: string } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

// Define a type for user registration credentials
interface UserRegistration {
  name: string;
  email: string;
  password: string;
}

// Define a type for login credentials
interface UserLogin {
  email: string;
  password: string;
}

// Async actions
export const register = createAsyncThunk(
  "auth/register",
  async (user: UserRegistration, { rejectWithValue }) => {
    try {
      const response = await registerUser(user);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(axiosError.response?.data?.message || "Registration failed");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (user: UserLogin, { rejectWithValue }) => {
    try {
      const response = await loginUser(user);
      return response.data; // Returning only `data` part of the response
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string; success: boolean; data: null }>;
      const errorMessage = axiosError.response?.data?.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          email: action?.payload?.user?.email,
          name: action?.payload?.user?.name,
        };
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action?.payload?.access_token; // Correctly extracting token
        localStorage.setItem("token", action?.payload?.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
