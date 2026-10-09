const SECONDS = {
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
  week: 60 * 60 * 24 * 7,
} as const

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

const VIEWPORT_COOKIE = {
  name: 'viewport',
  maxAge: SECONDS.week * 52,
} as const

const SIDEBAR_CONFIG = {
  cookieName: 'sidebar_state',
  width: '20rem',
  widthMobile: '18rem',
  widthIcon: '5rem',
  keyboardShortcut: 'b',
} as const

export {
  MOBILE_BREAKPOINT,
  MOBILE_QUERY,
  SECONDS,
  SIDEBAR_CONFIG,
  VIEWPORT_COOKIE,
}
