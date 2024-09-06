import { User } from "../types"
import { api } from "./api"
/*  */
export const userApi = api.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<
      { token: string },
      { email: string; password: string }
    >({
      query: userData => ({ url: "/login", method: "POST", body: userData }),
    }),
    register: builder.mutation<
      { email: string; password: string; name: string },
      { email: string; password: string; name: string }
    >({
      query: userData => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),
    current: builder.query<User, void>({
      query: () => ({ url: "/current", method: "GET" }),
    }),
    getUserById: builder.query<User, string>({
      query: id => ({ url: `/users/${id}`, method: "GET" }),
    }),
    updateUser: builder.mutation<User, { userData: FormData; id: string }>({
      query: ({ userData, id }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: userData,
      }),
    }),
  }),
})
//uselazy нужно чтобы их потом вызывать самим , остальные же будут использовать при загрузке
export const {
  useCurrentQuery,
  useLoginMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
  useRegisterMutation,
  useLazyCurrentQuery,
  useLazyGetUserByIdQuery,
} = userApi
export const {
  endpoints: { login, register, updateUser, current, getUserById },
} = userApi
