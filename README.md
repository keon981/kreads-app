# Kreads

[繁體中文](README.ZH_TW.md)

A Threads-style multi-user social platform that stores its content in GitHub Issues.

## 🎮 Live Demo

| | URL | Notes |
| --- | --- | --- |
| 🌐 Site | [kreads-app-virid.vercel.app](https://kreads-app-virid.vercel.app) | Browse posts without signing in |
| 📊 Dashboard | [kreads-dashboard-app.vercel.app](https://kreads-dashboard-app.vercel.app) | Sign in with the guest account below |

Dashboard guest account (read-only):

- **Email**: `admin@mail.com`
- **Password**: `123456`

## ✨ About

**GitHub Issues** 📝 = free, reliable content storage with built-in Markdown, comments, and reactions

**Threads** 🧵 = a clean short-form social network

**Kreads** 🚀 = a multi-user social network where everyone's posts live in their own GitHub repo!

Kreads doesn't keep posts in its own database. Each user's posts live in their own public GitHub repo: an Issue is a post, an Issue comment is a reply, and a Reaction is a like. The platform only stores accounts and invitations, so users always own their content.

The project is a pnpm monorepo with two Next.js apps, the main site and an admin dashboard, which share a UI component library, the database schema, and the auth setup.

## 🚀 Highlights

1. 📝 Content stored in GitHub Issues
   - Sign-up creates a public repo on the user's GitHub account; posts, replies, and likes map to Issues, Comments, and Reactions
   - Signed-in users call the GraphQL API with their own GitHub token, and visitors can browse without signing in
2. 🎟️ Invite-only sign-up
   - One-time invite codes issued by admins
   - Every user gets a personal invite link to bring in 3 friends
3. 💬 Social interactions
   - Write posts in a Markdown editor, then edit or delete them
   - Reply to and like anyone's posts
4. 📊 Admin dashboard
   - Overview: stats and trend charts for users, invite redemptions, and sign-ins
   - User management: ban, revoke sessions, delete, change roles
   - Invite code management: create, set roles, bulk delete
   - Role-based data: admins see everything, while the guest account and signed-out visitors only see public data
5. ✨ User experience
   - Responsive layout: sidebar on desktop, bottom tab bar on mobile
   - Light and dark themes
   - Skeleton loading states

## 📝 Usage

### Site

#### Sign Up

1. Open an invite link from a friend (signed-up users can copy theirs with the "Invite" button on their profile)
2. Enter a name for the repo that will store your posts
3. Sign in with GitHub
4. Kreads creates this public repo on your GitHub account (or reuses it if it already exists), and all your posts are stored there

<img src="./docs/repo.png" alt="Repo created at sign-up" width="500">

> For example, [keon981/kreads-posts](https://github.com/keon981/kreads-posts/issues)

#### Posting and Interactions

| Kreads | GitHub |
| --- | --- |
| Create a post | Opens an Issue in your repo |
| Edit a post | Updates the Issue body |
| Delete a post | Closes the Issue |
| Reply | Comments on the Issue as you |
| Like | Adds a ❤️ Reaction to the Issue or comment |

Use the "Public / Private" option in the settings menu to choose whether you appear in the dashboard's public user list.

### Dashboard

Sign in with the guest account from [Live Demo](#-live-demo) to look around:

| Page | Admin | Guest account |
| --- | --- | --- |
| Overview | All stat cards, trend charts, and recent activity | Public stat cards |
| Users | All users, with ban, revoke sessions, delete, and change role | Admins and users who chose public |
| Invite codes | All invite codes, with create, set role, and delete | Redeemed invite codes (partly masked) |

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Cache Components) + React 19 + TypeScript
- **Auth**: better-auth (GitHub OAuth, email and password sign-in, role-based access)
- **Database**: Neon Postgres + Drizzle ORM
- **GitHub API**: Octokit (REST + GraphQL)
- **Data fetching**: TanStack Query
- **State management**: Zustand
- **UI**: shadcn/ui (Base UI) + Tailwind CSS 4 + Remix Icon
- **Editor**: Tiptap (Markdown)
- **Tables and charts**: TanStack Table, Recharts
- **Validation**: Zod
- **Monorepo**: pnpm workspace + Vite+
- **Component development**: Storybook
- **Linting**: ESLint (@antfu/eslint-config)
- **Deployment**: Vercel

```text
kreads-app/
├── apps/
│   ├── web/                    # Main site
│   │   ├── app/                # Routes: profiles, posts, sign-in / sign-up, API
│   │   ├── components/         # Post, auth, and layout components
│   │   ├── services/github/    # GitHub Issues, Comments, Reactions
│   │   ├── views/              # Page components
│   │   └── proxy.ts            # Route protection, attaches the GitHub token
│   └── dashboard/              # Admin dashboard
│       ├── app/(pages)/        # Overview, users, invite codes, account settings
│       └── components/         # Data tables, stat cards, layout components
├── packages/
│   ├── ui/                     # Shared UI library (shadcn/ui) and Storybook
│   ├── server/                 # Shared database schema, migrations, auth setup
│   ├── eslint-config/          # Shared ESLint config
│   └── typescript-config/      # Shared tsconfig
└── docs/                       # README images
```

## 📦 Getting Started

### Requirements

- Node.js 22+
- pnpm 11+ and [Vite+](https://viteplus.dev/guide/) (the `vp` command)
- A [Neon](https://neon.com/) Postgres database

### 1. Create a GitHub OAuth App

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers) and click "New OAuth App"

   <img src="./docs/oauth-app.png" alt="Create a GitHub OAuth App" width="700">

2. Fill in the app details:
   - **Application name**: Kreads
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. After creating the app, copy the `Client ID` and generate a `Client Secret`

> An OAuth App only allows one callback URL, so create one for local development and one for each deployment, like `kreads-app-local` and `kreads-app-preview` in the screenshot.

### 2. Install and Configure

```bash
git clone https://github.com/keon981/kreads-app.git
cd kreads-app
vp install

cp apps/web/.env.example apps/web/.env
cp apps/dashboard/.env.example apps/dashboard/.env
cp packages/server/.env.example packages/server/.env
```

Fill in your GitHub OAuth App and database connection details, following the comments in each `.env` file.

### 3. Run

```bash
vp run drizzle:migrate   # Create the database tables
vp run dev               # Site at http://localhost:3000, dashboard at http://localhost:3001
```

---

<div align="center">

Made with ❤️ by [keon981](https://github.com/keon981)

</div>
