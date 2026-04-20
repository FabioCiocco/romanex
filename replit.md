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

## Internationalization (i18n)

- **Languages**: Italian (IT, default), English (EN), Spanish (ES)
- **Translation file**: `artifacts/annunci/src/lib/i18n.ts` — complete translations for all UI text
- **Context**: `artifacts/annunci/src/contexts/LanguageContext.tsx` — React context + `useLanguage()` hook, persists lang in `localStorage` (`romanex-lang`)
- **Language banner**: `LanguageBanner` component shown on the home page (first visit, dismissible), stores dismissal in `romanex-lang-banner-dismissed`
- **Navbar switcher**: `LanguageSwitcher` dropdown (globe icon) always visible in the navbar
- **Translated components**: Navbar, Home, Footer, WelcomeBanner, GuestBar, Sezione, Categorie
- **Category names**: fetched from `t.categories[id]` to avoid hardcoding Italian names

## User Profiles

- **Table**: `user_profiles` in PostgreSQL — `clerkId` (PK), `nome`, `cognome`, `email`, `universita`, `annoCorso`, `corsoDiLaurea`, `telefono?`, timestamps
- **API**: `GET /api/profilo` + `PUT /api/profilo` (upsert) — Clerk auth required via `getAuth(req)`
- **Route file**: `artifacts/api-server/src/routes/profilo.ts`
- **Profile completion page**: `/completa-profilo` — shown automatically after sign-in if profile doesn't exist
- **Profile page**: `/profilo` — view/edit profile, accessible from Navbar avatar click
- **Auto-redirect**: `ProfileCompletionGuard` component in App.tsx checks profile on sign-in and redirects to `/completa-profilo` if not found

## Features

- **Platform**: RomaNex — bulletin board for Italian university students
- **5 sections**: Appartamenti, Libri di Testo, Ripetizioni, Consigli, Gruppi Studio
- **Guest mode**: WelcomeBanner modal on first visit + persistent GuestBar for guests
- **Search & filters**: keyword, city/campus, price range (where applicable)
- **Listing detail**: full page at `/annunci/:id` with contact reveal (auth-gated)
- **User profile system**: profile completion on sign-up, editable at `/profilo`
