# Tech Stack

Decided: **Next.js** frontend, **NestJS** backend. Items marked _(proposed)_ are recommendations to confirm.

## Frontend — `apps/web`

| Concern          | Choice                                                                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework        | Next.js (App Router), React, TypeScript (strict)                                                                                                                                                     |
| Data fetching    | TanStack Query _(proposed)_; server components for read-heavy initial loads                                                                                                                          |
| Forms/validation | React Hook Form + Zod _(proposed)_; Zod schemas shared from `packages/shared`                                                                                                                        |
| UI               | Component library matching prototype look (Atlassian-style tokens, lime-green brand `#98B828`, light/dark). Tailwind + Radix/shadcn _(proposed)_ with the prototype's tokens ported to CSS variables |
| Charts           | Lightweight (Recharts or visx) _(proposed)_                                                                                                                                                          |
| Timeline/Gantt   | Custom CSS-grid (prototype approach)                                                                                                                                                                 |
| Auth             | OIDC session via backend (cookie); login page offers Microsoft and Google                                                                                                                            |
| Tests            | Vitest + Testing Library; Playwright e2e                                                                                                                                                             |

## Backend — `apps/api`

| Concern         | Choice                                                                                                                                                                |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | NestJS, TypeScript (strict)                                                                                                                                           |
| API style       | REST + OpenAPI (`@nestjs/swagger`)                                                                                                                                    |
| Validation      | `class-validator`/`class-transformer` DTOs, or Zod pipe _(pick one; prefer Zod to share with FE)_                                                                     |
| ORM             | Prisma 7 with `@prisma/adapter-pg`; client generated to `apps/api/src/generated` (git-ignored)                                                                        |
| Database        | PostgreSQL                                                                                                                                                            |
| Auth            | OIDC via Passport (`passport-azure-ad`/`openid-client` for Microsoft, `passport-google-oauth20` or `openid-client` for Google), session cookie, RBAC guards (5 roles) |
| Jobs/scheduling | `@nestjs/schedule` + BullMQ/Redis _(proposed)_ for lock expiry, bench counter, digests                                                                                |
| Email           | SMTP/SES _(proposed)_                                                                                                                                                 |
| Export          | `exceljs`, `fast-csv`                                                                                                                                                 |
| Logging         | pino, request IDs                                                                                                                                                     |
| Tests           | Vitest (Nest 12 default) + Supertest; Testcontainers Postgres                                                                                                         |

## Repo and tooling

- Monorepo: pnpm workspaces (`apps/web`, `apps/api`, `packages/shared`).
- ESLint + Prettier, Husky + lint-staged, Conventional Commits.
- **Docker + Docker Compose for local development (decided):** `docker-compose.yml` runs Postgres 16 and Redis now; Dockerfiles and `api`/`web` services are added when the apps are scaffolded (`/docker-local`). Multi-stage Dockerfiles (dev + prod targets). `.env` git-ignored, `.env.example` committed.
- CI: GitHub Actions — lint, typecheck, test, build.
- Hosting: TBD (containers for API; Vercel or container for web).

## Prototype reference

`resource_management_v2.html` — React 18 + Atlassian design-system bundle, all state in memory. Do not ship it; use it as spec.
