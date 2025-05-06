import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskApi = createApi({
  reducerPath: "taskApi",
  tagTypes: ["Tasks"],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://task-management-app-l3ar.onrender.com/api",
    credentials: "include",
  }),

  endpoints: (builder) => ({
    createTask: builder.mutation({
      query: (taskdata) => ({
        url: "/tasks",
        method: "POST",
        body: taskdata,
      }),
      invalidatesTags: ["Tasks"],
    }),

    getCreatedTasks: builder.query({
      query: () => "/tasks/created-tasks",
      providesTags: ["Tasks"],
    }),
    getUserTasks: builder.query({
      query: () => "/tasks/user-tasks",
      providesTags: ["Tasks"],
    }),

    updateTasks: builder.mutation({
      query: ({ taskId, taskdata }) => ({
        url: `/tasks/${taskId}`,
        method: "POST",
        body: taskdata,
      }),
      invalidatesTags: ["Tasks"],
    }),

    deleteTasks: builder.mutation({
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
    overDueTask: builder.query({
      query: () => ({
        url: "/tasks/overdue",
      }),
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetUserTasksQuery,
  useGetCreatedTasksQuery,
  useUpdateTasksMutation,
  useDeleteTasksMutation,
  useOverDueTaskQuery,
} = taskApi;
