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

const NOTICE_DESCRIPTION = '此功能正在努力開發中。\n敬請期待！'

const VISIBILITY_DESCRIPTION = '選擇「公開」時，你會出現在後台的公開列表；主站個人頁不受影響。'

export {
  GITHUB_TOKEN_HEADER,
  HttpStatusCode,
  NOTICE_DESCRIPTION,
  VISIBILITY_DESCRIPTION,
}
