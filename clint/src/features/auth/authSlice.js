const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  user: null,
  isLoading: true,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isLoading = false;
    },
    clearUser(state) {
      state.user = null;
      state.isLoading = false;
    },
    setMessage(state, action) {
      console.log(action);
      state.message = action.payload;
    },
    clearMessage(state) {
      state.message = "";
    },
  },
});

export const { setUser, clearUser, setMessage, clearMessage } =
  authSlice.actions;
export default authSlice.reducer;
