# Kreads

[English Version](README.md)

## ✨ 專案介紹

**GitHub Issues** 📝 = 被低估的筆記神器

**Threads** 🧵 = 短文變成對話的地方

**Kreads** 🚀 = 一個 Threads 風格的微網誌，每則貼文都是你自己 repo 裡的 GitHub Issue！

Kreads 是用 Next.js 打造的邀請制多人微網誌。每位成員用 GitHub 登入後會擁有一個自己的公開 repo，貼文、留言、按讚分別存成該 repo 的 Issue、Issue 留言和 Reaction。另有一個獨立的後台，用來管理成員與邀請碼。

> 靈感來自 [SimonAKing](https://github.com/SimonAKing) 的 [Gwitter](https://github.com/SimonAKing/Gwitter)：把 GitHub Issues 變成個人微網誌。

## 🚀 亮點功能

1. 📝 基於 GitHub Issues
   - 每則貼文都是成員自己 repo 裡的 Issue，內容永遠屬於自己
   - 以 Markdown 撰寫，搭配富文本編輯器（Tiptap）
2. 👥 多人、邀請制
   - 使用 GitHub OAuth 登入（better-auth）
   - 新成員需要邀請碼：後台發的一次性邀請碼，或成員的個人邀請碼（人數上限由 `INVITE_LIMIT` 決定，admin 不限）
   - 註冊時自動找到或建立成員的公開貼文 repo
3. 👍 社交互動
   - 按讚使用一種 GitHub Reaction，由 `REACTION_EMOJI` 設定
   - 貼文留言，留言也能按讚
   - 每位成員都有個人頁 `/@username`
4. ✨ 使用體驗
   - 響應式版面：桌機側邊欄、手機底部 Tab Bar
   - 淺色、深色、跟隨系統三種主題
   - 骨架屏載入，首頁個人頁預取貼文
5. 🛠️ 管理後台
   - 數據統計：使用者總數、新註冊、登入次數、邀請碼核銷與圖表
   - 使用者管理：變更角色、停權／解除停權、撤銷登入、刪除
   - 邀請碼管理：建立、備註、刪除
   - 唯讀的 `viewer` 遊客帳號可公開分享，只看得到選擇公開的成員

## 📝 使用說明

### 加入

1. 開啟註冊頁，輸入邀請碼與 repo 名稱
2. 在 GitHub 授權 Kreads（權限：`public_repo`）
3. repo 已存在就直接使用，不存在則自動建立為公開 repo
4. 註冊後會得到自己的個人邀請碼，可以邀請其他人

### 發布內容

- **發文**：點「新貼文」，Kreads 會在你的 repo 建立一個 Issue
- **編輯**：從貼文選單編輯，或直接到 GitHub 編輯 Issue
- **刪除**：從貼文選單刪除，會將 Issue 關閉（已關閉的 Issue 不會顯示）
- **公開設定**：在「設定 > 公開」選擇是否出現在後台的公開列表；主站個人頁不受影響

> 只有 repo 擁有者建立且為 open 狀態的 Issue 會顯示為貼文，依建立時間由新到舊排列。

## 🛠️ 技術棧

- **框架**：Next.js 16（App Router、Cache Components）+ React 19 + TypeScript
- **Monorepo**：pnpm workspace，透過 `vp` 執行
- **UI**：shadcn/ui（Base UI）、Tailwind CSS 4、Remix Icon、Storybook
- **驗證**：better-auth（主站 GitHub OAuth、後台 Email 密碼、admin plugin 管理角色）
- **資料庫**：Neon Postgres + Drizzle ORM
- **GitHub API**：Octokit（REST + GraphQL）
- **資料請求**：TanStack Query、Zustand
- **驗證與設定**：Zod、`@t3-oss/env-nextjs`
- **圖表**：Recharts
- **程式碼規範**：ESLint（`@antfu/eslint-config`）
- **部署**：Vercel

```
kreads-app/
├── apps/
│   ├── web/                  # 主站（Next.js，port 3000）
│   │   ├── app/              # 路由：/@username、貼文頁、登入／註冊、API
│   │   ├── components/       # 主站元件（issue、auth、layout）
│   │   ├── services/github/  # Issue、留言、Reaction 的 Octokit 呼叫
│   │   ├── hooks/            # TanStack Query 的 queries 與 mutations
│   │   └── views/            # 貼文列表與貼文內頁
│   └── dashboard/            # 管理後台（Next.js，port 3001）
│       └── app/(pages)/      # dashboard、user、key（邀請碼）、profile
└── packages/
    ├── ui/                   # 共用 shadcn 元件、hooks、globals.css、Storybook
    ├── server/               # 共用 Drizzle schema、migrations、better-auth 設定
    ├── eslint-config/        # 共用 ESLint 設定
    └── typescript-config/    # 共用 tsconfig
```

## 📦 安裝與使用

### 1. 環境需求

- Node.js 與 pnpm 11 以上
- `vp`（Vite+）作為套件管理與 script runner
- Postgres 資料庫（本專案使用 [Neon](https://neon.tech/)）
- 一個 GitHub OAuth App

### 2. 安裝

```bash
git clone https://github.com/keon981/kreads-app.git
cd kreads-app
vp install
```

### 3. 設定

#### 3.1 建立 GitHub OAuth App

1. 前往 [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)，點「New OAuth App」
2. 填寫：
   - **Homepage URL**：主站網址，例如 `http://localhost:3000`
   - **Authorization callback URL**：`<主站網址>/api/auth/callback/github`
3. 記下 `Client ID` 與 `Client Secret`

#### 3.2 環境變數

把每個 `.env.example` 複製成 `.env` 並填寫。兩個 App 與 `packages/server` 連同一個資料庫。

```bash
cp apps/web/.env.example apps/web/.env
cp apps/dashboard/.env.example apps/dashboard/.env
cp packages/server/.env.example packages/server/.env
```

**`apps/web/.env`**

| 變數 | 必填 | 說明 | 範例 |
|------|------|------|------|
| `NEXT_PUBLIC_APP_TITLE` | ✅ | 網站標題 | `Kreads-APP` |
| `NEXT_PUBLIC_HOME_USERNAME` | ✅ | `/` 要導向哪位使用者的個人頁（含 `@`）；留空則不導向 | `@keon981` |
| `BETTER_AUTH_SECRET` | ✅ | 簽章用 secret：`openssl rand -base64 32` | |
| `BETTER_AUTH_URL` | ✅ | 主站網址 | `http://localhost:3000` |
| `GITHUB_CLIENT_ID` | ✅ | GitHub OAuth App Client ID | |
| `GITHUB_CLIENT_SECRET` | ✅ | GitHub OAuth App Client Secret | |
| `DATABASE_URL` | ✅ | Postgres 連線字串 | |
| `DASHBOARD_URL` | ✅ | 後台網址，用來通知後台清快取 | `http://localhost:3001` |
| `REVALIDATE_SECRET` | ✅ | 與後台同一組：`openssl rand -hex 32` | |
| `INVITE_LIMIT` | ❌ | 成員個人邀請碼可邀請人數（預設 `3`，admin 不限） | `3` |
| `POST_PREFETCH_LIMIT` | ❌ | 首頁個人頁預取幾則貼文（預設 `5`） | `5` |
| `REACTION_EMOJI` | ❌ | 按讚用的 Reaction：`laugh`、`confused`、`heart`、`hooray`、`rocket`、`eyes`（預設 `heart`） | `heart` |
| `DEV_ALLOWED_ORIGINS` | ❌ | 開發環境額外允許的來源（JSON 陣列） | `'[]'` |

**`apps/dashboard/.env`**

| 變數 | 必填 | 說明 | 範例 |
|------|------|------|------|
| `NEXT_PUBLIC_APP_TITLE` | ❌ | 後台標題 | `Kreads Dashboard` |
| `BETTER_AUTH_SECRET` | ✅ | 與主站不同的一組 secret | |
| `BETTER_AUTH_URL` | ✅ | 後台網址 | `http://localhost:3001` |
| `DATABASE_URL` | ✅ | 與主站同一個資料庫 | |
| `REVALIDATE_SECRET` | ✅ | 與主站同一組 | |

**`packages/server/.env`**：`DATABASE_URL`，給 `drizzle-kit` 使用。

#### 3.3 資料庫

```bash
vp run drizzle:migrate
```

#### 3.4 第一個管理員與邀請碼

- 後台使用 Email 密碼登入且沒有註冊頁，第一個後台帳號（角色 `admin`，或唯讀的 `viewer`）需直接在資料庫或透過 better-auth admin API 建立。
- 主站註冊需要邀請碼：可在後台「邀請碼」頁建立，或直接在 `invite_code` 資料表新增一筆（`role` 設為 `admin` 時，該成員會成為主站 admin）。

### 4. 啟動

```bash
vp run dev            # 主站（3000）與後台（3001）
vp run dev:web        # 只跑主站
vp run dev:dashboard  # 只跑後台
vp run storybook      # 共用 UI 的 Storybook（6006）
```

### 5. 指令

| 指令 | 說明 |
|------|------|
| `vp run build` | 建置所有 workspace |
| `vp run lint` / `vp run lint:fix` | ESLint 檢查／修正 |
| `vp run typecheck` | TypeScript 型別檢查 |
| `vp run drizzle:generate` | 修改 schema 後產生 migration |
| `vp run drizzle:migrate` | 套用 migration |

### 6. 部署

兩個 App 各自部署成 Vercel 專案，Root Directory 分別設為 `apps/web` 與 `apps/dashboard`。驗證用的網址會從 Vercel 系統環境變數取得，`apps/web/vercel.json` 只部署 `main` 與 `develop` 分支。

## 🤝 參與貢獻

歡迎提交 Issue 與 Pull Request！

## 🙏 致謝

- [Gwitter](https://github.com/SimonAKing/Gwitter)：用 GitHub Issues 當微網誌的點子
- [shadcn/ui `next-monorepo` 模板](https://ui.shadcn.com/docs/monorepo)：monorepo 結構
- [New API](https://github.com/QuantumNous/new-api)：後台版面

---

<div align="center">

如果你喜歡這個專案，別忘了給個 ⭐！

Made with ❤️ by [keon981](https://github.com/keon981)

</div>
