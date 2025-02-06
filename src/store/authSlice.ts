import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Palanquin } from "next/font/google"

interface User {
  name: string
  email: string
  phone: string
  photo: string
  role: string
}

interface AuthState {
  user: null | User
  token: null | string
}

const initialState: AuthState = {
  user: null,
  token: null
}

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    logout: (state) => {
      state.token = null
      state.user = null
    }
  }
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
