const SECONDS = {
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
  week: 60 * 60 * 24 * 7,
} as const

const MOBILE_QUERY = '(max-width: 767px)'

const TIME_ZONE = 'Asia/Taipei'

export {
  MOBILE_QUERY,
  SECONDS,
  TIME_ZONE,
}
