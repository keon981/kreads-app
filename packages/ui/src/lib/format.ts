import { TIME_ZONE } from '@workspace/ui/configs/constants'

const dateFormatter = new Intl.DateTimeFormat('sv-SE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: TIME_ZONE,
})

const dateTimeFormatter = new Intl.DateTimeFormat('sv-SE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TIME_ZONE,
})

interface FormatDateTimeOptions {
  withTime?: boolean
}

export function formatDateTime(value: string | number | Date, { withTime = true }: FormatDateTimeOptions = {}): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return (withTime ? dateTimeFormatter : dateFormatter).format(date)
}
