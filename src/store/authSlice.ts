import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie, setCookie } from "cookies-next";

interface AuthState {
  user: null | User;
  token: null | string;
}

const initialState: AuthState = {
  user: null,
  token: (getCookie("token") as string) || null,
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    login: (state, action: PayloadAction<{ user?: User; token: string }>) => {
      if (action.payload.user) state.user = action.payload.user;
      console.log(action.payload);
      state.token = action.payload.token;
      console.log(state.token);
      setCookie("token", action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
