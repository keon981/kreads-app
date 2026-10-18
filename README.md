# Kreads

[繁體中文版本](README.zh-TW.md)

## ✨ Project Introduction

**GitHub Issues** 📝 = A surprisingly good place to keep notes

**Threads** 🧵 = Where short posts turn into conversations

**Kreads** 🚀 = A Threads-style microblog where every post is a GitHub Issue in your own repository!

Kreads is an invite-only, multi-user microblog built with Next.js. Each member signs in with GitHub and gets a public repository of their own; posts, comments and likes are stored as Issues, Issue comments and Reactions in that repository. A separate admin dashboard manages members and invite codes.

> Inspired by [Gwitter](https://github.com/SimonAKing/Gwitter) by [SimonAKing](https://github.com/SimonAKing), which turns GitHub Issues into a personal microblog.

## 🚀 Key Features

1. 📝 GitHub Issues Based
   - Every post is an Issue in the member's own repository, so the content always belongs to them
   - Posts are written in Markdown with a rich-text editor (Tiptap)
2. 👥 Multi-user and Invite-only
   - Sign in with GitHub OAuth (better-auth)
   - New members need an invite code: one-time codes issued from the dashboard, or a member's personal code (limited by `INVITE_LIMIT`, unlimited for admins)
   - On sign-up, Kreads finds or creates the member's public post repository
3. 👍 Social Interaction
   - Likes use one GitHub Reaction, chosen with `REACTION_EMOJI`
   - Comments on posts, with likes on comments too
   - Each member has a profile page at `/@username`
4. ✨ Experience
   - Responsive layout: sidebar on desktop, tab bar on mobile
   - Light, dark and system themes
   - Skeleton loading and post prefetching on the home profile
5. 🛠️ Admin Dashboard
   - Stats: total users, new sign-ups, logins, invite redemptions and charts
   - User management: change role, ban / unban, revoke sessions, remove
   - Invite code management: create, add notes, delete
   - A read-only `viewer` role that can be shared publicly; it only sees members who chose to be public

## 📝 Usage Instructions

### Joining

1. Open the sign-up page and enter an invite code and a repository name
2. Authorize Kreads on GitHub (scope: `public_repo`)
3. Kreads uses the repository if it already exists, or creates it as a public repository
4. You get your own personal invite code to invite others

### Publishing Content

- **Post**: Use the "New post" button; Kreads creates an Issue in your repository
- **Edit**: Edit from the post menu in Kreads, or edit the Issue directly on GitHub
- **Delete**: Delete from the post menu, which closes the Issue (closed Issues are hidden)
- **Visibility**: Under Settings > Public, choose whether you appear in the dashboard's public list; your profile page on the site is not affected

> Only open Issues created by the repository owner are shown as posts, newest first.

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Cache Components) + React 19 + TypeScript
- **Monorepo**: pnpm workspace, run through `vp`
- **UI**: shadcn/ui on Base UI, Tailwind CSS 4, Remix Icon, Storybook
- **Authentication**: better-auth (GitHub OAuth on the site, email and password on the dashboard, admin plugin for roles)
- **Database**: Neon Postgres + Drizzle ORM
- **GitHub API**: Octokit (REST + GraphQL)
- **Data Fetching**: TanStack Query, Zustand
- **Validation**: Zod, `@t3-oss/env-nextjs`
- **Charts**: Recharts
- **Code Standards**: ESLint (`@antfu/eslint-config`)
- **Deployment**: Vercel

```
kreads-app/
├── apps/
│   ├── web/                  # Main site (Next.js, port 3000)
│   │   ├── app/              # Routes: /@username, post pages, sign-in / sign-up, API
│   │   ├── components/       # Site components (issue, auth, layout)
│   │   ├── services/github/  # Octokit calls for issues, comments, reactions
│   │   ├── hooks/            # TanStack Query queries and mutations
│   │   └── views/            # Post list and post detail views
│   └── dashboard/            # Admin dashboard (Next.js, port 3001)
│       └── app/(pages)/      # dashboard, user, key (invite codes), profile
└── packages/
    ├── ui/                   # Shared shadcn components, hooks, globals.css, Storybook
    ├── server/               # Shared Drizzle schema, migrations, better-auth options
    ├── eslint-config/        # Shared ESLint config
    └── typescript-config/    # Shared tsconfig
```

## 📦 Installation & Usage

### 1. Requirements

- Node.js and pnpm 11 or later
- `vp` (Vite+) as the package manager and script runner
- A Postgres database (the project uses [Neon](https://neon.tech/))
- A GitHub OAuth App

### 2. Install

```bash
git clone https://github.com/keon981/kreads-app.git
cd kreads-app
vp install
```

### 3. Configuration Setup

#### 3.1 Create a GitHub OAuth App

1. Visit [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers) and click "New OAuth App"
2. Fill in:
   - **Homepage URL**: your site URL, e.g. `http://localhost:3000`
   - **Authorization callback URL**: `<site URL>/api/auth/callback/github`
3. Save the `Client ID` and `Client Secret`

#### 3.2 Environment Variables

Copy each `.env.example` to `.env` and fill it in. Both apps and `packages/server` use the same database.

```bash
cp apps/web/.env.example apps/web/.env
cp apps/dashboard/.env.example apps/dashboard/.env
cp packages/server/.env.example packages/server/.env
```

**`apps/web/.env`**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_APP_TITLE` | ✅ | Site title | `Kreads-APP` |
| `NEXT_PUBLIC_HOME_USERNAME` | ✅ | Username whose profile `/` redirects to (with `@`); leave empty to disable | `@keon981` |
| `BETTER_AUTH_SECRET` | ✅ | Secret for signing; `openssl rand -base64 32` | |
| `BETTER_AUTH_URL` | ✅ | Site base URL | `http://localhost:3000` |
| `GITHUB_CLIENT_ID` | ✅ | GitHub OAuth App Client ID | |
| `GITHUB_CLIENT_SECRET` | ✅ | GitHub OAuth App Client Secret | |
| `DATABASE_URL` | ✅ | Postgres connection string | |
| `DASHBOARD_URL` | ✅ | Dashboard URL, used to clear its cache | `http://localhost:3001` |
| `REVALIDATE_SECRET` | ✅ | Shared with the dashboard; `openssl rand -hex 32` | |
| `INVITE_LIMIT` | ❌ | How many people a member's personal code can invite (default `3`, admins unlimited) | `3` |
| `POST_PREFETCH_LIMIT` | ❌ | Posts to prefetch on the home profile (default `5`) | `5` |
| `REACTION_EMOJI` | ❌ | Reaction used as "like": `laugh`, `confused`, `heart`, `hooray`, `rocket`, `eyes` (default `heart`) | `heart` |
| `DEV_ALLOWED_ORIGINS` | ❌ | JSON array of extra dev origins | `'[]'` |

**`apps/dashboard/.env`**

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_APP_TITLE` | ❌ | Dashboard title | `Kreads Dashboard` |
| `BETTER_AUTH_SECRET` | ✅ | A different secret from the site | |
| `BETTER_AUTH_URL` | ✅ | Dashboard base URL | `http://localhost:3001` |
| `DATABASE_URL` | ✅ | Same database as the site | |
| `REVALIDATE_SECRET` | ✅ | Same value as the site | |

**`packages/server/.env`**: `DATABASE_URL`, used by `drizzle-kit`.

#### 3.3 Database

```bash
vp run drizzle:migrate
```

#### 3.4 First Admin and Invite Code

- The dashboard signs in with email and password and has no sign-up page, so create the first dashboard account (role `admin`, or `viewer` for a read-only account) directly in the database or with better-auth's admin API.
- Sign-up on the site needs an invite code: create one in the dashboard's invite code page, or insert a row into the `invite_code` table (set `role` to `admin` to make that member a site admin).

### 4. Run

```bash
vp run dev            # site (3000) and dashboard (3001)
vp run dev:web        # site only
vp run dev:dashboard  # dashboard only
vp run storybook      # shared UI in Storybook (6006)
```

### 5. Scripts

| Script | Description |
|--------|-------------|
| `vp run build` | Build every workspace |
| `vp run lint` / `vp run lint:fix` | ESLint check / fix |
| `vp run typecheck` | TypeScript check |
| `vp run drizzle:generate` | Generate a migration after changing the schema |
| `vp run drizzle:migrate` | Apply migrations |

### 6. Deployment

Both apps are deployed to Vercel as separate projects, with the Root Directory set to `apps/web` and `apps/dashboard`. The auth base URL is taken from Vercel's system environment variables, and `apps/web/vercel.json` only deploys the `main` and `develop` branches.

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 🙏 Acknowledgements

- [Gwitter](https://github.com/SimonAKing/Gwitter): the idea of using GitHub Issues as a microblog
- [shadcn/ui `next-monorepo` template](https://ui.shadcn.com/docs/monorepo): the monorepo structure
- [New API](https://github.com/QuantumNous/new-api): the dashboard layout

---

<div align="center">

If you like this project, don't forget to give it a ⭐!

Made with ❤️ by [keon981](https://github.com/keon981)

</div>
