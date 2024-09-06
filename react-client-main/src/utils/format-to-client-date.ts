/* Эта функция предназначена для форматирования даты в строку, удобную 
для отображения на клиенте. Она принимает дату в 
формате Date и возвращает отформатированную строку. */

export const formatToClientDate = (date?: Date) => {
  if (!date) {
    return ""
  }

  return new Date(date).toLocaleDateString()
}
