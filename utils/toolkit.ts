export function getFormDataValue(formData: FormData, key: string) {
  const formDataValue = formData.get(key) ?? ''
  return `${formDataValue}`.trim()
}

export function isEqualWithCase(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase()
}
