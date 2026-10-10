<!-- BEGIN:nextjs-agent-rules -->

# Workflows

**請先閱讀並嚴格遵守系統 CLAUDE.md 工作流程與指令!!!**

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Tooling

`vp` 只當 runtime / 套件管理（pnpm）與 script runner 使用；本專案沒有 `vite.config.ts`，也沒安裝 vite-plus、Vitest、Oxlint、Oxfmt。

- 格式由 ESLint（`@antfu/eslint-config` stylistic）負責，不用 Prettier

## Monorepo（pnpm workspace，結構參考 shadcn `next-monorepo` 模板）

| Workspace | 套件名稱 | 內容 |
| --- | --- | --- |
| `apps/web` | `web` | 主站（Next.js，port 3000） |
| `apps/dashboard` | `dashboard` | 後台（Next.js，port 3001），版面參考 New API；只給後台帳號登入，管理使用者與邀請碼 |
| `packages/ui` | `@workspace/ui` | shadcn 元件、通用 hooks、`cn`（re-export 自 shadcn 的 `cn` 套件）、UI 常數（含時區 `TIME_ZONE`）、`formatDateTime`（`lib/format`）、`globals.css`；Storybook 設定在 `.storybook/`，stories 放在 `stories/`（不放進 `src/`） |
| `packages/server` | `@workspace/server` | 兩個 App 共用的 server 端程式碼。`src/db/`：Drizzle client 與 schema，migrations 在 `drizzle/`。`src/auth/`：better-auth 共用設定 `createAuthOptions`（adapter、`user.additionalFields`、admin plugin、`nextCookies`、`baseURL`）與 `AuthSession` 型別（`options`），以及 `ac`、`admin`／`user`／`viewer` role、`hasRole`（`access`）。`src/types/`：兩個 App 共用的型別，例如 Server Action 回傳的 `ActionState` |
| `packages/eslint-config` | `@workspace/eslint-config` | antfu 共用設定 |
| `packages/typescript-config` | `@workspace/typescript-config` | 共用 tsconfig |

- 套件：`vp install`；加到指定 workspace：`vp add <pkg> --filter <套件名稱>`
- 根目錄 scripts 一律 `vp run <script>`（見根目錄 `package.json`）：
  - `dev`：同時跑 `apps/*` 底下所有 App（`--parallel`，輸出前綴 `[套件#dev]`）
  - `dev:<套件名稱>`：只跑單一 App，例如 `dev:web`、`dev:dashboard`；新增 App 時一併加上
  - `storybook`：在 `@workspace/ui` 啟動 Storybook（http://localhost:6006）
  - `build`、`lint`、`lint:fix`、`typecheck`：跑所有 workspace
  - `drizzle:generate`、`drizzle:migrate`：在 `@workspace/server` 執行，需要 `packages/server/.env` 的 `DATABASE_URL`
- 只跑單一 workspace：`vp run <套件名稱>#<script>`（或 `vp run -F <套件名稱> <script>`），例如 `vp run web#build`
- 各 App 的 `build` script 必須是原生指令（`next build`），不能寫成 `vp …`：Vercel 只會在 Root Directory 執行 App 的 script，而且沒有 `vp`
- 改 `packages/ui` 時：`vp run dev` 看兩個 App 的實際畫面，`vp run storybook` 看單一元件的各種變體
- dashboard 的 auth：
  - 有自己的 better-auth 實例（`apps/dashboard/lib/auth.ts`），跟主站連同一個 DB；兩邊都從 `createAuthOptions` 開始，只加自己特有的設定。只開帳號密碼登入、不能註冊，只有 role 是 `admin`、`viewer` 的帳號拿得到 session。
  - 判斷 role 一律用 `hasRole`（admin plugin 的 role 可能是逗號分隔的多個值），不要直接比對字串。
  - `viewer` 是公開的遊客帳號：better-auth 層只允許 sign-in、sign-out、get-session，Server Action 和查詢也會在 server 檢查 role。
  - 後台帳號固定兩組，不在 repo、env 或任何設定檔裡；要重建時寫一次性腳本，用 `better-auth/crypto` 的 `hashPassword` 寫進 `user` 和 `account`，執行完刪除。
  - cookie 前綴是 `kreads-dashboard`（`configs/auth-config.ts`），本機兩個 App 都在 `localhost` 也不會互相覆蓋。
  - env 見 `apps/dashboard/.env.example`：`BETTER_AUTH_SECRET` 跟主站各用一組，`DATABASE_URL` 跟主站相同。
- shadcn：在 `apps/web` 執行 `vp dlx shadcn@latest add <元件>`（`apps/web` 不裝 `shadcn`），元件會裝到 `packages/ui/src/components`；不依賴主站的元件、hooks、工具函式放 `packages/ui`，業務相關的（例如 `issue-item`、`use-auth-guard`）留在 `apps/web`

## Review Checklist

- [ ] `vp run lint:fix`：改動檔案並格式。Lint 由 agent 自行處理到乾淨，不要回報給使用者、也不要叫使用者去跑。
  - 只有在修正會改變程式行為或需要使用者決策時，才提出來詢問
- [ ] `vp run typecheck`：錯誤只在 `.next/types/` 是過期產物，在 `apps/web` 執行 `vp exec next typegen` 後重跑
- [ ] 改了 DB schema → `vp run drizzle:generate`
- [ ] ❌ 不要執行 `vp check`、`vp test`、`vp fmt`、`vp lint`、`vp check --fix`（不適用本專案，`--fix` 會用 oxfmt 重排整個專案）