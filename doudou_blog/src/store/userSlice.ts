import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface User {
  userId: string;
  email: string;
  username: string;
  token: string;
}

export interface UserState {
  user: User | null;
}

// Local Storage
const USER_STORAGE_KEY = "user";
const loadUserFromStorage = (): User | null => {
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

// Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: loadUserFromStorage(),
  },
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem(USER_STORAGE_KEY);
    },
  },
});

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectIsAuthenticated = (state: { user: UserState }) =>
  !!state.user.user;

// Exports
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
