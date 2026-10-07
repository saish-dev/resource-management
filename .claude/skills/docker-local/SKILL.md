---
name: docker-local
description: Set up or change the local Docker environment - Dockerfiles for apps/api and apps/web, services in docker-compose.yml, env wiring, migrate/seed on start. Use when adding the api/web containers or changing local infra.
---

# Docker local environment

Decision: the app and its database run locally through Docker Compose. `docker-compose.yml` (repo root) already provides `db` (Postgres 16) and `redis` with healthchecks. Env comes from `.env` (copy of `.env.example`, git-ignored).

## Adding the app containers (needs apps/api and apps/web to exist)

1. `apps/api/Dockerfile`: multi-stage on `node:<lts>-alpine` with pnpm (corepack). Stages: `deps` (install with the pnpm lockfile, workspace-filtered) -> `dev` (source bind-mounted, `pnpm --filter api start:dev`) -> `build` -> `prod` (non-root user, only dist + prod deps, `prisma generate` done).
2. `apps/web/Dockerfile`: same pattern; `prod` uses Next.js `output: 'standalone'`.
3. Build context is the repo root (monorepo needs `packages/shared`); add a root `.dockerignore` (node_modules, .git, .next, dist, .env*, the prototype HTML).
4. Add `api` and `web` services to `docker-compose.yml`:
   - `api`: `build.target: dev`, `depends_on: db: condition: service_healthy`, env `DATABASE_URL` pointing at host `db` (not localhost), `REDIS_URL=redis://redis:6379`, bind mounts for source with an anonymous volume over `node_modules`, ports `3001:3001`.
   - `web`: `build.target: dev`, `NEXT_PUBLIC_API_URL`/server-side `API_URL=http://api:3001`, port `3000:3000`.
   - A one-shot `migrate` service (or api entrypoint) running `prisma migrate deploy`; seeding is explicit, never automatic: `docker compose run --rm api pnpm prisma db seed`.
5. Keep host-run development possible: `.env.example` `DATABASE_URL` uses `localhost`; compose overrides it for containers.
6. Never bake secrets into images or compose; local defaults are throwaway and labelled as such.
7. Update the Commands block in `CLAUDE.md`, plus `docs/TECH_STACK.md` and `docs/SYSTEM_ARCHITECTURE.md` if topology changes.

## Verify

- `docker compose config -q` passes.
- `docker compose up -d --build` then check `docker compose ps` is healthy, API health endpoint responds, web loads and calls the API.
- `docker compose down` keeps data; `down -v` wipes the database (confirm with the user before running).
- Report real output; if Docker isn't running, say so.
