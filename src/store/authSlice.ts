import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

interface AuthState {
  user: null | User;
  token: null | string;
}

const userCookie = getCookie("user");

const initialState: AuthState = {
  user: userCookie ? (JSON.parse(userCookie as string) as User) : null,
  token: (getCookie("token") as string) || null,
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    login: (state, action: PayloadAction<{ user?: User; token: string }>) => {
      if (action.payload.user) state.user = action.payload.user;
      state.token = action.payload.token;
      setCookie("token", action.payload.token, {
        maxAge: 60 * 60 * 24 * 7,
      });
      setCookie("user", action.payload.user, {
        maxAge: 60 * 60 * 24 * 7,
      });
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      deleteCookie("token");
      deleteCookie("user");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
