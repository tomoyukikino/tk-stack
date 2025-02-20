FROM node:22-alpine AS base

WORKDIR /app

# =========================================================================== #

FROM base AS pnpm-base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=1

RUN corepack enable pnpm

# =========================================================================== #

FROM pnpm-base AS builder

ENV TURBO_TELEMETRY_DISABLED=1

RUN pnpm install --global turbo@^2

COPY . .

# https://turbo.build/repo/docs/guides/tools/docker#the-solution
RUN turbo prune web --docker

# =========================================================================== #

FROM pnpm-base AS installer

ENV TURBO_TELEMETRY_DISABLED=1

COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN pnpm build

# =========================================================================== #

FROM nginx:stable-alpine

WORKDIR /app

COPY apps/web/nginx.conf /etc/nginx/nginx.conf
COPY --from=installer /app/apps/web/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl --fail --silent http://${WEB_HOST}:${WEB_PORT}/healthcheck || exit 1

CMD ["nginx", "-g", "daemon off;"]
