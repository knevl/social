import { useCurrentQuery } from "../../app/services/userApi"
import { Spinner } from "@nextui-org/react"
/* проверка аутентификации перед отображением контента */
export const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const { isLoading } = useCurrentQuery()
  if (isLoading) {
    return (
      <div className="grid justify-items-center ">
        <Spinner />
      </div>
    )
  }

  return children
}
