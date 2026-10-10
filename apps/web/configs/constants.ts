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

const GITHUB_TOKEN_HEADER = 'x-github-token'

export {
  GITHUB_TOKEN_HEADER,
  HttpStatusCode,
}
