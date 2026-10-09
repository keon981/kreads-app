export { cn } from 'cn'

// fr-CA 輸出 YYYY-MM-DD；固定時區避免 SSR 與 client 日期不一致
const dateFormatter = new Intl.DateTimeFormat('fr-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Taipei',
})

export function formatDateTime(value: string | number | Date) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return dateFormatter.format(date)
}
