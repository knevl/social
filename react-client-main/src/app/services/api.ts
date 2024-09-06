import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../../constants"
import { RootState } from "../store"

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/api`,
  // Будем хранить токен пользователя в localStorage и добавлять его в заголовок запроса
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).user.token || localStorage.getItem("token")
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 1 })

/* API с использованием createApi, 
  который будет автоматически
  обновлять данные при изменении
  аргументов или монтировании компонента. 
*/
export const api = createApi({
  reducerPath: "splitApi",
  baseQuery: baseQueryWithRetry,
  // Refetch нужен, чтобы хэшированные ответы на запросы не использовались при изменении страницы.
  refetchOnMountOrArgChange: true,
  endpoints: () => ({}),
})
