FROM node:22-alpine AS base

# =========================================================================== #

FROM base AS builder

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=1
RUN corepack enable pnpm

RUN apk add --no-cache gcompat

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/package.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter=server

COPY . ./

RUN pnpm build --filter=server

RUN pnpm prune --prod

# =========================================================================== #

FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/apps/server/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/apps/server/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/apps/server/package.json /app/package.json

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]
