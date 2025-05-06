import { createSlice } from "@reduxjs/toolkit";
import { taskApi } from "./taskApi";

const initialState = {
  assignedtasks: [],
  createdtasks: [],
  loading: false,
  erorr: null,
  isPopUp: false,
  assignedName: "",
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    openPopUp: (state, action) => {
      state.isPopUp = true;
      state.assignedName = action.payload;
    },
    closePopUp: (state) => {
      state.isPopUp = false;
      state.assignedName = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addMatcher(
        taskApi.endpoints.getCreatedTasks.matchFulfilled,
        (state, action) => {
          state.createdtasks = action.payload.tasks;
        }
      )
      .addMatcher(
        taskApi.endpoints.getUserTasks.matchFulfilled,
        (state, action) => {
          state.assignedtasks = action.payload.tasks;
        }
      );
  },
});

export const { openPopUp, closePopUp } = taskSlice.actions;

export default taskSlice.reducer;
