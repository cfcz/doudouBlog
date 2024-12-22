import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  userId: string;
  email: string;
  username: string;
  token: string;
}

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //理解成对状态进行的处理
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser(state) {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
