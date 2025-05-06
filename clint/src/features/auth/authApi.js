const { createApi, fetchBaseQuery } = require("@reduxjs/toolkit/query/react");

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9000/api",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userdata) => ({
        url: "/auth/register",
        method: "POST",
        body: userdata,
      }),
      invalidatesTags: ["Users"],
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "post",
        body: credentials,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    getCurrentUser: builder.query({
      query: () => ({
        url: "/auth/me",
      }),
    }),

    allUser: builder.query({
      query: () => ({
        url: "/auth/users",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useAllUserQuery,
  useGetCurrentUserQuery,
} = authApi;
