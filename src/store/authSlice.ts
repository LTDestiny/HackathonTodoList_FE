import type { User } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("authToken"),
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem("authToken");
      const userString = localStorage.getItem("user");

      if (token && userString) {
        try {
          const user = JSON.parse(userString);
          state.user = user;
          state.token = token;
          state.isAuthenticated = true;
        } catch (error) {
          console.error("Failed to parse user from localStorage", error);
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      }
      state.loading = false;
    },
  },
});

export const { setCredentials, setUser, logout, setLoading, initializeAuth } =
  authSlice.actions;
export default authSlice.reducer;
