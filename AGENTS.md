<!-- BEGIN:nextjs-agent-rules -->

# Workflows

**請先閱讀並嚴格遵守系統 CLAUDE.md 工作流程與指令!!!**

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Tooling

`vp` 只當 runtime / 套件管理（pnpm）與 script runner 使用；本專案沒有 `vite.config.ts`，也沒安裝 vite-plus、Vitest、Oxlint、Oxfmt。

- 套件：`vp install`、`vp add <pkg>`
- Scripts 一律 `vp run <script>`（見 `package.json`）：`dev`、`build`、`lint`、`lint:fix`、`typecheck`、`drizzle:generate`、`drizzle:migrate`
- 格式由 ESLint（`@antfu/eslint-config` stylistic）負責，不用 Prettier

## Review Checklist

- [ ] `vp run lint:fix`：改動檔案並格式。Lint 由 agent 自行處理到乾淨，不要回報給使用者、也不要叫使用者去跑。
  - 只有在修正會改變程式行為或需要使用者決策時，才提出來詢問
- [ ] `vp run typecheck`：錯誤只在 `.next/types/` 是過期產物，執行 `vp exec next typegen` 後重跑
- [ ] 改了 DB schema → `vp run drizzle:generate`
- [ ] ❌ 不要執行 `vp check`、`vp test`、`vp fmt`、`vp lint`、`vp check --fix`（不適用本專案，`--fix` 會用 oxfmt 重排整個專案）