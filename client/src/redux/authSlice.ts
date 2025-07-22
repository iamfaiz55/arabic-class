import { createSlice } from '@reduxjs/toolkit';
import { authApi, AuthResponse } from './authApi';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getUserFromLocalStorage = (): AuthResponse | null => {
    try {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
    }
};
const initialState: AuthState = {
 user: getUserFromLocalStorage(),
token: getUserFromLocalStorage()?.token || null, 
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) =>
        builder
            .addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
                localStorage.setItem("token", JSON.stringify(payload.result.token));
                localStorage.setItem("user", JSON.stringify(payload.result));
                state.token = payload.result.token
                state.user = payload.result || null; // Ensure token is stored
            })
            
});

export const {  logout } = authSlice.actions;
export default authSlice.reducer;