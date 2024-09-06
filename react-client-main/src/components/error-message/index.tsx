/* error = "": Устанавливает значение по умолчанию для error, 
если оно не передано. Если error не будет передано в компонент,
 оно примет значение пустой строки (""). */

const ErrorMessage = ({ error = "" }: { error: string }) => {
  return error && <p className="text-red-500 text-small">{error}</p>
}

export default ErrorMessage
