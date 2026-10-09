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
| `apps/web` | `web` | 主站（Next.js） |
| `packages/ui` | `@workspace/ui` | shadcn 元件、通用 hooks、`cn()` 等工具、UI 常數、`globals.css`；Storybook 設定在 `.storybook/`，story 放在元件旁（`*.stories.tsx`） |
| `packages/db` | `@workspace/db` | Drizzle schema、client、migrations、DB 腳本 |
| `packages/eslint-config` | `@workspace/eslint-config` | antfu 共用設定 |
| `packages/typescript-config` | `@workspace/typescript-config` | 共用 tsconfig |

- 套件：`vp install`；加到指定 workspace：`vp add <pkg> --filter <套件名稱>`
- 根目錄 scripts 一律 `vp run <script>`（見根目錄 `package.json`）：
  - `dev`：只跑 `web`
  - `storybook`：在 `@workspace/ui` 啟動 Storybook（http://localhost:6006）
  - `build`、`lint`、`lint:fix`、`typecheck`：跑所有 workspace
  - `drizzle:generate`、`drizzle:migrate`：在 `@workspace/db` 執行，需要 `packages/db/.env` 的 `DATABASE_URL`
- 只跑單一 workspace：`vp run -F <套件名稱> <script>`，例如 `vp run -F web build`
- 各 App 的 `build` script 必須是原生指令（`next build`），不能寫成 `vp …`：Vercel 只會在 Root Directory 執行 App 的 script，而且沒有 `vp`
- 改 `packages/ui` 時：`vp run dev` 看主站實際畫面，`vp run storybook` 看單一元件的各種變體
- shadcn：在 `apps/web` 執行 `shadcn add`，元件會裝到 `packages/ui/src/components`；不依賴主站的元件、hooks、工具函式放 `packages/ui`，業務相關的（例如 `issue-item`、`use-auth-guard`）留在 `apps/web`

## Review Checklist

- [ ] `vp run lint:fix`：改動檔案並格式。Lint 由 agent 自行處理到乾淨，不要回報給使用者、也不要叫使用者去跑。
  - 只有在修正會改變程式行為或需要使用者決策時，才提出來詢問
- [ ] `vp run typecheck`：錯誤只在 `.next/types/` 是過期產物，在 `apps/web` 執行 `vp exec next typegen` 後重跑
- [ ] 改了 DB schema → `vp run drizzle:generate`
- [ ] ❌ 不要執行 `vp check`、`vp test`、`vp fmt`、`vp lint`、`vp check --fix`（不適用本專案，`--fix` 會用 oxfmt 重排整個專案）