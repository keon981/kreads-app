enum HttpStatusCode {
  Ok = 200,
  Created, // 201
  Accepted, // 202
  NoContent = 204,
  BadRequest = 400,
  Unauthorized, // 401
  PaymentRequired, // 402
  Forbidden, // 403
  NotFound, // 404
  Gone = 410,
  InternalServerError = 500,
}

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

const SIGN_OUT_PATH = '/api/sign-out'
const UNAUTHORIZED_MESSAGE = '請先登入'

const GITHUB_TOKEN_HEADER = 'x-github-token'
const ACCOUNT_COOKIE_SALT = 'better-auth-account'
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000

const PAGE_SIZE = {
  issues: 20,
  comments: 100,
  reactions: 100,
} as const
const REACTION_EMOJI = 'heart'

export {
  ACCOUNT_COOKIE_SALT,
  GITHUB_TOKEN_HEADER,
  HttpStatusCode,
  MOBILE_BREAKPOINT,
  MOBILE_QUERY,
  PAGE_SIZE,
  REACTION_EMOJI,
  SECONDS,
  SIDEBAR_CONFIG,
  SIGN_OUT_PATH,
  TOKEN_EXPIRY_BUFFER_MS,
  UNAUTHORIZED_MESSAGE,
  VIEWPORT_COOKIE,
}
