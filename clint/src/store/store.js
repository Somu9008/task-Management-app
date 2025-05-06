import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../features/auth/authApi.js";
import authReducer from "../features/auth/authSlice.js";
import { taskApi } from "@/features/task/taskApi.js";
import taskReducer from "../features/task/taskSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    [authApi.reducerPath]: authApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },

  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      taskApi.middleware,
      authApi.middleware
    );
    de;
  },
});
