# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Authentication

- **Provider**: Clerk (whitelabel, auto-provisioned)
- **Client**: `@clerk/react` in `artifacts/annunci`
- **Server**: `@clerk/express` + `clerkProxyMiddleware` in `artifacts/api-server`
- **Protected routes**: `/pubblica` requires sign-in (shows auth gate if not logged in)
- **Navbar**: shows "Accedi" button when signed out, user avatar + logout when signed in
- **Login pages**: `/sign-in` and `/sign-up` — branded to match RomaNex theme (violet/orange, Space Grotesk)
- **User management**: use the Auth pane in the workspace toolbar
