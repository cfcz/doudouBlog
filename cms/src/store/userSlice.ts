import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  userId: string;
  email: string;
  username: string;
  token: string;
}

export interface UserState {
  user: User | null;
}

const USER_STORAGE_KEY = "user";

const getUserFromStorage = () => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      return { ...JSON.parse(user), token };
    }
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: getUserFromStorage(),
  },
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem(USER_STORAGE_KEY);
    },
  },
});

export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectIsAuthenticated = (state: { user: UserState }) =>
  !!state.user.user;

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
