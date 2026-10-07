# Build context is the repo root: docker build -f apps/api/Dockerfile .
FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --filter api...

# Local development: source is bind-mounted by docker-compose.yml
FROM deps AS dev
ENV NODE_ENV=development
EXPOSE 3001
CMD ["pnpm", "--filter", "api", "start:dev"]

FROM deps AS build
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN pnpm --filter api build && pnpm --filter api deploy --prod /out

FROM node:24-alpine AS prod
ENV NODE_ENV=production PORT=3001
WORKDIR /app
COPY --from=build --chown=node:node /out/node_modules ./node_modules
COPY --from=build --chown=node:node /repo/apps/api/dist ./dist
COPY --from=build --chown=node:node /repo/apps/api/package.json ./
USER node
EXPOSE 3001
CMD ["node", "dist/main"]
