export function getFormDataValue(formData: FormData, key: string) {
  const formDataValue = formData.get(key) ?? ''
  return `${formDataValue}`.trim()
}
