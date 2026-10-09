import {
  MOBILE_BREAKPOINT,
  MOBILE_QUERY,
  SECONDS,
  SIDEBAR_CONFIG,
  VIEWPORT_COOKIE,
} from '@workspace/ui/lib/constants'

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
